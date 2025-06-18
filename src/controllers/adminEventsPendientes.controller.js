
import prisma from "../config/db.js";

export async function eventospendientes(req, res) {
    try {
        const eventosPendientes = await prisma.evento.findMany({
            where: {
                estado: 'PENDIENTE',
            },
            include: {
                creador: true,
                venue: true,
            },
        });
        console.log("Mandando Eventos pendientes al fronted");
        res.json(eventosPendientes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener eventos pendientes' });
    }
}

export const actualizarEstadoEvento = async (req, res) => {
    try {
        const { id, accion } = req.body;

        if (!id || !accion) {
            return res.status(400).json({ error: 'Nos falta id o accion' })
        }
        const nuevoEstado = accion === 'aceptar' ? 'ACTIVO' : accion === 'rechazar' ? 'CANCELADO' : null;

        if (!nuevoEstado) {
            return res.status(400).json({ error: 'No se puede realizar esa opcion' });
        }
        const eventoActualizado = await prisma.evento.update({
            where: { id: parseInt(id) },
            data: { estado: nuevoEstado },
        });

        res.status(200).json(eventoActualizado);
    } catch (error) {
        console.error('Error actualizando evento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });

    }
}

export const comprobacionAdmin = async(req,res) =>{
     try {
    const { identificacion } = req.body;

    if (!identificacion) {
      return res.status(400).json({ error: "Falta el email del admin" });
    }
    console.log(identificacion);

    const admin = await prisma.admin.findUnique({
      where: { identificacion },
    });
    console.log(admin)

    if (!admin) {
      return res.status(404).json({ error: "admin no encontrado" });
    }else if (admin){
        console.log("Admin cogido en el backend")
        return res.json({
        isAdmin: true,
      });
    }
  } catch (error) {
    console.error("Error obteniendo eventos del creador:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}