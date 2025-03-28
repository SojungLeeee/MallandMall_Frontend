// src/setupProxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api/proxy/naver-map",
    createProxyMiddleware({
      target: "http://localhost:8090",
      changeOrigin: true,
      pathRewrite: {
        "^/api/proxy/naver-map": "/api/proxy/naver-map",
      },
      logLevel: "debug",
    })
  );

  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:8090",
      changeOrigin: true,
    })
  );
};
