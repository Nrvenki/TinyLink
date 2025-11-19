import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      match: /^[A-Za-z0-9]{6,8}$/
    },
    targetUrl: {
      type: String,
      required: true
    },
    totalClicks: {
      type: Number,
      default: 0
    },
    lastClickedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

linkSchema.index({ code: 1 });

export const Link = mongoose.model("Link", linkSchema);