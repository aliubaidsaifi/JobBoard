const express = require("express");
const { requireSignIn, verifyToken, isEmployer, isJobOwner } = require("../middlewares/authMiddleware");
const { createNewJob, getJobs, getSingleJob, deletejobController, updatejobController, jobApplication, applyJob, applicant, getMyJob, jobapplicants } = require('../controllers/jobCreateController');
const { uploadResume } = require("../controllers/authController");
// const formidable = require("express-formidable");

const router = express.Router();

//routes
router.post(
  "/postjob",
  verifyToken,
  isEmployer,
  // requireSignIn,
  //   isAdmin,
  //   formidable(),
  createNewJob
);

router.post(
  "/apply-job/:_id",
  requireSignIn,
  applyJob,
)
//routes
router.put(
  "/update-job/:_id",
  requireSignIn,
  // verifyToken,
  isJobOwner,
  // formidable(),
  updatejobController
);

//get jobs
router.get("/getjobs", getJobs);
router.get("/job-applicant/:_id", applicant);


// //single job
router.get("/get-job/:slug", getSingleJob);
router.get("/get-my-jobs/:_id", verifyToken, getMyJob);
router.get("/job-applicants", jobapplicants);

// //get photo
// router.get("/job-photo/:pid", jobPhotoController);

// //delete rjob
router.delete("/delete-job/:_id", verifyToken, isJobOwner, deletejobController);

// //filter job
// router.post("/job-filters", jobFiltersController);

// //job count
// router.get("/job-count", jobCountController);

// //job per page
// router.get("/job-list/:page", jobListController);

// //search job
// router.get("/search/:keyword", searchjobController);

// //similar job
// router.get("/related-job/:pid/:cid", realtedjobController);

// //category wise job
// router.get("/job-category/:slug", jobCategoryController);

// //payments routes
// //token
// router.get("/braintree/token", braintreeTokenController);

// //payments
// router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

module.exports = router;
