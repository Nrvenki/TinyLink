import express from "express";
import {
  createLink,
  listLinks,
  getLinkStats,
  deleteLink,
  handleRedirect
} from "../controllers/linkController.js";

const router = express.Router();

// API
router.post("/api/links", createLink);
router.get("/api/links", listLinks);
router.get("/api/links/:code", getLinkStats);
router.delete("/api/links/:code", deleteLink);

// Stats page data is served via /api/links/:code (frontend uses this)

// Redirect
router.get("/:code", handleRedirect);

export default router;
