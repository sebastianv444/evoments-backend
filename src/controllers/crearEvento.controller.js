import { syncCrearEvento } from "../models/CrearEvento.model.js";

export async function crearEvento(req, res) {
  try {
    console.log(req.body);
    const evento = await syncCrearEvento(req.body);
    return res.status(200).json({ success: true, evento });
  } catch (err) {
    console.error("Error en crearEvento:", err);
    return res
      .status(400)
      .json({ success: false, message: err.message });
  }
}
