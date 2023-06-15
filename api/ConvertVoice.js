const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(express.json())

// レスポンスのデータ
const responseObjectData = {
  textObject1 : {
    title: 'Objectのタイトル1です',
    subTitle: 'Objectのサブタイトル1です',
    bodyText: 'Objectの本文1です'
  },
};

app.post("/api/ConvertVoice", function(req, res) {
  res.header('Access-Control-Allow-Methods', 'POST');

  console.log(req.body);

  // データの返却
  res.json(responseObjectData);
});

// ポート3001番でlistenする
app.listen(3001);
