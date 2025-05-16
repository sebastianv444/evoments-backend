import axios from "axios";
import environments from "../config/dotenv.js";

/**
 * Consulta la Discovery API de Ticketmaster con caching simple.
 * @params espera que le pases un obeto para desestructurarlo.
 */
export const fetchEvents = async ({
  keyword = "",
  city = "",
  sort,
  size,
  page,
} = {}) => {
  const url = `${environments.ticketmaster.baseUrl}${environments.ticketmaster.discoveryPath}`;

  console.log({
    keyword: keyword,
    city: city,
  });

  try {
    const response = await axios.get(url, {
      params: {
        apikey: environments.ticketmaster.apiKey,
        keyword,
        city,
        /* Si existen estos objetos se colocan el los params a enviar como petición */
        ...(sort && { sort }),
        ...(size && { size }),
        ...(page && { page }),
      },
    });
    return response.data;
  } catch (error) {
    // Loguear información completa para depurar
    console.error(
      "Ticketmaster API error:",
      error.response?.status,
      error.response?.data || error.message
    );
    throw new Error("Error al conectar con Ticketmaster API");
  }
};
