import prisma from "../lib/prisma.js";
export async function createMessageService(
  payload
) {
  const {
    report,
    user,
    message,
  } = payload;

  let senderType = "USER";

  if (user.role === "STAFF") {
    senderType = "STAFF";
  }

  if (
    user.role === "ADMIN" ||
    user.role ===
      "SUPER_ADMIN"
  ) {
    senderType = "ADMIN";
  }

  if (
    report.supportType ===
      "BOT" &&
    senderType === "USER"
  ) {
    await prisma.report.update({
      where: {
        id: report.id,
      },
      data: {
        supportType:
          "HUMAN",
      },
    });
  }

  return prisma.message.create({
    data: {
      message,
      senderType,
      userId: user.id,
      reportId: report.id,
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
  });
}