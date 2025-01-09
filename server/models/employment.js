const mongoose = require('mongoose');
const { Schema } = mongoose;

const employmentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assuming your user model is named 'User'
    required: true,
  },
  employmentExperience: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  jobStatus:{
    type: String,
    required: true,
  },
  noticePeriod: {
    type: String,
    required: true,
  },
});

const Employment = mongoose.model('employment', employmentSchema);

module.exports = Employment;
