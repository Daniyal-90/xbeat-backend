import serverless from "serverless-http";
import app, { connectDB } from "../server.js";

export default async function handler(req, res) {
  await connectDB();
  return serverless(app)(req, res);
}