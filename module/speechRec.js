/** SpeechRecognition を使って録音 **/
const SpeechRecognition =
    webkitSpeechRecognition || SpeechRecognition
const recognition = new SpeechRecognition()

recognition.lang = 'ja-JP'

recognition.onresult = (event) => {
    const textInfo = event.results[event.results.length - 1][0];
    const message = textInfo.transcript;

    /** 録音データを api/ConvertVoice へリクエスト **/
    xhr = new XMLHttpRequest;
    // Request 生成
    xhr.open('post', "http://localhost:3001/api/responceAI", true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=utf8');
    xhr.send(JSON.stringify({"value":message}));
    // Responce の処理
    xhr.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            // 発言を設
            const uttr = new SpeechSynthesisUtterance()
            var answer = JSON.parse(this.responseText).answer
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
            $('.aiAnswer').text(answer)
            addChatUI(answer, "right")
        }
    }
    $('.userQ').text(message)
    addChatUI(message.toString(), "left")

    $('body,html').animate({scrollTop:1000}, 200, 'swing');
}

$(function() {
    $('.start').on('click', () => {
        recognition.start()
    })
})

function addChatUI(sentence, position) {
  const leftImg = "https://stand-4u.com/stand-4u/wp-content/uploads/2019/09/s4man.png"
  const rightImg = "assets/img/babyIcon.png"

  // 追加元
  let talkElement = document.getElementById('qaTalk')


  // balloon_1生成
  let balloon = document.createElement('div')
  balloon.className = (position == "left")? "balloon_l" : "balloon_r"
  balloon.style = "padding-right:5px; padding-left:5px"

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

  saysDiv.appendChild(pTag)

  balloon.appendChild(faceiconDiv)
  balloon.appendChild(saysDiv)

  talkElement.appendChild(balloon)
}
