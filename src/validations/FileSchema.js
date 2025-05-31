import { z } from "zod";

export  const fileSchema = z.object({
  sourcePath: z.string().nonempty("Debes seleccionar un archivo"),
  // destPath: z.string().nonempty("Debes seleccionar una carpeta de destino"),
  outputFormat: z.enum(["csv", "txt", "xml", "json"], {
    errorMap: () => ({ message: "Debes seleccionar un formato de salida" }),
  }),
  delimiter: z.string().nonempty("El delimitador no puede estar vacío"),
  key: z.string().nonempty("La llave no puede estar vacía"),
});
