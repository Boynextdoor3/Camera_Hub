import mongoose from "mongoose";

const cameraSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  panel: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  }
},
{
  timestamps: true  
});

const Camera = mongoose.model('Camera', cameraSchema);

export default Camera;