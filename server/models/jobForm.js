const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobTitle: String,
  slug: {
    type: String,
    required: true,
  },
  location: String,
  employmentType: String,
  workAuthorization: String,
  company: String,
  salary: String,
  experience: String,
  description: String,
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  applicants: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        sparse: true,
      
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
