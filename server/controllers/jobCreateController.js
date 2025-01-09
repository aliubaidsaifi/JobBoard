// const fs = require("fs");
const slugify = require("slugify");
const Job = require('../models/jobForm');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const UserModel = require('../models/UserModel')
const DOMPurify = createDOMPurify(window);
const axios = require('axios');
const striptags = require('striptags');
const jobApplication = require('../models/application')

// dotenv.config();

function generateUniqueSlug(jobTitle) {
    const baseSlug = slugify(jobTitle);
    const timestamp = Date.now();
    const uniqueId = Math.random().toString(36).substr(2, 5); // You can customize the length of the unique id

    return `${baseSlug}-${timestamp}-${uniqueId}`;
}

module.exports.createNewJob = async (req, res) => {
    try {
        const { jobTitle, location, employmentType, workAuthorization, company, salary, experience, description } = req.body;

        // Validation
        const sanitizedDescription = DOMPurify.sanitize(description);
        const plainTextDescription = striptags(sanitizedDescription, [], '\n');

        switch (true) {
            case !jobTitle:
                return res.status(500).send({ error: "Job Title is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !location:
                return res.status(500).send({ error: "Location is Required" });
            case !workAuthorization:
                return res.status(500).send({ error: "workAuthorization is Required" });
            case !company:
                return res.status(500).send({ error: "Company is Required" });
            case !employmentType:
                return res.status(500).send({ error: "EmploymentType is Required" });
            case !experience:
                return res.status(500).send({ error: "EmploymentType is Required" });
        }
        console.log(req.user)
        const job = new Job({
            jobTitle,
            slug: generateUniqueSlug(jobTitle),
            location,
            employmentType,
            workAuthorization,
            company,
            salary,
            experience,
            description,
            employer: req.user._id
        });

        await job.save();
        res.status(201).send({
            success: true,
            message: "Job Created Successfully",
            job,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in creating job",
        });
    }
};

//get all Jobs
module.exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job
            .find({})
            // .populate("category")
            .limit(3)
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            counTotal: jobs.length,
            message: "ALLProducts ",
            jobs,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Erorr in getting products",
            error: error.message,
        });
    }
};
// get single product
module.exports.getSingleJob = async (req, res) => {
    try {
        const job = await Job
            .findOne({ slug: req.params.slug })
        // .populate("category");
        res.status(200).send({
            success: true,
            message: "Single Product Fetched",
            job,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Eror while getitng single product",
            error,
        });
    }
};

//delete controller
module.exports.deletejobController = async (req, res) => {
    console.log(req.params._id)
    try {
        await Job.findByIdAndDelete(req.params._id);
        res.status(200).send({
            success: true,
            message: "Product Deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while deleting product",
            error,
        });
    }
};

// //upate producta
module.exports.updatejobController = async (req, res) => {
    try {
        const { jobTitle, location, employmentType, workAuthorization, company, salary, experience, description } = req.body;
        //alidation
        switch (true) {
            case !jobTitle:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !location:
                return res.status(500).send({ error: "Price is Required" });
            case !employmentType:
                return res.status(500).send({ error: "Category is Required" });
            case !workAuthorization:
                return res.status(500).send({ error: "Quantity is Required" });
            case !company:
                return res.status(500).send({ error: "Quantity is Required" });
            case !experience:
                return res.status(500).send({ error: "Quantity is Required" });
        }

        const job = await Job.findByIdAndUpdate(
            req.params._id,
            {
                jobTitle,
                slug: generateUniqueSlug(jobTitle),
                location,
                employmentType,
                workAuthorization,
                company,
                salary,
                experience,
                description,
                employer: req.user._id
            },
            { new: true }
        );
        await job.save();
        res.status(201).send({
            success: true,
            message: "Job Updated Successfully",
            job,
        });
        console.log('success')
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in Updte product",
        });
    }
};

module.exports.jobApplication = async (req, res) => {
    try {
        const jobId = req.params._id;
        const userId = req.user._id; // Assuming you have user information in req.user
        console.log(jobId);
        console.log(userId);

        // Check if userId and jobId are available
        if (!userId || !jobId) {
            return res.status(400).json({ error: 'Invalid user or job ID.' });
        }

        const existingApplication = await jobApplication.findOne({ jobSeekerId: userId, jobId });

        if (existingApplication) {
            return res.status(400).json({ error: 'You have already applied for this job.' });
        }

        const newApplication = new jobApplication({
            jobSeekerId: userId,
            jobId,
        });

        await newApplication.save();

        return res.status(201).json({ message: 'Job application submitted successfully.' });
    } catch (error) {
        console.error('Error applying for job:', error);
        return res.status(500).json({ error: 'Error applying for job.' });
    }

}

module.exports.applyJob = async (req, res) => {
    try {

        const jobId = req.params._id;
        const job = await Job.findOne({ _id: jobId });  // Correct usage of findOne
        const user = req.user._id;
        const jobSeeker = await UserModel.findById(user);

        if (job.applicants.includes(user)) {
            return res.status(400).json({ error: 'You have already applied for this job.' });
        }

        console.log(job);
        console.log(user)

        if (!user || !jobId) {
            return res.status(400).json({ error: 'Invalid user or job ID.' });
        }



        job.applicants.push(user);
        jobSeeker.myJob.push(jobId);
        await job.save();
        await jobSeeker.save();

        return res.status(200).json({ message: 'Apply Job Successfully.' });
    } catch (error) {
        console.error('Error applying Job:', error);
        return res.status(500).json({ error: 'Error Not Applying Job.' });
    }
}

