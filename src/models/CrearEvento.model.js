import prisma from "../config/db.js";
import { getCreatorByClerkId } from "../services/user.service.js";

export const syncCrearEvento = async (payload) => {
  const {
    titulo,
    descripcion,
    fechaEvento,
    categoria,
    zonas,
    clerkId,
    nombreLugar,
    direccionLugar,
    localidad,
    capacidadLugar,
    descripcionLugar,
  } = payload;

  const creador = await getCreatorByClerkId(clerkId);
  if (!creador) {
    throw new Error("El usuario no tiene rol de creador");
  }

  const capacidadTotal = parseInt(capacidadLugar, 10);
  const fecha = new Date(fechaEvento);
  if (isNaN(capacidadTotal) || isNaN(fecha.getTime())) {
    throw new Error("Tipo inválido en fechaEvento o capacidadLugar");
  }

  const lugar = await prisma.venue.create({
    data: {
      nombre: nombreLugar,
      direccion: direccionLugar,
      localidad,
      capacidadTotal,
      descripcion: descripcionLugar || null,
    },
  });

  const evento = await prisma.evento.create({
    data: {
      creadorId: creador.id,
      venueId: lugar.id,
      titulo,
      descripcion,
      fechaEvento: fecha,
      categoria,
    },
  });

  for (const z of zonas) {
    const capacidadZona = parseInt(z.capacidad, 10);
    const precioZona = parseFloat(z.precioEntrada);
    if (isNaN(capacidadZona) || isNaN(precioZona)) {
      throw new Error(`Datos inválidos en zona ${z.nombreZona}`);
    }
    await prisma.zonaEvento.create({
      data: {
        eventoId: evento.id,
        nombre: z.nombreZona,
        capacidad: capacidadZona,
        precioBase: precioZona,
        descripcion: z.descripcion || null,
        ventaNumerada: false,
      },
    });
  }

  return evento;
};
