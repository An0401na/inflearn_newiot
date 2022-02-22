// mqtt 서버에 발행된 온습도 데이터를 nodejs로 읽어오기 mqtt topic 은 dht11

const express = require("express");
const mqtt = require("mqtt");
const DHT11 = require("./models/DHT11");
const client = mqtt.connect("mqtt://~~~mqtt서버의 ip 주소넣기~~~~");

const DHT11 = require("./models/DHT11"); //dht11 모듈불러오기
const app = express(); //express 모듈을 이용하여 웹서버 만들기
const http = require("http");
const { default: mongoose } = require("mongoose");
require("dotenv/config");

//mqtt로 접속하기 위 mqtt.connect()에서 접속이 성공적으로 이뤄지면 아래 코드의 connect 이벤트가 발생됨
client.on("connect", () => {
  console.log("mqtt connect");
  client.subscribe("dht11"); //즉 , mqtt와 연결되자마자 dht11 topic으로 구독
});

//dht11의 topic으로 mqtt에 데이터가 들어왔을때 message 라는 이벤트가 일어나도록 해서 dht11 topic으로 들어온 데이터를 가지고 옴
client.on("message", async (topic, message) => {
  var obj = JSON.parse(message); //아두이노에서 json 형식의 데이터를 전송하였기 때문에 message를 json 객체로 변환 해준다.
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth();
  var today = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  obj.created_at = new Date(
    Date.UTC(year, month, today, hours, minutes, seconds)
  ); // obj에 created_at이라는 속성에 현재 시간을 넣어준다.
  console.log(obj);

  const dht11 = new DHT11({
    tmp: obj.tmp,
    hum: obj.hum,
    created_at: obj.created_at,
  }); // dht11 객체 생성

  try {
    // 데이터를 저장하는데 오류가 발생할 수 있다 예외처리를 통해 처리하자
    const saveDHT11 = dht11.save(); // 데이터 베이스에 저장
    console.log("date insert okay ~ ");
  } catch (err) {
    console.log({ message: err });
  }
});

// express 모듈을 이용하여 웹 서버 만들기
app.set("port", "3000");
var server = http.createServer(app);

server.listen(3000, (err) => {
  if (err) {
    return console.log(err);
  } else {
    console.log("server ready");
    // 몽고 db랑 연결시도
    mongoose.connect(
      process.env.MONGODB_URL,
      {
        useNewUrlParse: true,
        useUnifiedTopology: true,
      },
      () => {
        console.log("Connected to DB !! ");
      }
    );
  }
});
