import prisma from "../config/db.js";

export async function eventosDelPropioCreador(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Falta el email del creador" });
    }

    const creador = await prisma.creador.findUnique({
      where: { email },
    });

    if (!creador) {
      return res.status(404).json({ error: "Creador no encontrado" });
    }

    const eventos = await prisma.evento.findMany({
      where: {
        creadorId: creador.id,
      },
      include: {
        venue: true,
      },
    });

    res.json(eventos);
  } catch (error) {
    console.error("Error obteniendo eventos del creador:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}


export async function cambiarEventocreador(req, res) {
  try {
        const { id, accion } = req.body;

        if (!id || !accion) {
            return res.status(400).json({ error: 'Nos falta id o accion' })
        }
        const nuevoEstado = accion === 'modificar' ? 'modificar' : accion === 'eliminar' ? 'eliminar' : null;

        if (!nuevoEstado) {
            return res.status(400).json({ error: 'No se puede realizar esa opcion' });
        }
        /*Faltaria el formulario de modificar pasarlo por aqui */
        if(nuevoEstado === 'modificar'){
            console.log("MODIFICADO");
            const eventoModificado = await prisma.evento.update({
            where: { id: parseInt(id) },
            });
            res.status(200).json(eventoModificado);
        }
        
        if(nuevoEstado === 'eliminar'){
            console.log("ELIMINADO");
            const eventoeliminado = await prisma.evento.delete({
            where: { id: parseInt(id) },
            });
            res.status(200).json(eventoeliminado);
        }
    } catch (error) {
        console.error('Error actualizando evento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });

    }
}