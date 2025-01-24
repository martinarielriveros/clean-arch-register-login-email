import mongoose from "mongoose";
import { customRegex } from "../../../config/regex-helpers";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    minlength: [3, "name should be at least 3 characters long"],
    maxlength: [20, "name should not be more than 20 characters long"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    validate: {
      validator: (value: string) => {
        // return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        return customRegex.email.test(value);
      },
      message: "Please enter a valid email address",
    },
  },
  emailValidated: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minlength: [3, "name should be at least 3 characters long"],
  },
  role: {
    type: String,
    default: "USER_ROLE",
    enum: ["ADMIN_ROLE", "USER_ROLE"],
  },
  img: {
    type: String,
  },
});

export const userModel = mongoose.model("User", userSchema);
