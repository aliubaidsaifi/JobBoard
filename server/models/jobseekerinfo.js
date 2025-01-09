const mongoose = require('mongoose');

// Define the Jobseeker schema
const jobseekerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  selectedTechStack: [
    {
      id: String, // Assuming this is the tech stack ID
      name: String, // Assuming this is the tech stack name
    },
  ],
  selectedSkills: [
    {
      name: String, // Assuming this is the skill name
    },
  ],
  resume: {
    type: String, // You can store the file path or content here
  },
  detailsOF: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

// Create a Mongoose model for the Jobseeker schema
const Jobseeker = mongoose.model('Jobseeker', jobseekerSchema);

module.exports = Jobseeker;
