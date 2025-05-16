import prisma from "../config/db.js";

export const syncUser = async ({
  clerkId,
  firstName,
  lastName,
  email,
  phoneNumber,
  username
}) => {
  return await prisma.cliente.upsert({
    where: { clerkUserId: clerkId },
    create: {
      clerkUserId: clerkId,
      username,
      nombre: firstName,
      apellidos: lastName,
      email,
      telefono: phoneNumber,
    },
    update: {
      username,
      nombre: firstName,
      apellidos: lastName,
      email,
      telefono: phoneNumber,
    },
  });
};
