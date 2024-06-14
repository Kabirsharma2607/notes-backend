import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("File is uploaded on cloudinary", res.url);
    return res;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  } finally {
    fs.unlinkSync(localFilePath);
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Deleted from Cloudinary", result);
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
