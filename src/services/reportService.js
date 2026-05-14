import prisma from "../lib/prisma.js";
import slugify from "slugify";
import { sendBotMessage } from "../utils/botMessage.js";
import { deleteReportFiles } from "./storageService.js";

export async function createReportService(payload){
  const {
    title,
    description,
    categoryId,
    schoolName,
    location,
    priority,
    userId,
  } = payload;

  const slug = slugify(title, {
    lower: true,
    strict: true,
  });

  const report =
    await prisma.report.create({
      data: {
        title,
        slug,
        description,
        schoolName,
        location,
        priority:
          priority || "MEDIUM",
        userId,
        categoryId:
          Number(categoryId),
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
      },
    });

  await sendBotMessage(
    prisma,
    report.id,
    "Terima kasih, laporan Anda telah diterima dan sedang ditinjau oleh tim kami."
  );

  return report;
}

export async function deleteReportService(
  reportId
) {
  const report =
    await prisma.report.findUnique({
      where: {
        id: Number(reportId),
      },

      include: {
        images: true,
      },
    });

  if (!report) {
    throw new Error(
      "Report not found"
    );
  }

  await deleteReportFiles(
    report.images
  );

  await prisma.report.delete({
    where: {
      id: Number(reportId),
    },
  });

  return report;
}