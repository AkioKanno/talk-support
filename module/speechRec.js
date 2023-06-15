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
        }
    }
    $('.userQ').text(message)
}

$(function() {
    $('.start').on('click', () => {
        recognition.start()
    })
})

