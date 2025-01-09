// server/models/fileModel.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  fileName: String,
  filePath: String,
  detailsOF:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
