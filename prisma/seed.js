import "dotenv/config";

import prismaPkg from "@prisma/client";
import bcrypt from "bcrypt";

import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const {
  PrismaClient,
  Role,
  ReportStatus,
  Priority,
  SenderType,
  SupportType,
} = prismaPkg;

const connectionString =
  process.env.DATABASE_URL;

const pool = new pg.Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Seeding database...");

  const hashedPassword =
    await bcrypt.hash("admin123", 10);

  // ======================
  // USERS
  // ======================

  const superAdmin =
    await prisma.user.create({
      data: {
        fullName: "Super Admin",
        username: "superadmin",
        email:
          "superadmin@piringnegeri.id",
        password: hashedPassword,
        role: Role.SUPER_ADMIN,
      },
    });

  const admin =
    await prisma.user.create({
      data: {
        fullName: "Admin",
        username: "admin",
        email: "admin@piringnegeri.id",
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });

  const staff =
    await prisma.user.create({
      data: {
        fullName: "Customer Staff",
        username: "staff",
        email: "staff@piringnegeri.id",
        password: hashedPassword,
        role: Role.STAFF,
      },
    });

  const user =
    await prisma.user.create({
      data: {
        fullName: "Muhammad Rizky",
        username: "rizky",
        email: "user@piringnegeri.id",
        password: hashedPassword,
        role: Role.USER,
      },
    });

  console.log("✅ Users seeded");

  // ======================
  // CATEGORY
  // ======================

  const makananBasi =
    await prisma.category.create({
      data: {
        name: "Makanan Basi",
        slug: "makanan-basi",
        description:
          "Laporan makanan basi",
      },
    });

  const takLayak =
    await prisma.category.create({
      data: {
        name: "Tak Layak Konsumsi",
        slug: "tak-layak-konsumsi",
        description:
          "Laporan makanan tidak layak konsumsi",
      },
    });

  console.log("✅ Categories seeded");

  // ======================
  // REPORT
  // ======================

  const report =
    await prisma.report.create({
      data: {
        title: "Makanan MBG Sudah Basi",

        slug:
          "makanan-mbg-sudah-basi",

        description:
          "Makanan berbau tidak sedap dan nasi keras.",

        status:
          ReportStatus.PENDING,

        priority:
          Priority.HIGH,

        supportType:
          SupportType.BOT,

        schoolName:
          "SMKN 1 Bekasi",

        location:
          "Bekasi Timur",

        userId: user.id,

        categoryId:
          makananBasi.id,

        images: {
          create: [
            {
              imageUrl:
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
            },
          ],
        },
      },
    });

  console.log("✅ Reports seeded");

  // ======================
  // BOT MESSAGE
  // ======================

  await prisma.message.create({
    data: {
      message:
        "Terima kasih, laporan Anda telah diterima dan sedang ditinjau oleh tim kami.",

      senderType:
        SenderType.BOT,

      reportId: report.id,
    },
  });

  // ======================
  // USER MESSAGE
  // ======================

  await prisma.message.create({
    data: {
      message:
        "Makanan berbau asam dan ayam kurang matang.",

      senderType:
        SenderType.USER,

      userId: user.id,

      reportId: report.id,
    },
  });

  // ======================
  // STAFF MESSAGE
  // ======================

  await prisma.message.create({
    data: {
      message:
        "Laporan sedang kami tindak lanjuti.",

      senderType:
        SenderType.STAFF,

      userId: staff.id,

      reportId: report.id,
    },
  });

  console.log("✅ Messages seeded");

  console.log(
    "🎉 Database seeding completed!"
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });