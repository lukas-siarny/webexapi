const express = require("express");
const router = express.Router();
const Suggestion = require("../models/suggestion");
const Counter = require("../models/counter");
const multer = require("multer");

//GET all suggestions
router.get("/", async (req, res) => {
  try {
    const suggestions = await Suggestion.find();
    res.status(200).json(suggestions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//GET one suggestion
router.get("/:customId", async (req, res) => {
  try {
    const suggestion = await Suggestion.findOne({
      customId: req.params.customId,
    });

    if (!suggestion) {
      res.status(404).json({ message: "Cannot find suggestion." });
      return;
    }
    res.status(200).json(suggestion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//POST suggestion
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${new Date().toISOString().replace(/:/g, "-")}_${file.originalname}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    // store
    cb(null, true);
  } else {
    // reject
    cb(
      new Error({
        message: "Unsupported filed type",
      }),
      false
    );
  }
};

const upload = multer({ storage, limits: { fileSize: 20971520 }, fileFilter });

const getNextSequenceValue = async (sequenceName) => {
  const counter = await Counter.findOneAndUpdate(
    { customId: sequenceName },
    { $inc: { sequence_value: 1 } },
    { returnOriginal: false }
  );

  return counter.sequence_value;
};

router.post("/", upload.single("image"), async (req, res) => {
  const suggestion = new Suggestion({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    street: req.body.street,
    streetNumber: req.body.streetNumber,
    city: req.body.city,
    postalCode: req.body.postalCode,
    country: req.body.country,
    message: req.body.message,
    customId: await getNextSequenceValue("suggestionId"),
    image: req.file ? req.file.path : "",
  });

  try {
    const newSuggsetion = await suggestion.save();
    res.status(201).json(newSuggsetion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Counter
/*router.post("/counter", async (req, res) => {
  const counter = new Counter({
    customId: req.body.customId,
    sequence_value: req.body.sequence_value,
  });

  try {
    const newCounter = await counter.save();
    res.status(200).json(newCounter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});*/

module.exports = router;
