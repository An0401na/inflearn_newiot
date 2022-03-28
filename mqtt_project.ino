//온도습도 정보를 mptt에 보내고 mptt에 정보를 읽어와서 led를 제어



#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include "DHTesp.h"  //온습도계사용을 위함
// Update these with values suitable for your network.
const char* ssid = ""; // 와이파이 AP, 또는 스마트폰의 핫스판 이름
const char* password = "";  // 와이파이 AP, 또는 스마트폰의 핫스판 이름
const char* mqtt_server = ""; //자신의 브로커 주소
const char* clientName = "";  // 다음 이름이 중복되지 않게 꼭 수정 바람 - 생년월일 추천

DHTesp dht;
WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  dht.setup(D4, DHTesp::DHT11);   //온습도계와 연결된 pin 번호 D4, 우리가 사용하는 온습도계 타입이 DHT11타입임을 선언하다.
  
}
void callback(char* topic, byte* payload, unsigned int uLen) {
   char pBuffer[uLen+1];  //ulen은 mqtt에서 넘겨주는 데이터의 길이인데 데이터의 끝을 알리기 위해 마지막에 null값을 넣기위해서 1을 추가한다
   int i;
   for(i=0;i<uLen;i++){
         pBuffer[i]=payload[i];
   }
   pBuffer[i]='\0'; //문자열 마지막 표시
   Serial.println(pBuffer); // 1, 2
   if(pBuffer[0]=='1'){  // led 제어 부분
      digitalWrite(14, HIGH);
   }else if(pBuffer[0]=='2'){
      digitalWrite(14, LOW);
   }  
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect(clientName)) {
      Serial.println("connected");
      // ... and resubscribe
      client.subscribe("led");  // mqtt에 접속이 됐다면 subscribe의 topic을 led로 지정한다.
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}
void setup() {
  pinMode(14, OUTPUT);     // led와 연결된 pin 번호 14
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);  //wemos에서 데이터가 수신이 되면 callback함수 호출
}
 void loop() {
  if (!client.connected()) {
    reconnect();
  }
    client.loop();
   
    float hum = dht.getHumidity();  //습도
    float tmp = dht.getTemperature();  //온도
    char message[64]="", pTmpBuf[50], pHumBuf[50];
    dtostrf(tmp, 5,2, pTmpBuf); //tmp 의 값을 소수 둘째자리 까지 pTmpBuf에 저장하낟.
    dtostrf(hum, 5,2, pHumBuf);
   //nodejs로 넘어가기전에 온습도 정보를 mqtt에 보내는데 
    sprintf(message, "{\"tmp\":%s,\"hum\":%s}", pTmpBuf, pHumBuf);  //json 형식으로 서버에 보낸다  
    Serial.print("Publish message: ");
    Serial.println(message);
    client.publish("dht11", message); //mqtt 로 전송 topic 은 dht11
   
    delay(3000); // 3초
  }
