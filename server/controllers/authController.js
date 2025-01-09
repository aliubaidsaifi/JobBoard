const UserModel = require("../models/UserModel.js");
const { comparePassword, hashPassword } = require("../helpers/authHelpers.js");
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const { uploadOnCloudinary } = require('../utility/cloudnary.js')


module.exports.getUser = async (req, res) => {

  try {
    const userId = req.params._id;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports.registerController = async (req, res) => {
  try {
    const { userType, name, email, password } = req.body;
    if (!(userType && email && name && password)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already registered, please login",
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = await UserModel.create({
      userType,
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      'shhhhhhhh',
      { expiresIn: '7d', }
    );

    // Send the token in the response
    res.status(201).send({
      success: true, user: {
        userType: user.userType,
        _id: user._id,
        name: user.name,
        email: user.email,
        resumes: user.resumes
      }, token, ok: true
    });

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
};



// Login authentication
module.exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!(email && password)) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    //check user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await jwt.sign({ _id: user._id }, 'shhhhhhhh', {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        userType: user.userType,
        _id: user._id,
        name: user.name,
        email: user.email,
        resumes: user.resumes
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

// upload resume


module.exports.uploadResume = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.user.id || req.user._id });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user already has a resume
    if (user.resume.fileName) {
      // Delete the existing resume file (you need to implement this)
      // ...

      // Update the existing resume information
      user.resume.fileName = req.file.originalname;
      user.resume.filePath = req.file.path;
    } else {
      // Save the new resume information
      user.resume = {
        fileName: req.file.originalname,
        filePath: req.file.path,
      };
    }

    await user.save();

    return res.status(200).json({ message: 'Resume uploaded successfully.' });
  } catch (error) {
    console.error('Error uploading resume:', error);
    return res.status(500).json({ error: 'Error uploading resume.' });
  }
};

module.exports.downloadResume = async (req, res) => {
  try {
    const fileName = req.params.fileName;
    const user = await UserModel.findById(req.user._id);

    console.log('User:', user);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resume = user.resume;  // Since there's only one resume, no need to use find
    console.log('Resume:', resume);

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Read the resume file
    const resumePath = path.join(__dirname, '..', resume.filePath);

    const resumeData = fs.readFileSync(resumePath);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${user.name} - ${resume.fileName}"`);
    res.end(resumeData, 'binary');
  } catch (error) {
    console.error('Error downloading resume:', error);
    return res.status(500).json({ error: 'Error downloading resume.' });
  }
};

module.exports.applicantDownloadResume = async (req, res) => {
  try {

    const resumeId = req.params._id;


    // Find the user by _id
    const user = await UserModel.findById(resumeId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Retrieve resume details
    const resume = user.resume;

    if (!resume || !resume.fileName || !resume.filePath) {
      return res.status(404).json({ error: 'Resume not found or invalid' });
    }

    // Read the resume file
    const resumePath = path.join(__dirname, '..', resume.filePath);
    const resumeData = fs.readFileSync(resumePath);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${user.name} - ${resume.fileName}"`);
    res.end(resumeData, 'binary');
  } catch (error) {
    console.error('Error fetching applicant resume:', error);
    return res.status(500).json({ error: 'Error fetching applicant resume.' });
  }
};


module.exports.getUpdatedUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const profilePicture = user.profilePicture;
    console.log(profilePicture.contentType);


    if (!(profilePicture) || !(profilePicture.data) || !(profilePicture.contentType)) {
      return res.status(404).json({ error: 'Profile picture not found or invalid' });
    }
    // Set the appropriate headers
    res.setHeader('Content-Type', profilePicture.contentType);

    // Send the profile picture data as a response
    res.send({
      user: {
        name: user.name,
        about: user.about,
        // Add other user fields you want to include
      },
      profilePicture: {
        data: profilePicture.data.toString('base64'),
        contentType: profilePicture.contentType,
      },
    });
  } catch (error) {
    console.error('Error fetching updated user data and profile picture:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports.profilePhoto = async (req, res) => {
  try {
    const profile = await UserModel.findById(req.params._id).select("profilePicture");
    // console.log(profile)

    console.log("success");
    if (profile.profilePicture.data) {
      res.set("Content-type", profile.profilePicture.contentType);
      return res.status(200).send(profile.profilePicture.data);

    }

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};


module.exports.addProfilePicture = async (req, res) => {
  try {
    const { name, about } = req.body;
    const profilePicture = req.file;

    if (!name || !about || !profilePicture) {
      return res.status(400).json({ error: 'Name, about, and profile picture are required fields' });
    }

    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete old Cloudinary file if it exists
    if (user.profilePicture.publicId) {
      await v2.uploader.destroy(user.profilePicture.publicId);
    }
    console.log(profilePicture.path)

    // Upload the new profile picture to Cloudinary
    const cloudinaryResponse = await uploadOnCloudinary(profilePicture.path);

    if (!cloudinaryResponse) {
      return res.status(500).json({ error: 'Failed to upload profile picture to Cloudinary' });
    }

    // Update the user data
    user.name = name;
    user.about = about;
    // user.profilePicture.publicId = cloudinaryResponse.public_id;
    user.profilePicture.url = cloudinaryResponse.url; // Save Cloudinary URL

    await user.save();

    // Delete the local file
    try {
      fs.unlink(profilePicture.path);
      console.log('Local file deleted successfully:', profilePicture.path);
    } catch (unlinkError) {
      console.error('Error deleting local file:', unlinkError);
    }

    res.status(200).json({ message: 'Profile details added successfully', user });
  } catch (error) {
    console.error('Error adding profile details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports.updateSkills = async (req, res) => {
  console.log(req.params._id)
  try {
    const userId = req.params._id;
    const { selectedTechStack,  selectedSkills } = req.body;
    console.log(req.body)
    if (!userId) {
      res.status(402).send("User not Found")
    }
    await UserModel.findByIdAndUpdate(userId, { $set: { selectedTechStack, selectedSkills } });
    res.status(200).json({ message: 'User profile updated successfully', data: { selectedTechStack, selectedSkills } });

  } catch (error) {
    res.status(500).send(error)
  }
}


exports.getResumes = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resume = user.resume; // Assuming resumes is an array field in your user model
    res.status(200).json({ resume });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ error: 'Error fetching resumes.' });
  }
};