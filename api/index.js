const serverless = require("serverless-http");
const mongoose = require("mongoose");
const app = require("../server");

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;

  console.log("MongoDB connected ✅");
}

module.exports = async (req, res) => {
  await connectDB();
  return serverless(app)(req, res);
};