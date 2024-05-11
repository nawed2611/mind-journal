import { PrismaClient } from "@/prisma/generated/client";
const prisma = new PrismaClient();

if (process.env.NODE_ENV === "development") global.prisma = prisma;

export default prisma;
