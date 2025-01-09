const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  userType: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    // unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  selectedTechStack: [{
    id: Number,
    name: String,
  }],
  selectedSkills: [{
    id: Number,
    name: String,
  }],
  token: {
    type: String,
    default: null,
  },
  resume: {
    fileName: {
      type: String,
      default: null,
    },
    filePath: {
      type: String,
      default: null,
    },
  },
  profilePicture: {
    url: String, // Store the content type of the image (e.g., 'image/png')
  },
  about: {
    type: String,
    default: null,
  },
  myJob: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      unique: true,
    },
  ],
});
const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
