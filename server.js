require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;

const app = express();
const initMongo = require("./config/mongo");
const { printRequestData } = require("./middleware/api/printRequestData");
const path = require("path");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,PATCH,DELETE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization," +
    "cid, user-id, x-auth, Cache-Control, X-Requested-With, datatype, *"
  );
  if (req.method === "OPTIONS") res.sendStatus(200);
  else next();
});

app.use(printRequestData);

app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    limit: "10mb",
    extended: true,
    parameterLimit: 50000,
  })
);
// app.use(cookieParser());
app.use(require("./routes"));
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');



initMongo();

app.listen(port, () => {
  console.log(`Server is running on ${port}`)
})