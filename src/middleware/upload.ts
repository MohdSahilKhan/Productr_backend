import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async () => ({
    folder: "products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"]
  }),
});

const upload = multer({ storage });
export default upload;
