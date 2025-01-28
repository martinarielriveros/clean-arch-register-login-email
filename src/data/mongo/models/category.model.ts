import mongoose from "mongoose";

const categoryModel = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    unique: true,
  },

  available: {
    type: Boolean,
    default: true,
  },
  user: {
    type: mongoose.Types.ObjectId, //* A mongo _id is required here
    ref: "User", //* The referenced model is User
    required: [true, " Category name is required"],
  },
});

export const CategoryModel = mongoose.model("Category", categoryModel);
