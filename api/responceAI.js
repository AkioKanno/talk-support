const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(express.json())


app.post("/api/responceAI", function(req, res) {
  res.header('Access-Control-Allow-Methods', 'POST');

  console.log(req.body);

  // レスポンスのデータ
  const responseObjectData =
    { answer : "AIからの回答をここに入れてFrontに返却する"};


  // データの返却
  res.json(responseObjectData);
});

// ポート3001番でlistenする
app.listen(3001);
