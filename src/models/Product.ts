import mongoose, { Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  type: "foods" | "electronics" | "clothes" | "beauty" | "others";
  quantity: number;
  stock: number;
  mrp: number;
  selling_price: number;
  brand_name: string;
  images: string[];
  exchange_or_return: "yes" | "no";
  is_published: boolean;
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["foods", "electronics", "clothes", "beauty", "others"],
      required: true,
    },
    quantity: { type: Number, required: true },
    stock: { type: Number, required: true },
    mrp: { type: Number, required: true },
    selling_price: { type: Number, required: true },
    brand_name: { type: String, required: true },
    images: { type: [String], required: true },
    exchange_or_return: { type: String, enum: ["yes", "no"], required: true },
    is_published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;
