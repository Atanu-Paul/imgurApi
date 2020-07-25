const express = require("express");
const multer = require("multer");
const Photo = require("../model/Photo");
const Router = express.Router();

// Router.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

const upload = multer({
  limits: {
    fileSize: 1000000, // max file size 1MB = 1000000 bytes
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg)$/)) {
      cb(new Error("only upload files with jpg or jpeg format."));
    }
    cb(undefined, true); // continue with upload
  },
});

Router.get("/", (req, res) => {
  res.status(200).json({ mess: "OK" });
});

Router.post(
  "/photos",
  upload.single("photo"),
  async (req, res) => {
    try {
      const photo = new Photo(req.body);
      const file = req.file.buffer;
      photo.photo = file;

      await photo.save();
      res.status(201).send({ _id: photo._id });
    } catch (error) {
      res.status(500).send({
        upload_error: "Error while uploading file...Try again later.",
      });
    }
  },
  (error, req, res, next) => {
    if (error) {
      res.status(500).send({
        upload_error: error.message,
      });
    }
  }
);

Router.get("/photos", async (req, res) => {
  try {
    const photos = await Photo.find({});
    res.send({ photos });
  } catch (error) {
    res.status(500).json({ get_error: "Error while getting list of photos." });
  }
});

Router.get("/photos/:id", async (req, res) => {
  try {
    const result = await Photo.findById(req.params.id);
    res.set("Content-Type", "image/jpeg");
    res.send(result.photo);
  } catch (error) {
    res.status(400).send({ get_error: "Error while getting photo." });
  }
});

module.exports = Router;
