const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // specify the destination folder for uploaded files
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        // specify how files should be named
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

module.exports.upload = multer({
    storage: storage
}).single("resume");

module.exports.uploadProfile = multer({
    storage: storage
}).single("profilePicture");
