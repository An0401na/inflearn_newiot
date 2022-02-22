//nodejs에서 MongoDB 사용하기
//MongoDB에 회원 데이터 저장하기
//웹 브라우저에서 내 서버에 접속을 하면 회원 데이터를 몽고 디비에 넣는 웹서비스 만들기

const mongoose = require("mongoose");
const express = require("express");
const server = express();
const User = require("./models/User");

require("dotenv").config({ path: "variables.env" });

server.get("/", (req, res) => {
  //user스키마 정보를 이용해서 회원 정보를 생성하기
  const newUser = new User();
  newUser.email = "abc@email.com";
  newUser.name = "abc";
  newUser.age = 25;
  newUser
    .save()
    .then((data) => {
      //작성한 newUser 정보들을 저장하고(save()) 넘어오는 데이터를 바로 받아보려면 (then()) 함수를 사용하고 넘어오는 데이터는 data 라는 인자가 받아 함수를 처리한다.
      console.log(data);
      res.json({
        message: "User create successfully",
      }); //res 를 이용해서 클라이언트한테 json 데이터 형태로 message 변수에 담아 보내준다.
    })
    .catch((err) => {
      //save() 가 잘 못 됐을 경우 에러 메시지 발송
      res.json({
        message: "User war not successfully created",
      });
    });
});

server.listen(3000, (err) => {
  if (err) {
    return console.log(err);
  } else {
    //3000번 포트를 열고서 요청이 들어왔을때 오류가 나지않으면 몽고디비랑 연결하기
    mongoose.connect(
      process.env.MONGODB_URL, //dotenv 모듈을 사용해서 variables.env 파일에서 mongodb url을 가지고온다.
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err) => {
        if (err) {
          //mongoose.connect() 함수를 이용해서 mongodbUrl을 넘겨서 실행했을때 그 결과가 에러인 경우 실행
          console.log(err);
        } else {
          console.log("Connected to database successfully");
        }
      }
    );
  }
});
