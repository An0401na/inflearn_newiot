 /*
 Basic ESP8266 MQTT example
 This sketch demonstrates the capabilities of the pubsub library in combination
 with the ESP8266 board/library.
 It connects to an MQTT server then:
  - publishes "hello world" to the topic "outTopic" every two seconds
  - subscribes to the topic "inTopic", printing out any messages
    it receives. NB - it assumes the received payloads are strings not binary
  - If the first character of the topic "inTopic" is an 1, switch ON the ESP Led,
    else switch it off
 It will reconnect to the server if the connection is lost using a blocking
 reconnect function. See the 'mqtt_reconnect_nonblocking' example for how to
 achieve the same result without blocking the main loop.
 To install the ESP8266 board, (using Arduino 1.6.4+):
  - Add the following 3rd party board manager under "File -> Preferences -> Additional Boards Manager URLs":
       http://arduino.esp8266.com/stable/package_esp8266com_index.json
  - Open the "Tools -> Board -> Board Manager" and click install for the ESP8266"
  - Select your ESP8266 in "Tools -> Board"
*/

#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// Update these with values suitable for your network.

const char* ssid = "";
const char* password = "";
const char* mqtt_server = "";
const char* clientName ="";

WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastMsg = 0;
char msg[50];

int led=14;
int timeIn=1000;

void setup() {
  pinMode(led, OUTPUT);     // Initialize the BUILTIN_LED pin as an output
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);   //실제 mo squitto 서버에서 접속. 1883은 포트 정보 
  client.setCallback(callback);    //다른 pc에서 mqtt 쪽으로 데이터를 전송하였을때 아두이노(wemos)에서 mqtt로 들어온 정보를 읽어가는 것.
}

void setup_wifi() {

  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);  // 와이파이 접속 시도

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {   // payload 는 mqtt에 있는 정보를 arduino로 가지고 올때 이 인자를 통해서 들어오게 된다.
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();

  // payload 인자의 내용 확인
  String inString="";
  for(int i=0; i<length; i++){
    inString +=(char)payload[i];
  }
  timeIn=inString.toInt();  // payload로 받아온 값을 inString에 값을 넣고 이 값을 int형으로 변경하여 다시 timeInt에 넣어 pc에서 지정한 시간 만큼 led 껏다 켜짐 반복을 제어 할 수 있다.
}

void reconnect() {  //mqtt에 연결을 다시시도
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect(clientName)) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      client.publish("inTopic", "Reconnected");   //mqtt 서버 쪽으로 연결 됐음을 문자열로 보낸다.
      // ... and resubscribe
      client.subscribe("outTopic");    //pc에서 outTopic과 함께 데이터를 보내면 데이터를 볼 수 있음 
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void loop() {

  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  digitalWrite(led,HIGH);
  delay(timeIn);  //timeIn 초 간격으로 켜짐 꺼짐을 반복
  digitalWrite(led,LOW);
  delay(timeIn);
}
 
