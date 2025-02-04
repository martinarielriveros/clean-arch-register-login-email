import mongoose from "mongoose";

const categoryModel = new mongoose.Schema({
  name: {
    type: String,
    required: [true, " Category-model's 'name' is required"],
    unique: true,
  },

  available: {
    type: Boolean,
    default: true,
  },
  user: {
    type: mongoose.Types.ObjectId, //* A mongo _id is required here
    ref: "User", //* The referenced model is User
    required: [true, " Category-model's 'user' is required"],
  },
});

categoryModel.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret, options) {
    delete ret._id;
    delete ret.__v;
  },
});

export const CategoryModel = mongoose.model("Category", categoryModel);
