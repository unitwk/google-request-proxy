const http = require("http");
const https = require("https");
// const request = require("request");

const MY_HOST = "http://localhost:8089";
const HOST = "www.google.com.hk";
const ADDR = `https://${HOST}`;

// 创建自定义转化流
const { Transform } = require("stream");

const responseTransform = new Transform({
  transform(chunk, encoding, callback) {
    // const newChunk = chunk
    //   .toString()
    //   .replace(/https\:\/\/www\.google\.com/gim, MY_HOST);
    callback(null, chunk);
  },
});

const server = http.createServer((request, response) => {
  console.log("客户端请求:", request.headers.host, request.url);
  // console.log("request.headers", request.headers);
  const reqHeaders = {
    // HOST: MY_HOST,
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-language": "zh-CN,zh-TW;q=0.9,zh;q=0.8,en;q=0.7",
    cookie: "",
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
  };

  delete reqHeaders["connection"];

  const proxy = https.request(ADDR + request.url, {
    hostname: HOST,
    // port: 443,
    headers: reqHeaders,
    method: request.method,
  });
  proxy.once("response", (proxyResponse) => {
    // proxyResponse.pipe(responseTransform).pipe(response);
    proxyResponse.pipe(response);
  });
  request.pipe(proxy);
});

server.listen(80);
console.log("Http server stared!");
console.log("Program started!");
