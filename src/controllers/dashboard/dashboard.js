import prisma from "../../../prisma/prismaClient.js";
import { check, validationResult } from "express-validator";

const recentDocuments = async (req, res) => {
  const { userId } = req.params;
  await check("userId").isUUID().withMessage("User ID is not valid.").run(req);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const profile = await prisma.profiles.findUnique({
      where: { id: userId },
    });

    if (!profile) {
      return res.status(404).json({ message: "Invalid profile." });
    }

    const logs = await prisma.search_log.findMany({
      where: { profile_id: profile.id },
      orderBy: { created_at: "desc" },
      take: 8,
      include: {
        results: {
          include: {
            document: {
              select: {
                id: true,
                title: true,
                created_at: true,
              },
            },
            links: true,
          },
        },
      },
    });

    const documents = logs.map((log) =>
      log.results.map((result) => result.document)
    );
    const links = logs.map((log) => log.results.map((result) => result.links));

    return res.status(200).json({
      message: "Recent documents fetched successfully",
      documents,
      links,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error fetching recent documents.",
      error: error,
    });
  }
};

const mostViewedDocuments = async (req, res) => {
  const { userId } = req.params;
  await check("userId").isUUID().withMessage("User ID is not valid.").run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const profile = await prisma.profiles.findUnique({
      where: { id: userId },
    });

    if (!profile) {
      return res.status(404).json({ message: "Invalid profile." });
    }

    const documents = await prisma.documents.findMany({
      orderBy: { count: "desc" },
      select: {
        id: true,
        title: true,
        count: true,
        profile: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: 8,
    });
    return res.status(200).json({
      message: "Most-viewed documents fetched successfully",
      documents,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching most-viewed documents.",
      error: error,
    });
  }
};

export { recentDocuments, mostViewedDocuments };
