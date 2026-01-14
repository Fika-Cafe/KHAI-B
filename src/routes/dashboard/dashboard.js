import express from "express";
import { recentDocuments, mostViewedDocuments } from "../../controllers/dashboard/dashboard.js";

const router = express.Router();

/**
 * @openapi
 * /dashboard/recentDocuments/{userId}:
 *   get:
 *     summary: Obtiene los documentos recientes de un usuario
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Documentos recientes encontrados }
 *       401: { description: No autorizado }
 */
router.get("/recentDocuments/:userId", recentDocuments);

/**
 * @openapi
 * /dashboard/mostViewedDocuments/{userId}:
 *   get:
 *     summary: Obtiene los documentos más vistos de un usuario
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Documentos más vistos encontrados }
 *       401: { description: No autorizado }
 */
router.get("/mostViewedDocuments/:userId", mostViewedDocuments);

export default router;