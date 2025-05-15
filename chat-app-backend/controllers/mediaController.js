const multer = require("multer");
const s3 = require("../config/aws");

// Configure Multer for S3 uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
}).single("file"); // Assuming the file input name is "file"

module.exports = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "Error with file upload", error: err });
    }

    const { file } = req;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `uploads/${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const result = await s3.upload(params).promise();
      req.fileUrl = result.Location; // Attach the file URL to the request object
      next(); // Proceed to the next middleware or function
    } catch (error) {
      res.status(500).json({ message: "Error uploading file", error });
    }
  });
};
