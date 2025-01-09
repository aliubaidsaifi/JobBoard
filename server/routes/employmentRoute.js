const express = require('express');
const router = express.Router();
const employmentController = require('../controllers/employmentController');
const {verifyToken, requireSignIn} = require('../middlewares/authMiddleware')

// Create Employment
router.post('/add-employment', verifyToken, employmentController.createEmployment);

// Read all Employments
router.get('/employment-details/:_id', employmentController.getAllEmployments);

// Read Employment by ID
router.get('/:id', employmentController.getEmploymentById);

// Update Employment by ID
router.put('/update-employment/:_id', requireSignIn, employmentController.updateEmploymentById);

// Delete Employment by ID
router.delete('/delete-employment/:_id', employmentController.deleteEmploymentById);

module.exports = router;
