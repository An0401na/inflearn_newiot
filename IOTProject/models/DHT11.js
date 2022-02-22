// DB에 저장할 온습도 데이터 스키마 설정

const mongoose = require("mongoose");
const DHT11Schema = mongoose.Schema({
  tmp: {
    type: String,
    required: true,
  },
  hum: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("DHT11", DHT11Schema);

//dht11 이라는 테이블 모듈 생성