module.exports.applicant = async (req, res) => {
    try {
        const job = await Job.findById(req.params._id);
        if (!job) {
            return res.status(404).json({ error: 'User not found' });
        }

        const applicant = job.applicants; // Assuming resumes is an array field in your user model
        res.status(200).json({ applicant });
    } catch (error) {
        console.error('Error fetching resumes:', error);
        res.status(500).json({ error: 'Error fetching resumes.' });
    }
};



module.exports.getMyJob = async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await UserModel.findById(userId).populate('myJob');
        const appliedJobs = user.myJob;

        res.status(200).json({ appliedJobs });
    } catch (error) {
        console.error('Error fetching applied jobs:', error);
        res.status(500).json({ message: 'Server Error' });
    }

};

module.exports.jobapplicants = async (req, res) => {
    try {
        // console.log(req.params)
        
        const job = await Job.find({}).populate('applicants')

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        res.status(200).json(job);
    } catch (error) {
        console.error('Error fetching job details:', error);
        res.status(500).json({ error: 'Server Error' });
    }

}


// // filters
// export const productFiltersController = async (req, res) => {
//     try {
//         const { checked, radio } = req.body;
//         let args = {};
//         if (checked.length > 0) args.category = checked;
//         if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
//         const products = await productModel.find(args);
//         res.status(200).send({
//             success: true,
//             products,
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(400).send({
//             success: false,
//             message: "Error WHile Filtering Products",
//             error,
//         });
//     }
// };

// // product count
// export const productCountController = async (req, res) => {
//     try {
//         const total = await productModel.find({}).estimatedDocumentCount();
//         res.status(200).send({
//             success: true,
//             total,
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(400).send({
//             message: "Error in product count",
//             error,
//             success: false,
//         });
//     }
// };

// // product list base on page
// export const productListController = async (req, res) => {
//     try {
//         const perPage = 6;
//         const page = req.params.page ? req.params.page : 1;
//         const products = await productModel
//             .find({})
//             .select("-photo")
//             .skip((page - 1) * perPage)
//             .limit(perPage)
//             .sort({ createdAt: -1 });
//         res.status(200).send({
//             success: true,
//             products,
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(400).send({
//             success: false,
//             message: "error in per page ctrl",
//             error,
//         });
//     }
// };

// // search product
// export const searchProductController = async (req, res) => {
//     try {
//         const { keyword } = req.params;
//         const resutls = await productModel
//             .find({
//                 $or: [
//                     { name: { $regex: keyword, $options: "i" } },
//                     { description: { $regex: keyword, $options: "i" } },
//                 ],
//             })
//             .select("-photo");
//         res.json(resutls);
//     } catch (error) {
//         console.log(error);
//         res.status(400).send({
//             success: false,
//             message: "Error In Search Product API",
//             error,
//         });
//     }
// };

// // similar products
// export const realtedProductController = async (req, res) => {
//     try {
//         const { pid, cid } = req.params;
//         const products = await productModel
//             .find({
//                 category: cid,
//                 _id: { $ne: pid },
//             })
//             .select("-photo")
//             .limit(3)
//             .populate("category");
//         res.status(200).send({
//             success: true,
//             products,
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(400).send({
//             success: false,
//             message: "error while geting related product",
//             error,
//         });
//     }
// };

// // get prdocyst by catgory
// export const productCategoryController = async (req, res) => {
//     try {
//         const category = await categoryModel.findOne({ slug: req.params.slug });
//         const products = await productModel.find({ category }).populate("category");
//         res.status(200).send({
//             success: true,
//             category,
//             products,
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(400).send({
//             success: false,
//             error,
//             message: "Error While Getting products",
//         });
//     }
// };

// //payment gateway api
// //token
// export const braintreeTokenController = async (req, res) => {
//     try {
//         gateway.clientToken.generate({}, function (err, response) {
//             if (err) {
//                 res.status(500).send(err);
//             } else {
//                 res.send(response);
//             }
//         });
//     } catch (error) {
//         console.log(error);
//     }
// };

// //payment
// export const brainTreePaymentController = async (req, res) => {
//     try {
//         const { nonce, cart } = req.body;
//         let total = 0;
//         cart.map((i) => {
//             total += i.price;
//         });
//         let newTransaction = gateway.transaction.sale(
//             {
//                 amount: total,
//                 paymentMethodNonce: nonce,
//                 options: {
//                     submitForSettlement: true,
//                 },
//             },
//             function (error, result) {
//                 if (result) {
//                     const order = new orderModel({
//                         products: cart,
//                         payment: result,
//                         buyer: req.user._id,
//                     }).save();
//                     res.json({ ok: true });
//                 } else {
//                     res.status(500).send(error);
//                 }
//             }
//         );
//     } catch (error) {
//         console.log(error);
//     }
// };