const Employment = require('../models/employment');

// Create Employment
exports.createEmployment = async (req, res) => {
  try {
    const { employmentExperience, company, designation, jobStatus, noticePeriod } = req.body;
    const userId = req.user._id; // Assuming you have user information in the request

    const newEmployment = new Employment({
      userId,
      employmentExperience,
      company,
      designation,
      jobStatus,
      noticePeriod,
    });

    const savedEmployment = await newEmployment.save();
    res.status(201).json(savedEmployment);
  } catch (error) {
    console.error('Error creating employment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Read all Employments
exports.getAllEmployments = async (req, res) => {
  try {
    const userId = req.params._id;

    // Find all employment details based on userId
    const userEmploymentDetails = await Employment.find({ userId });

    if (userEmploymentDetails.length === 0) {
      return res.status(404).json({ error: 'No employment details found for the user' });
    }

    res.status(200).json(userEmploymentDetails);
  } catch (error) {
    console.error('Error retrieving employment details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Read Employment by ID
exports.getEmploymentById = async (req, res) => {
  try {
    const employment = await Employment.findById(req.params.id);
    if (!employment) {
      return res.status(404).json({ error: 'Employment not found' });
    }
    res.json(employment);
  } catch (error) {
    console.error('Error fetching employment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update Employment by ID
exports.updateEmploymentById = async (req, res) => {
  try {
    const updatedEmployment = await Employment.findByIdAndUpdate(
      req.params._id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedEmployment) {
      return res.status(404).json({ error: 'Employment not found' });
    }

    res.json(updatedEmployment);
  } catch (error) {
    console.error('Error updating employment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete Employment by ID
exports.deleteEmploymentById = async (req, res) => {

  try {
    const deletedEmployment = await Employment.findByIdAndDelete(req.params._id);

    if (!deletedEmployment) {
      return res.status(404).json({ error: 'Employment not found' });
    }

    res.json(deletedEmployment);
  } catch (error) {
    console.error('Error deleting employment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
