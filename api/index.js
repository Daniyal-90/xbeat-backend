const serverless = require("serverless-http");
const app = require("../server");

module.exports = (req, res) => {
  return serverless(app)(req, res);
};