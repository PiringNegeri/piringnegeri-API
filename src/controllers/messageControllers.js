import prisma from "../lib/prisma.js";

import { createMessageService } from "../services/message.service.js";

export async function getMessages(req,res) {
  try {
    const { reportId } =
      req.params;

    const messages =
      await prisma.message.findMany({
        where: {
          reportId:
            Number(reportId),

          isInternal: false,
        },

        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              username: true,
              role: true,
            },
          },
        },

        orderBy: {
          createdAt: "asc",
        },
      });

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Internal server error",
    });
  }
}

export async function createMessage(req,res) {
  try {
    const { reportId } =
      req.params;

    const { message } =
      req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message:
          "Message is required",
      });
    }

    const report =
      await prisma.report.findUnique({
        where: {
          id: Number(reportId),
        },
      });

    if (!report) {
      return res.status(404).json({
        success: false,
        message:
          "Report not found",
      });
    }

    const newMessage =
      await createMessageService({
        report,
        user: req.user,
        message,
      });

    return res.status(201).json({
      success: true,
      message:
        "Message created",
      data: newMessage,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Internal server error",
    });
  }
}