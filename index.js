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
    cookie:
      "HSID=Ab0EPU00e0GNiSZYv; SSID=AGndpmYIo_eeCXpIM; APISID=zY6gT0kcb0NpJftb/AhUBIqFc2xZ5iUrhD; SAPISID=RHXGr1u6rKRZRGth/ALZ9KqqtvDNeHkYMa; __Secure-1PAPISID=RHXGr1u6rKRZRGth/ALZ9KqqtvDNeHkYMa; __Secure-3PAPISID=RHXGr1u6rKRZRGth/ALZ9KqqtvDNeHkYMa; SID=RAj2WB7PAdgz0rbUYjM2Yusl3Mz8PqCqCtvq0B06H1ms5Ik3S0bRI8le3w_iPq13DnKFDA.; __Secure-1PSID=RAj2WB7PAdgz0rbUYjM2Yusl3Mz8PqCqCtvq0B06H1ms5Ik3QfLkbgrw22prS7rfwHjq5Q.; __Secure-3PSID=RAj2WB7PAdgz0rbUYjM2Yusl3Mz8PqCqCtvq0B06H1ms5Ik3ecqApoRzIRfPX5wNzFHVyw.; OGPC=19031705-1:19031711-1:19032280-1:19032677-1:; OTZ=6803125_24_24__24_; AEC=AakniGOVpZJZNQ_HwrEdXRRuNQdQTO6rmstVB4kH2ddnpvUzEpPynWS5XJ0; NID=511=RQrCU1Z0-8ZAw0dIRSTlJnVEl4ji5b9u6_DzSW-JF5KQQ6llDExzxtGcGObkMg0NxANqMqpam3locmS-NSkeRnvAgkQAwLE20ru70Z13nJePfcN_URJyHSzjo1Pj6Qsvpk1beVODtFOp5-6VdRtVmLjMlfHQcK8ELZ1mGxHFrcu0f4w5WlnBev2tOfnq892VzIqISxTWYukXNzcN3HgSz8jJcQRQjx7qlLGKKYW0it8hJ56F_Bk_4iwBhnKH0-tX5DKsLPdQZQAf5uGxx7o34GtG4BdTbbUP5GUYLmUBtA9pewh0OWepdA; 1P_JAR=2022-12-27-09; DV=s4y4GjpmbOcZUAuW96t36_7-DBwuVRg; UULE=a+cm9sZTogMQpwcm9kdWNlcjogMTIKdGltZXN0YW1wOiAxNjcyMTMyODI2MDQwMDAwCmxhdGxuZyB7CiAgbGF0aXR1ZGVfZTc6IDMwNDk0MjIzMQogIGxvbmdpdHVkZV9lNzogMTE0NDA0Nzk2MAp9CnJhZGl1czogMTI5NTgKcHJvdmVuYW5jZTogNgo=",
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

server.listen(8089);
console.log("已启动");
