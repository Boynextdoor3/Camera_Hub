import express from 'express';
import cameraRouter from './cameraRouter.js';

const router = express.Router();

router.use("/camera", cameraRouter);

export default router;