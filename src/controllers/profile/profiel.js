import prisma from "../../../prisma/prismaClient.js";
import { check, validationResult } from "express-validator";

const getProfile = async (req, res) => {
  const { userId } = req.body;

  await check("userId")
    .notEmpty()
    .withMessage("El ID de usuario es obligatorio.")
    .run(req);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const profile = await prisma.profiles.findUnique({
      where: { id: userId },
    });

    if (!profile) {
      return res.status(404).json({ error: "Perfil no encontrado." });
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

export { getProfile };
