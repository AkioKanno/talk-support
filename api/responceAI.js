const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(express.json())


app.post("/api/responceAI", function(req, res) {
  res.header('Access-Control-Allow-Methods', 'POST');

  // 1. ユーザの質問抽出
  const question = req.body.value.toString()
  console.log("User Question : " + question)

  // 2. 音声変換APIの呼び出し


  // 3. レスポンスのデータ
  const responseObjectData =
    { answer : "回答はまだ未実装のため、今は固定値でしゃべっています"};


  // データの返却
  res.json(responseObjectData);
});

// ポート3001番でlistenする
app.listen(3001);
