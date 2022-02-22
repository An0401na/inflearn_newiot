const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.write("<h1>Hello from nodejs</h1>");
  } else {
    res.write(`<h1>You have enter this url : ${req.url} <h1>`);
  }
  res.end();
});

server.listen(3000, () => {
  console.log("3000번 포트를 열고 요청을 기달고 있는 중 ");
});
