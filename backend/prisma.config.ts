import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";
import path from "path";

// Explicitly load .env from project root
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource :{
    db: {
      url: process.env.DATABASE_URL || "",
    },
  },
});