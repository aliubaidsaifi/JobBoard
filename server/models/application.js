const mongoose = require('mongoose');

const jobApplication = new mongoose.Schema({
    jobSeekerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    appliedAt: { type: Date, default: Date.now },
});

const JobApplication = mongoose.model('JobApplication', jobApplication);
module.exports = JobApplication;