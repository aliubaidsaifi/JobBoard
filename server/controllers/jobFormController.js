const Job = require('../models/jobForm');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);
const axios = require('axios');

const striptags = require('striptags');

module.exports.createJob = async (req, res) => {
  try {
    const { jobTitle, location, employmentType, workAuthorization,company, salary, experience, description } = req.body;

    const sanitizedDescription = DOMPurify.sanitize(description);

    const plainTextDescription = striptags(sanitizedDescription, [], '\n');

    const newJob = new Job({
      jobTitle,
      location,
      employmentType,
      workAuthorization,
      company,
      salary,
      experience,
      description: plainTextDescription,
    });

    await newJob.save();

    res.json({ success: true, message: 'Job submitted successfully' });
  } catch (error) {
    console.error('Error submitting job:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// jobController.js


module.exports.getJobDetails = async (req, res) => {
  try {
    const jobId = req.params.jobId; // Extract jobId from request parameters
    const response = await axios.get(`http://localhost:5000/api/jobs/${jobId}`);
    const jobDetails = response.data;
    res.json(jobDetails);
  } catch (error) {
    console.error('Error fetching job details:', error);
    res.status(500).json({ error: 'Error fetching job details' });
  }
};


