import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const connect = async () => {
try {
await mongoose.connect(process.env.DB_URL || "" as string);
console.log("Conectado a la base de datos");
} catch(err: any) {
    console.error("Error al conectar a la base de datos: "+err.message);
}
}