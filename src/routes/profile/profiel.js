import express from "express";
import { getProfile } from "../../controllers/profile/profiel.js";

const router = express.Router();

router.get("/myProfile", getProfile); //trae el perfil del usuario

export default router;