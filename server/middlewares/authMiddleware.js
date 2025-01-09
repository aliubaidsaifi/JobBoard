const jwt = require("jsonwebtoken");
const userModel = require("../models/UserModel.js");
const jobForm = require("../models/jobForm.js");

//Protected Routes token base
module.exports.verifyToken = async (req, res, next) => {
  
  const headers = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  if (!headers) {
    return res.status(401).json({ message: 'Access denied. Token is missing.' });
  }
  try {
    const decoded = jwt.verify(headers, 'shhhhhhhh');
    req.user = decoded;
    
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired.' });
    } else {
      return res.status(401).json({ message: 'Invalid token.' });
    }
  }
};



module.exports.requireSignIn = async (req, res, next) => {

  try {
    const decode = jwt.verify(
      req.headers['authorization'] && req.headers['authorization'].split(' ')[1],
      'shhhhhhhh'
    );
    req.user = decode;


    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports.isEmployer = async (req, res, next) => {
  console.log(req.user._id);
  try {
    const user = await userModel.findById(req.user._id)
    if (user && user.userType === 'employer') {
      next();
    } else {
      // User is not an employer, return an unauthorized response
      return res.status(403).json({ message: 'Access denied. User is not an employer.' });
    }
  } catch (error) {
    console.error('Error in isEmployer middleware:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports.isJobOwner = async (req, res, next) => {
  console.log(req.user._id)
  console.log(req.params._id)
  try {
    const jobId = req.params._id;
    const job = await jobForm.findById(jobId);
    console.log(job);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found', 
      });
    }
       
    if (job.employer.toString() !== req.user._id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to perform this action',
      });
    }

    next();
  } catch (error) {
    console.error('Error in isJobOwner middleware:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error,
    });
  }
};


