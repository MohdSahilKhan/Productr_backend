import { Router } from "express";
import upload from "../middleware/upload";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/productController";

const router = Router();

router.post("/",upload.array("images", 10),createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id",upload.array("images", 10),updateProduct);
router.delete("/:id", deleteProduct);

export default router;
