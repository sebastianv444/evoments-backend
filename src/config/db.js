/* Cliente de Prisma que nos permite realizar las consultas en la 
Base de Datos.
OJO: Hay que importar este archivo y usar la constante creada aquí,
donde vayamos a realizar las consultas sql.
*/
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export default prisma;