const { v2: cloudinary } = require("cloudinary");
const { response } = require("express");
const fs = require("fs");

cloudinary.config({
    cloud_name: 'dgxxlojtg',
    api_key: "981354391542695",
    api_secret: 'vJT-k6jufiOcR2Am-5XWTK9-qmo'

});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        // Upload the file on Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {

            resource_type: "auto"
        });
        console.log(response.url)
        // File has been uploaded successfully
        console.log(localFilePath)
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // Remove the locally saved temporary file as the upload operation failed
        return null;
    }
};

module.exports = {
    uploadOnCloudinary
};
