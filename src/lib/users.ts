import prisma from "./prisma";
import { UserDto } from "./users.types";
import { createHash } from "crypto";

function hashPassword(plainPassword: string): string {
  return createHash("sha256").update(plainPassword).digest("hex");
}

export async function getUserByEmail(email: string): Promise<UserDto | null> {
  const userDb = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true },
  });

  if (!userDb) {
    return null;
  }

  return {
    id: userDb.id,
    email: userDb.email,
  };
}

export async function verifyPassword(
  email: string,
  plainPassword: string,
): Promise<UserDto | null> {
  const userDb = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, password: true },
  });

  if (!userDb) {
    return null;
  }

  const hashedPassword = hashPassword(plainPassword);

  if (hashedPassword !== userDb.password) {
    return null;
  }

  return {
    id: userDb.id,
    email: userDb.email,
  };
}
