import multer from "multer";
import express from "express";
import { uploadDocument, uploadLink, getMyDocument } from "../../controllers/docs/docs.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

const router = express.Router();

router.post("/upload/:userId", upload.single("file"), uploadDocument);
router.get("/myDocuments/:userId", getMyDocument);
router.post("/uploadLink/:userId", uploadLink);

export default router;
