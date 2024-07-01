import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import Camera from "../models/cameraModel.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



const saveDataToDB = async (cameraId, data, res) => {
  if (cameraId === "") {
    await Camera.create(data)
      .then(() => res.sendStatus(200))
      .catch((error) => {
        console.error("Error creating the new camera record:", error);
        res.status(500).send("Error creating the new camera record");
      });
  } else {
    await Camera.findByIdAndUpdate(cameraId, data)
      .then(() => res.sendStatus(200))
      .catch((error) => {
        console.error("Error updating camera record data:", error);
        res.status(500).send("Error updating camera record data");
      });
  }
};

export const createAndEditCamera = async (req, res) => {
  const cameraForm = formidable({
    multiples: true,
    keepExtensions: true,
    allowEmptyFiles: true,
    minFileSize: 0,
  });
  try {
    cameraForm.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Form parsing error:", err);
        return res.status(400).json({ msg: "Form data parsing error" });
      }

      for (const key in fields) {
        if (Array.isArray(fields[key])) {
          fields[key] = fields[key].join(", ");
        }
      }

      const {
        cameraId,
        cameraName,
        cameraType,
        cameraBrand,
        cameraVideo,
        cameraPanel,
        cameraWeight,
        oldCloudinaryPublicId,
        oldImagePath,
      } = fields;

      const cameraData = {
        name: cameraName,
        type: cameraType,
        brand: cameraBrand,
        video: cameraVideo,
        panel: cameraPanel,
        weight: cameraWeight,
      };

      if (!files.cameraImage || !files.cameraImage.length || !files.cameraImage[0].originalFilename) {
        cameraData.image = oldImagePath;
        cameraData.cloudinaryPublicId = oldCloudinaryPublicId;
        return saveDataToDB(cameraId, cameraData, res);
      }

      const { filepath, originalFilename } = files.cameraImage[0];

      try {
        cloudinary.uploader.upload(filepath, (err, resultCloudinaryImage) => {
          if (err) {
            console.error("Cloudinary upload error:", err);
            return res.status(500).json({ msg: "Error uploading image to Cloudinary" });
          }

          if (!resultCloudinaryImage) {
            console.error("No result from Cloudinary upload");
            return res.status(500).json({ msg: "No result from Cloudinary upload" });
          }

          cameraData.image = resultCloudinaryImage.url;
          cameraData.cloudinaryPublicId = resultCloudinaryImage.public_id;
          saveDataToDB(cameraId, cameraData, res);

          if (oldCloudinaryPublicId) {
            cloudinary.uploader.destroy(oldCloudinaryPublicId, (err) => {
              if (err) {
                console.error("Error deleting old image from Cloudinary:", err);
              }
            });
          }
        });
      } catch (error) {
        console.error("Cloudinary upload exception:", error);
        return res.status(500).json({ msg: "Error uploading image to Cloudinary" });
      }
    });
  } catch (error) {
    console.error("Error parsing formData:", error);
    return res.status(500).json({ msg: "Error parsing formData" });
  }
};

export const getAllCamers = async (req, res) => {
  const search = req.query.search || '';
  try {
    const camers = await Camera.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } }
      ]
    });
    res.status(200).json({ camers: camers });
  } catch (error) {
    console.error("Error getting camers:", error);
    res.status(401).json({ msg: "Error in getting camers list: " });
  }
};

export const deleteCamera = async (req, res) => {
  try {
    await cloudinary.uploader.destroy(req.body.cloudinaryPublicId);
  } catch (error) {
    console.error(error);
  }

  Camera.findByIdAndDelete(req.body._id)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error("Removing camera error: ", err);
      res.status(401).json({ msg: "Error in deleting camera" });
    });
};