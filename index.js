const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = YAML.load("./swagger.yaml");

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

//routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/public", express.static(path.join(__dirname, "/public")));

app.use("/suggestions", require("./routes/suggestions"));

app.use("/", (req, res) => {
  res.send("Hello world!");
});

//init server
const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
