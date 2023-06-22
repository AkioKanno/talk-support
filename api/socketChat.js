const url = require('url');
const http = require('http');
const fs = require('fs');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let quetionCount = 0
let isNagative = false

// app.jsで定義した socketIo を使う
// TODO: ファイルの関係性がカオスなので、後で整理する
socketIo.on("connection", (socket) => {

    // ユーザの質問を短縮化
    socket.on('shortQuetion', (quetion) => {
        var shortQuetion = "「" + quetion + "」の文を短縮してください。"
        // 質問の短縮化
        requestOpenAI(shortQuetion, true)
    })

    // ユーザのメインの質問
    socket.on('quetion', (quetion) => {
        ++quetionCount
        socketIo.emit('quetion', quetion)

        // Open AI APIに渡す形に整形
        var mainQuetion = "「" + quetion + "」の回答を200文字以内で答えてください。"
        if (quetionCount <= 2) {
            checkNegative(mainQuetion) } else {
            // 人が代わりに回答するため、何もしない
            socketIo.emit('switch', "質問頻度が高いため、AIに代わり回答してください");
        }
    })

    socket.on('answer', (answer) => {
        socketIo.emit('answer', answer);
        // 将来的にWorkerの回答を溜め込んで学習させる
    })
})

function checkNegative(quetion) {
    var emotion = "「" + quetion + "」の文章が「ネガティブ」か「ポジティブ」か「中立」のいずれかで５文字以内で回答して"
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
            console.log("EMOTION  : " + resText)
            if (resText == "ネガティブ") {
                socketIo.emit('switch', "ネガティブな質問が来ました。AIに代わり回答してください");
            } else {
                requestOpenAI(quetion)
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
                    "質問ありがとうございます。" + resJson.answer + " の質問ですね":resJson.answer
            // 回答をチャットで返却
            socketIo.emit('answer', answer);
            if (!isShortQuetion) {
                // Workerには短縮質問は送らない
                socketIo.emit('aiAnswer', answer);
            }
        }
    }
}

