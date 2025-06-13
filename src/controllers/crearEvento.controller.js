import { syncCrearEvento } from "../models/CrearEvento.models";

export async function crearEvento(req, res) {
  try {
    console.log("Estoy en el cotrolador crearEvento");
    console.log(req.body);
    const { titulo,
      descripcion,
      fechaEvento,
      categoria,
      zonas } =
      req.body;

    const user = await syncCrearEvento({
      titulo,
      descripcion,
      fechaEvento,
      categoria,
      zonas,
    });
    res.status(200).json({ success: true, user });
  } catch (err) {
    return res.status(400).json({ error: true, msj: err });
  }
}