const url = require('url');
const http = require('http');
const fs = require('fs');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let negativeCount = 0

// app.jsで定義した socketIo を使う
// TODO: ファイルの関係性がカオスなので、後で整理する
socketIo.on("connection", (socket) => {

    // ユーザの質問を短縮化
    socket.on('confQuetion', (quetion) => {
        var shortQuetion = "「" + quetion + "」の文を短縮してください。"
        // 質問の短縮化
        requestOpenAI(shortQuetion, true)
    })

    socket.on('Q&A', (quetion) => {
        var mainQuetion = "「" + quetion + "」の回答を200文字以内で答えてください。"
        if (negativeCount <= 3) {
            // negativeCount が３回以下ならOpen AIに回答させる
            requestOpenAI(mainQuetion)
        } else {
            // 人が代わりに回答するため、何もしない

        }
    })
})


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
            socketIo.emit('Q&A', answer);
        }
    }
}

