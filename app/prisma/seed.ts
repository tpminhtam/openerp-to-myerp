import { PrismaClient } from "@prisma/client";
import { seed } from "../lib/seed";

const prisma = new PrismaClient();
seed(prisma).finally(() => prisma.$disconnect());
