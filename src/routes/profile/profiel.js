import express from "express";
import { getProfile } from "../../controllers/profile/profiel.js";

const router = express.Router();

router.get("/myProfile", getProfile); // perfil y sus historiales de busqueda

export default router;