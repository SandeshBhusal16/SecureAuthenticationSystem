const multer = require("multer");
const fs = require("fs");
const GenerateRandomstring = require("../utils/helper");

const myStorage = multer.diskStorage({
  destination(req, file, cb) {
    let UploadPath = "./upload";
    if (!fs.existsSync(UploadPath)) {
      fs.mkdirSync(UploadPath, {
        recursive: true,
      });
    }
    cb(null, UploadPath);
  },

  filename(req, files, cb) {
    let fname =
      Date.now() + "-" + GenerateRandomstring(30) + files.originalname;

    cb(null, fname);
  },
});

const ImageFilter = (req, files, cb) => {
  const ext = files?.originalname.split(".").pop();
  let fileType = "image";

  let allowed_ext;

  if (fileType === "image") {
    allowed_ext = ["png", "jpg", "webp", "gif", "jpeg", "svg"];
  }

  if (fileType === "audio") {
    allowed_ext = ["mp3", "wav", "ogg", "flac", "aac", "m4a", "opus"];
  } else if (fileType === "doc") {
    allowed_ext = ["pdf", "doc", "docx", "txt", "rtf", "odt", "xls", "xlsx"];
  } else if (fileType === "video") {
    allowed_ext = ["mp4", "avi", "mkv", "mov", "wmv", "flv"];
  }

  if (allowed_ext.includes(ext?.toLowerCase())) {
    cb(null, true);
  } else {
    cb({
      data: "",
      msg: "File type is not supported",
      code: 400,
    });
  }
};

const Uploader = multer({
  storage: myStorage,
  fileFilter: ImageFilter,
});

module.exports = Uploader;
