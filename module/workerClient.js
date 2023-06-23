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
    var answer = text.toString().replace("LINEも", "LINEMO")
    var answer = text.toString().replace("LINE も", "LINEMO")
    // 画面に質問を反映
    this.addChatUI(answer.toString(), "right", true)

    socket.emit('answer', answer)
    $('body,html').animate({scrollTop:10000}, 200, 'swing');
}

// サーバからユーザ質問の受け取り時の処理
socket.on('quetion', function(msg) {
    addChatUI(msg, "left")
    $('body,html').animate({scrollTop:10000}, 200, 'swing');
})

// サーバからのチャット受け取り時の処理
socket.on('aiAnswer', function(msg) {
    addChatUI(msg, "right")
    $('body,html').animate({scrollTop:10000}, 200, 'swing');
})

// AIから人にSwitchを検知
socket.on('switch', function(msg) {
    addSwitchMessage(msg)
    $('body,html').animate({scrollTop:10000}, 200, 'swing');
})

socket.on('quetionCount', function(count) {
    let pTag = document.getElementById('quetionCount')
    pTag.textContent = count
})

$(function() {
    $('.start').on('click', () => {
        recognition.start()
    })
})

$(function() {
    $('#resetCount').on('click', () => {
        socket.emit('resetCount', 0)
    })
})

$(function() {
    $('#isAIanswer').on('click', () => {
        let checkElement = document.getElementById('isAIanswer')
        if (checkElement.checked) {
            socket.emit('isAIanswer', "ON")
        } else {
            socket.emit('isAIanswer', "OFF")
        }
    })
})

function addSwitchMessage(msg) {
  // 追加元
  let qaTalk = document.getElementById('qaTalk')
  let divTag = document.createElement('div')
  divTag.classList.add("alert")
  divTag.classList.add("alert-danger")
  divTag.role = "alert"
  divTag.textContent = msg

  qaTalk.appendChild(divTag)
  
}

/**
 * チャットのUIを画面追加
 *
 * @param sentence : チャットで表示したい文言
 * @param position : チャットの左か右か(ユーザ発言は左、AI発言は右)
 */
function addChatUI(sentence, position, isWorker = false) {
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
  saysDiv.className = (isWorker)? "says2": "says"
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

