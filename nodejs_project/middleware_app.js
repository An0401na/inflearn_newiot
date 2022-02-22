const express = require("express");
const server = express();

//Middleware 사용하기
//미들웨어는 클라이언트가 서버에 요청을 했을때 특정 페이지를 처리하기 전에 서버에서 공통적으로 해야하는 작업들

server.use(express.static(__dirname + "/public"));
//express.static은 특정 파일의 경로를 공통으로 사용하도록 지정는 것.

server.use((req, res, next) => {
  //클라이언트의 모든 요청은 use 라는 middleware 함수로 요청을 받게 된다.(get, post 방식과 상관없이 모두 use를 통과해야함)
  console.log("hihi~~!");
  req.user = { bit: "1234" }; //json코드로 req 객체에 user라는 인자를 만들어서 bit 는 1234라고 할당함
  next(); //다음작업으로 넘어가도록 하는 명령어
});

//왜 다음 경로 안갈까? indet.html 화면이 열려야하는데..? => use에 next 를 추가해보자!

server.get("/", (req, res) => {
  console.log(req.user); //user에 정보 출력
  res.sendFile(__dirname + "/index.html");
});
server.get("/about", (req, res) => {
  res.sendFile(__dirname + "/about.html");
});

//순차적으로 내려오면서 확인했을때 경로가"/"도 아니고"/about"도 아닌 경로일때 404에러페이지를 만들어 연결하도록 하자
server.use((req, res) => {
  res.sendFile(__dirname + "/404.html");
});

server.listen(3000, (err) => {
  console.log("The server is listening on port 3000");
});
