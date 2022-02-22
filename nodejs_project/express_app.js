const express = require("express");
const server = express(); //server  라는 이름으로  express 객체 생성

//클라이언트가 서버로 요청하는 방식(get, post)에 따라 서버가 어떻게 처리 할 건지 작성
//      post 방식은 회원가입, 게시판에 글쓰기 입력된 정보를 서버로 넘기는 것을 요청하는 경우
//      get 방식 url을 통해서 서버로 요청하는 대부분의 일반적인 방식

//get 방식 요청 처리
//경로가 "/" 로 요청되면 index.html 페이지를 보여질 수 있도록 함
server.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html"); //__dirname -> express_app.js 이 존재하는 파일위치를 가지고 옴
});

server.get("/about", (req, res) => {
  res.sendFile(__dirname + "/about.html");
});

server.listen(3000, (err) => {
  //err 변수에 에러 메시지를 넣고 함수 내용을 실행
  //3000번 포트가 이미 사용중이여서 개방이 안되는 경우 발생하는 오류를 처리하는 람다식(익명함수)
  if (err) return console.log(err); //에러가 발생한 경우
  console.log("The server is listening on port 3000");
});
