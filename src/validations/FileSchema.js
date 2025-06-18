import { z } from "zod";

export const fileSchema = z
  .object({
    sourcePath: z.preprocess(
      (val) => (typeof val === "string" ? val : ""),
      z.string().nonempty("Debes seleccionar un archivo")
    ),
    destPath: z.preprocess(
      (val) => (typeof val === "string" ? val : ""),
      z.string().nonempty("Debes seleccionar una carpeta de destino")
    ),
    outputFormat: z.enum(["csv", "txt", "xml", "json"], {
      errorMap: () => ({ message: "Debes seleccionar un formato de salida" }),
    }),
    delimiter: z.string().optional(), // no validamos aquí
    key: z.string().nonempty("La llave no puede estar vacía"),
  })
  .superRefine((data, ctx) => {
    const source = data.sourcePath ?? "";
    const format = data.outputFormat ?? "";

    const isSourceJsonOrXml = source.endsWith(".json") || source.endsWith(".xml");
    const isOutputJsonOrXml = format === "json" || format === "xml";
    const isJsonOrXmlToJsonOrXml = isSourceJsonOrXml && isOutputJsonOrXml;

    const mustValidateDelimiter = !isJsonOrXmlToJsonOrXml || !source || !format;

    if (mustValidateDelimiter) {
      if (!data.delimiter || data.delimiter.trim() === "") {
        ctx.addIssue({
          path: ["delimiter"],
          code: z.ZodIssueCode.custom,
          message: "El delimitador no puede estar vacío",
        });
      }
    }
  });
