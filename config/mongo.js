const mongoose = require("mongoose");
require("dotenv").config();

const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/mindscape";
const loadModels = require("./../models");

const connect = async () => {
  try {
    await mongoose.connect(DB_URL, {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const dbStatus = `*    DB Connection: OK\n****************************\n`;
    console.log("****************************");
    console.log("*    Starting Server");
    console.log(`*    Port: ${process.env.PORT || 3000}`);
    console.log(`*    NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`*    Database: MongoDB`);
    console.log(dbStatus);

    mongoose.connection.on("error", console.log);
    mongoose.connection.on("disconnected", connect);

    loadModels();
  } catch (err) {
    console.error(`Error connecting to DB: ${err}`);
  }
};

module.exports = connect;
