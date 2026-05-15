import prisma from "../lib/prisma.js";
import { createReportService, deleteReportService } from "../services/reportService.js";

import { sendBotMessage } from "../utils/botMessage.js";

export async function createReport(req,res) {
  try {
    const {
      title,
      description,
      categoryId,
      schoolName,
      location,
      priority,
    } = req.body;

    if (
      !title ||
      !description ||
      !categoryId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Required fields missing",
      });
    }

    const category =
      await prisma.category.findUnique({
        where: {
          id: Number(categoryId),
        },
      });

    if (!category) {
      return res.status(404).json({
        success: false,
        message:
          "Category not found",
      });
    }

    const report =
      await createReportService({
        title,
        description,
        categoryId,
        schoolName,
        location,
        priority,
        userId: req.user.id,
      });

    return res.status(201).json({
      success: true,
      message:
        "Report created successfully",
      data: report,
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

export async function getReports(req,res) {
  try {
    const reports =
      await prisma.report.findMany({
        include: {
          category: true,

          user: {
            select: {
              id: true,
              fullName: true,
              username: true,
            },
          },

          images: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return res.status(200).json({
      success: true,
      data: reports,
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

export async function getReportBySlug(req,res) {
  try {
    const { slug } = req.params;

    const report =
      await prisma.report.findUnique({
        where: {
          slug,
        },

        include: {
          category: true,

          user: {
            select: {
              id: true,
              fullName: true,
              username: true,
            },
          },

          images: true,

          messages: {
            where: {
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
          },
        },
      });

    if (!report) {
      return res.status(404).json({
        success: false,
        message:
          "Report not found",
      });
    }

    await prisma.report.update({
      where: {
        id: report.id,
      },

      data: {
        views: {
          increment: 1,
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: report,
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

export async function deleteReport(req,res) {
  try {
    const { id } = req.params;

    await deleteReportService(id);

    return res.status(200).json({
      success: true,
      message:
        "Report deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
}

export async function requestHumanSupport(req,res) {
  try {
    const { id } = req.params;

    const report =
      await prisma.report.findUnique({
        where: {
          id: Number(id),
        },
      });

    if (!report) {
      return res.status(404).json({
        success: false,
        message:
          "Report not found",
      });
    }

    await prisma.report.update({
      where: {
        id: report.id,
      },

      data: {
        supportType:
          "HUMAN",
      },
    });

    await sendBotMessage(
      prisma,
      report.id,
      "Permintaan bantuan staff telah dikirim."
    );

    return res.status(200).json({
      success: true,
      message:
        "Human support requested",
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