const url = require('url');
const http = require('http');
const fs = require('fs');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let quetionCount = 0
let isAIanswer = true
let isNagative = false

// app.jsで定義した socketIo を使う
// TODO: ファイルの関係性がカオスなので、後で整理する
socketIo.on("connection", (socket) => {

    // ユーザの質問を短縮化
    socket.on('shortQuetion', (quetion) => {
        if (quetion.length <= 8) {
            // 質問内容が短すぎる場合は短縮しない
            return
        }
        var shortQuetion = "「" + quetion + "」の文を短縮してください。"
        // 質問の短縮化
        requestOpenAI(shortQuetion, true)
    })

    // ユーザのメインの質問
    socket.on('quetion', (quetion) => {
        ++quetionCount
        socketIo.emit('quetionCount', quetionCount)
        socketIo.emit('quetion', quetion)

        if (!isAIanswer) {
            socketIo.emit('switch', "AI 回答 OFF のため、AIに代わり回答してください");
            return
        }

        // Open AI APIに渡す形に整形
        if (quetionCount <= 3) {
            checkNegative(quetion) } else {
            // 人が代わりに回答するため、何もしない
            socketIo.emit('switch', "質問頻度が多いため、AIに代わり回答してください");
        }
    })

    socket.on('answer', (answer) => {
        socketIo.emit('answer', answer);
        // 将来的にWorkerの回答を溜め込んで学習させる
    })
    socket.on('resetCount', (answer) => {
        quetionCount = 0
        socketIo.emit('quetionCount', quetionCount)
    })
    socket.on('isAIanswer', (answer) => {
        isAIanswer = (answer == "ON")? true: false
    })
})

function checkNegative(quetion) {
    var emotion = "「" + quetion + "」の文章が「ネガティブ」か「ポジティブ」か「中立」のいずれかで５文字以内で回答してください。"
    // Open AI APIに渡す形に整形
    //var mainQuetion = "「" + quetion + "」の回答を200文字以内で答えてください。"
    var mainQuetion = quetion
    xhr = new XMLHttpRequest;
    var reqJson = {"quetion" : emotion}

    // Request 生成
    xhr.open('post', "http://localhost:3001/api/responceAI", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(reqJson));
    // Responce の処理
    xhr.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            var resJson = JSON.parse(this.responseText)
            var resText = resJson.answer.replace(/^ください。\n\n/g, "")
            var resText = resText.replace(/^ください\n\n/g, "")
            var resText = resText.replace(/\n/g, "")
            var resText = resText.replace(/。/g, "")
            console.log("EMOTION  : " + resText)
            socketIo.emit('emotion', resText);

            if (resText == "ネガティブ") {
                socketIo.emit('switch', "ネガティブな質問が来ました。AIに代わり回答してください");
            } else {
                requestOpenAI(mainQuetion)
            }
        }
    }
}

/**
 * OpenAI API に質問をする
 * TODO: 自分自分にAPIを投げているから、本来投げる必要はない(そのうち直す)
 *
 * @param quetion : 質問内容
 */
function requestOpenAI(quetion, isShortQuetion = false) {
    xhr = new XMLHttpRequest;
    var reqJson = {"quetion" : quetion}

    // Request 生成
    xhr.open('post', "http://localhost:3001/api/responceAI", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(reqJson));
    // Responce の処理
    xhr.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            var resJson = JSON.parse(this.responseText)
            // 質問の短縮なら、つなぎの文章を入れて返却する
            var answer = (isShortQuetion)?
                    "ご利用ありがとうございます。" + resJson.answer + " に関するお問い合わせですね。":resJson.answer
            // 回答をチャットで返却
            socketIo.emit('answer', answer);
            if (!isShortQuetion) {
                // Workerには短縮質問は送らない
                socketIo.emit('aiAnswer', answer);
            }
        }
    }
}

