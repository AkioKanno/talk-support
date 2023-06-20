/** SpeechRecognition を使って録音 **/
const SpeechRecognition =
    webkitSpeechRecognition || SpeechRecognition
const recognition = new SpeechRecognition()

recognition.lang = 'ja-JP'
recognition.onresult = (event) => {
    // 音声を文字化したものの取得
    const textInfo = event.results[event.results.length - 1][0];
    const quetion = textInfo.transcript;
    // 画面に質問を反映
    this.addChatUI(quetion.toString(), "left")

    var shortQuetion = "「" + quetion + "」の文を短縮して"
    console.log(shortQuetion)
    // OpenAIに質問を投げる
    this.makeShortQuetion(shortQuetion)
    this.requestOpenAI(quetion)

    // 一番下までスクロール(固定値：1000px分下にスクロール)
    // TODO: チャットの長さ分下スクロールするようにいつか頑張る
    $('body,html').animate({scrollTop:10000}, 200, 'swing');
}

$(function() {
    $('.start').on('click', () => {
        recognition.start()
    })
})
/**
 * OpenAI API に質問をする
 *
 * @param quetion : 質問内容
 */
function makeShortQuetion(quetion) {
    xhr = new XMLHttpRequest;
    var qCount = Number($("#quetionCount").val())
    var reqJson = {
        "quetion"        : quetion,
        "quetionCount"   : qCount + 1,
        "emotionalValue" : $("#emotionalValue").val()
    }


    // Request 生成
    xhr.open('post', "http://localhost:3001/api/responceAI", true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=utf8');
    xhr.send(JSON.stringify(reqJson));
    // Responce の処理
    xhr.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            // 発言を設
            const uttr = new SpeechSynthesisUtterance()
            console.log("---- Short Quetion -----")
            console.log(this.responseText)
            var resJson = JSON.parse(this.responseText)
            var answer = "質問ありがとうございます。" + resJson.answer + " についての質問ですね。"
            var emotionalValue = resJson.emotionalValue
            console.log(answer)
            // Speech Text設定
            uttr.text = answer
            uttr.lang = "ja-JP"
            // 速度を設定
            uttr.rate = 0.8
            // 高さを設定
            uttr.pitch = 1.1
            // 音量を設定
            uttr.volume = 1.3
            // 発言を再生 (必須)
            window.speechSynthesis.speak(uttr)
            addChatUI(answer, "right")
            // hidden Parameterに設置
            document.getElementById("emotionalValue").value = resJson.emotionalValue
        }
    }
}

/**
 * OpenAI API に質問をする
 *
 * @param quetion : 質問内容
 */
function requestOpenAI(quetion) {
    xhr = new XMLHttpRequest;
    var qCount = Number($("#quetionCount").val())
    var reqJson = {
        "quetion"        : quetion,
        "quetionCount"   : qCount + 1,
        "emotionalValue" : $("#emotionalValue").val()
    }


    // Request 生成
    xhr.open('post', "http://localhost:3001/api/responceAI", true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=utf8');
    xhr.send(JSON.stringify(reqJson));
    // Responce の処理
    xhr.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            // 発言を設
            const uttr = new SpeechSynthesisUtterance()
            console.log(this.responseText)
            var resJson = JSON.parse(this.responseText)
            var answer = resJson.answer.replace(/^ください/g,"")
            var emotionalValue = resJson.emotionalValue
            console.log(answer)
            // Speech Text設定
            uttr.text = answer
            uttr.lang = "ja-JP"
            // 速度を設定
            uttr.rate = 0.8
            // 高さを設定
            uttr.pitch = 1.1
            // 音量を設定
            uttr.volume = 1.3
            // 発言を再生 (必須)
            window.speechSynthesis.speak(uttr)
            addChatUI(answer, "right")
            // hidden Parameterに設置
            document.getElementById("emotionalValue").value = resJson.emotionalValue
            document.getElementById("quetionCount").value = qCount + 1
            document.getElementById("secondsTime").value = resJson.secondsTime
        }
    }
}

/**
 * チャットのUIを画面追加
 *
 * @param sentence : チャットで表示したい文言
 * @param position : チャットの左か右か(ユーザ発言は左、AI発言は右)
 */
function addChatUI(sentence, position) {
  const leftImg = "https://stand-4u.com/stand-4u/wp-content/uploads/2019/09/s4man.png"
  const rightImg = "assets/img/babyIcon.png"

  // 追加元
  let talkElement = document.getElementById('qaTalk')
  // balloon_1生成
  let balloon = document.createElement('div')
  balloon.className = (position == "left")? "balloon_l" : "balloon_r"
  // div faceicon
  let faceiconDiv = document.createElement('div')
  faceiconDiv.className = "faceicon"
  // image
  let imageIcon = document.createElement('img')
  imageIcon.src = (position == "left")? leftImg : rightImg;
  imageIcon.alt = ""
  faceiconDiv.appendChild(imageIcon)
  // div says
  let saysDiv = document.createElement('div')
  saysDiv.className = "says"
  // p
  let pTag = document.createElement('p')
  pTag.textContent = sentence
  if (position == "right") {
    pTag.style = "font-family:Hannotate SC"
  }

  saysDiv.appendChild(pTag)
  balloon.appendChild(faceiconDiv)
  balloon.appendChild(saysDiv)
  talkElement.appendChild(balloon)
}
