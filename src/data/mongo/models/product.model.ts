import mongoose from "mongoose";

const productModel = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    unique: true,
  },

  available: {
    type: Boolean,
    default: true,
  },

  price: {
    type: Number,
    default: 0,
  },
  qtty: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
  },

  user: {
    type: mongoose.Types.ObjectId, //* A mongo _id is required here
    ref: "User", //* The referenced model is User
    required: [true, " Category name is required"],
  },
  category: {
    type: mongoose.Types.ObjectId, //* A mongo _id is required here
    ref: "Category", //* The referenced model is Category
    required: [true, " Category name is required"],
  },
});

export const ProductModel = mongoose.model("Product", productModel);
