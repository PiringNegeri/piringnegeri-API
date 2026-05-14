export async function sendBotMessage(
  prisma,
  reportId,
  message
) {
  return prisma.message.create({
    data: {
      message,
      senderType: "BOT",
      reportId,
    },
  });
}