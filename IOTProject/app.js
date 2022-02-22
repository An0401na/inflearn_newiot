// mqtt 서버에 발행된 온습도 데이터를 nodejs로 읽어오기 mqtt topic 은 dht11

const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://~~~mqtt서버의 ip 주소넣기~~~~");

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
});
