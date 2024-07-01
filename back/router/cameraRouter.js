import express from "express";
import { createAndEditCamera, deleteCamera, getAllCamers } from "../controllers/cameraController.js";

const cameraRouter = express.Router();
const jsonParser = express.json();

cameraRouter.post("/create", createAndEditCamera);
cameraRouter.get("/list", getAllCamers);
cameraRouter.delete("/delete", jsonParser, deleteCamera);

export default cameraRouter;