const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

//load config
dotenv.config({ path: "./config.env" });

//inint express
const app = express();

//Body parser
app.use(express.urlencoded({ extended: false }));

//Cors
app.use(cors());

//connect to DB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Mongo DB connected"))
  .catch((err) => console.log(err));

app.use(express.json());

//public folder
app.use("/public", express.static(path.join(__dirname, "/public")));

//routes
app.use("/suggestions", require("./routes/suggestions"));

app.use("/", (req, res) => {
  res.send("Hello world!");
});

//init server
const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
