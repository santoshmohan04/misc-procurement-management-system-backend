import mongoose from "mongoose";

export const connect = () => {
  mongoose.connect(process.env.MONGODB_URI);

  mongoose.connection.once("open", () => {
    // eslint-disable-next-line no-console
    console.log("connected to MongoDb");
  });
};

export const disconnect = async () => {
  await mongoose.disconnect();
};
