import { Request, Response } from "express";
import Product from "../models/Product";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const imageUrls = (req.files as Express.Multer.File[]).map(
      (file) => file.path
    );
    const productData = {
      ...req.body,
      images: imageUrls,
    };
    const product = await Product.create(productData);
    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { published } = req.query;
    const filter: any = {};
    if (published !== undefined) {
      filter.is_published = published === 'true';
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ error: "Unable to fetch products" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch product" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    let updatedData = { ...req.body };
    if (req.files) {
      const imageUrls = (req.files as Express.Multer.File[]).map(
        (file) => file.path
      );
      updatedData.images = imageUrls;
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    res.json({ message: "Product updated", product });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
};
