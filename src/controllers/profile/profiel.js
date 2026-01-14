import { check, validationResult } from "express-validator";
import prisma from "../../../prisma/prismaClient.js";

const getProfile = async (req, res) => {
  const { userId } = req.params;

  await check("userId").isUUID().withMessage("User ID is not valid.").run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const profile = await prisma.profiles.findUnique({
      where: { id: userId },
      include: {
        team: true,
      },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found." });
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

const createProfile = async (req, res) => {
  const { userId, username, teamname, teamrole, teamid } = req.body;

  await check("userId").isUUID().withMessage("User ID is not valid.").run(req);
  await check("username")
    .isString()
    .withMessage("Username is not valid.")
    .run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  var permissions = "Reader";

  try {
    if (teamrole === "Owner") {
      permissions = "Admin";

      const profile = await prisma.profiles.create({
        data: {
          id: userId,
          name: username,
          permissions,
        },
      });

      if (!profile) {
        return res.status(400).json({ error: "Error creating profile." });
      }

      const team = await prisma.team.create({
        data: {
          name: teamname,
          owner_id: profile.id,
        },
      });

      if (!team) {
        return res.status(400).json({ error: "Error creating team." });
      }

      const teamMember = await prisma.team_members.create({
        data: {
          team_id: team.id,
          profile_id: profile.id,
          role: teamrole,
        },
      });

      if (!teamMember) {
        return res.status(400).json({ error: "Error creating team member." });
      }
    } else {
      const profile = await prisma.profiles.create({
        data: {
          id: userId,
          name: username,
          permissions,
        },
      });

      if (!profile) {
        return res.status(400).json({ error: "Error creating profile." });
      }

      const teamMember = await prisma.team_members.create({
        data: {
          team_id: teamid,
          profile_id: profile.id,
        },
      });
      if (!teamMember) {
        return res.status(400).json({ error: "Error creating team member." });
      }
    }
    return res.status(201).json({ message: "Profile created successfully." });
  } catch (error) {
    console.error("Error creating profile:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

const profielVerification = async (req, res) => {
  const { userId } = req.params;

  await check("userId").isUUID().withMessage("User ID is not valid.").run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const profile = await prisma.profiles.findUnique({
      where: { id: userId },
      include: {
        team: true,
        memberships: {
          include: {
            team: true,
          },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found." });
    }

    return res
      .status(200)
      .json({ message: "Profile verified successfully.", data: profile });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

export { getProfile, createProfile, profielVerification };
