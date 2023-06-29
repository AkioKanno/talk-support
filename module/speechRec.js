/** SpeechRecognition を使って録音 **/
const SpeechRecognition =
    webkitSpeechRecognition || SpeechRecognition
const recognition = new SpeechRecognition()

var socket = io()

recognition.lang = 'ja-JP'
recognition.onresult = (event) => {
    // 音声を文字化したものの取得
    const textInfo = event.results[event.results.length - 1][0];
    const text = textInfo.transcript;
    var quetion = text.toString().replace("LINEも", "LINEMO")
    var quetion = text.toString().replace("LINE も", "LINEMO")
    // 画面に質問を反映
    this.addChatUI(quetion.toString(), "left")

    socket.emit('shortQuetion', quetion)
    socket.emit('quetion', quetion)
    socket.emit('worker', quetion)
}

// サーバからのチャット受け取り時の処理
socket.on('answer', function(msg) {
    addChatUI(msg, "right")
    speechText(msg)
    $('body,html').animate({scrollTop:10000}, 200, 'swing');
})

$(function() {
    $('.start').on('click', () => {
        recognition.start()
    })
})

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

/**
 * テキストの読み上げ
 *
 * @param sentence 読み上げるテキスト
 */
function speechText(sentence) {
    const uttr = new SpeechSynthesisUtterance()
    // Speech Text設定
    uttr.text = sentence
    uttr.lang = "ja-JP"
    // 速度を設定
    uttr.rate = 0.9
    // 高さを設定
    uttr.pitch = 1.1
    // 音量を設定
    uttr.volume = 1.3
    // 発言を再生 (必須)
    window.speechSynthesis.speak(uttr)
}

