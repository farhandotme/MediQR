import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL!;

let isConnectedBefore = false;
function log(msg: string) {
  console.log(`[MongoDB] ${msg}`);
}
mongoose.connection.on("connected", () => {
  isConnectedBefore = true;
  log("Connection established.");
});

mongoose.connection.on("error", (err) => {
  log(`Connection error: ${err}`);
});

mongoose.connection.on("disconnected", () => {
  log("Disconnected.");
  if (!isConnectedBefore) {
    log("Retrying initial connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
});

mongoose.connection.on("reconnected", () => {
  log("Reconnected.");
});

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
  } catch (error) {
    log(`Initial connection failed: ${error}`);
    log("Retrying in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
