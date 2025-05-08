import prisma from "../config/db.js";

export const syncUser = async ({
  clerkId,
  firstName,
  lastName,
  email,
  phoneNumber,
}) => {
  return await prisma.cliente.upsert({
    where: { clerkUserId: clerkId },
    create: {
      clerkUserId: clerkId,
      nombre: firstName,
      apellidos: lastName,
      email,
      telefono: phoneNumber,
    },
    update: {
      nombre: firstName,
      apellidos: lastName,
      email,
      telefono: phoneNumber,
    },
  });
};