import { Link } from "../models/Link.js";
import { isValidUrl } from "../utils/validateUrl.js";
import { generateCode } from "../utils/generateCode.js";

export const createLink = async (req, res, next) => {
  try {
    let { targetUrl, code } = req.body;

    if (!targetUrl) {
      return res.status(400).json({ error: "targetUrl is required" });
    }
    if (!isValidUrl(targetUrl)) {
      return res.status(400).json({ error: "Invalid URL" });
    }

    if (code && !/^[A-Za-z0-9]{6,8}$/.test(code)) {
      return res.status(400).json({ error: "Code must match [A-Za-z0-9]{6,8}" });
    }

    if (!code) {
      // auto-generate 6-char code, retry until unique
      let attempts = 0;
      while (attempts < 10) {
        const candidate = generateCode(6);
        const exists = await Link.findOne({ code: candidate }).lean();
        if (!exists) {
          code = candidate;
          break;
        }
        attempts++;
      }
      if (!code) {
        return res.status(500).json({ error: "Could not generate unique code" });
      }
    }

    const existing = await Link.findOne({ code }).lean();
    if (existing) {
      return res.status(409).json({ error: "Code already exists" });
    }

    const link = await Link.create({ 
      code, 
      targetUrl,
      totalClicks: 0,
      lastClickedAt: null
    });

    return res.status(201).json({
      _id: link._id,
      code: link.code,
      targetUrl: link.targetUrl,
      totalClicks: link.totalClicks,
      lastClickedAt: link.lastClickedAt,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt
    });
  } catch (err) {
    next(err);
  }
};

export const listLinks = async (req, res, next) => {
  try {
    const links = await Link.find({}).sort({ createdAt: -1 }).lean();
    return res.json(links);
  } catch (err) {
    next(err);
  }
};

export const getLinkStats = async (req, res, next) => {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ code }).lean();

    if (!link) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.json(link);
  } catch (err) {
    next(err);
  }
};

export const deleteLink = async (req, res, next) => {
  try {
    const { code } = req.params;
    const result = await Link.deleteOne({ code });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const handleRedirect = async (req, res, next) => {
  try {
    const { code } = req.params;
    
    console.log(`Redirecting code: ${code}`); // Debug log
    
    const link = await Link.findOneAndUpdate(
      { code },
      {
        $inc: { totalClicks: 1 },
        $set: { lastClickedAt: new Date() },
      },
      { new: true, runValidators: false }
    );

    if (!link) {
      return res.status(404).send("Not found");
    }

    console.log(`Updated clicks to: ${link.totalClicks}`); // Debug log

    return res.redirect(302, link.targetUrl);
  } catch (err) {
    console.error("Redirect error:", err); // Debug log
    next(err);
  }
};