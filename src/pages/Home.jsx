import { Button, FormLabel, Grid } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CustomInput from "../components/generic/CustomInput";
import CustomSelect from "../components/generic/CustomSelect";
import CustomButton from "../components/generic/CustomButton";
import { Controller, useForm } from "react-hook-form";
import { fileSchema } from "../validations/FileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const Home = () => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(fileSchema),
  });

  // Refs para los inputs ocultos
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  // Estados del componente
  const [sourcePath, setSourcePath] = useState("");
  const [destPath, setDestPath] = useState("");
  const [fileType, setFileType] = useState("");
  const [previewContent, setPreviewContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [directoryHandle, setDirectoryHandle] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultContent, setResultContent] = useState("");

  const isEncrypted = fileType === "txt" || fileType === "csv";

  // Funciones para abrir los diálogos de selección
  const openFileDialog = () => fileInputRef.current.click();

  const openFolderDialog = async () => {
    if ("showDirectoryPicker" in window) {
      try {
        const handle = await window.showDirectoryPicker();
        setDirectoryHandle(handle);
        setDestPath(handle.name);
        setValue("destPath", handle.name, { shouldValidate: true });
      } catch (err) {
        console.error("Error al seleccionar directorio:", err);
        // Fallback al método tradicional
        folderInputRef.current.click();
      }
    } else {
      // Navegador no compatible, usar método tradicional
      folderInputRef.current.click();
      alert(
        "Tu navegador no soporta selección directa de carpeta. Selecciona cualquier archivo dentro de la carpeta destino."
      );
    }
  };

  // Manejo de selección de archivo
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    const name = file.name;
    setSourcePath(name);
    setValue("sourcePath", name, { shouldValidate: true });

    // Detectar extensión
    const ext = name.split(".").pop().toLowerCase();
    setFileType(ext);

    // Leer contenido
    const reader = new FileReader();
    reader.onload = (ev) => {
      let text = ev.target.result;
      if (ext === "json") {
        try {
          const obj = JSON.parse(text);
          text = JSON.stringify(obj, null, 2);
        } catch {
          // Manejar error de parseo JSON si es necesario
        }
      }
      setPreviewContent(text);
    };
    reader.readAsText(file);
  };

  // Manejo de selección de carpeta (método tradicional)
  const onFolderChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) {
      const root = files[0].webkitRelativePath.split("/")[0];
      setDestPath(root);
      setValue("destPath", root, { shouldValidate: true });
    }
  };

  const saveResultFile = async (base64Content, fileName) => {
    try {
      // Convertir base64 a blob
      const byteCharacters = atob(base64Content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "text/plain" });

      if (directoryHandle) {
        // Usar File System Access API
        const fileHandle = await directoryHandle.getFileHandle(fileName, {
          create: true,
        });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        return true;
      } else if (destPath) {
        // Método tradicional (descarga)
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error al guardar archivo:", error);
      return false;
    }
  };

  const onError = (formErrors) => {
    validateDelimiter();

    alert("Hay errores en el formulario. Revisa los campos.");
  };

  const validateDelimiter = () => {
    const source = watch("sourcePath") || "";
    const format = watch("outputFormat") || "";
    const delimiter = watch("delimiter") || "";

    const isSourceJsonOrXml =
      source.endsWith(".json") || source.endsWith(".xml");
    const isOutputJsonOrXml = format === "json" || format === "xml";
    const isJsonToJsonOrXml = isSourceJsonOrXml && isOutputJsonOrXml;

    const shouldRequireDelimiter = !isJsonToJsonOrXml || !source || !format;

    if (shouldRequireDelimiter && delimiter.trim() === "") {
      console.log("SETTING elimiter value")

      setError("delimiter", {
        type: "manual",
        message: "El delimitador no puede estar vacío",
      });
    } else {
      console.log("No delimiter value")
      clearErrors("delimiter");
    }
  }

  // Envío del formulario
  const onSubmit = async (data) => {
    try {
      setIsProcessing(true);
      setResultContent(""); // Limpiar resultado anterior

      if (!selectedFile) {
        alert("Debe seleccionar un archivo antes de procesar.");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("key", data.key);
      formData.append("documentType", data.outputFormat);
      // formData.append("delimiter", data.delimiter);

      formData.append("pathFile", destPath);

      if (!isDelimiterDisabled) {
        formData.append("delimiter", data.delimiter);
      }

      const response = await axios.post(
        import.meta.env.VITE_API_URL,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Generar nombre del archivo de salida
      const outputFileName = selectedFile.name.replace(
        /\.[^/.]+$/,
        `_converted.${data.outputFormat || "txt"}`
      );

      // Guardar/descargar el archivo resultante
      const saveSuccess = await saveResultFile(
        response.data.data,
        outputFileName
      );

      if (saveSuccess) {
        alert("Archivo procesado y guardado correctamente");
        const decodedText = atob(response.data.data); // decodifica base64 a string plano
        setResultContent(decodedText);
      } else {
        alert(
          "Archivo procesado pero no se pudo guardar en la ubicación seleccionada"
        );
      }

      console.log("Respuesta del servidor:", response.data);
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      if (error.response) {
        const { status, data } = error.response;
        const message = data.message || "Error en la respuesta del servidor.";
        const errors = Array.isArray(data.errors) ? data.errors.join("\n") : "";

        alert(`Error del servidor (status ${status}): ${message}\n${errors}`);
      } else {
        alert("Error inesperado al procesar el archivo.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const isDelimiterDisabled =
    (fileType === "json" || fileType === "xml") &&
    (watch("outputFormat") === "json" || watch("outputFormat") === "xml");

  return (
    <div className="bg-secondary_color_variant flex min-h-screen flex-1 items-center flex-col py-12 sm:px-6 lg:px-8">
      <div className="max-w-[1100px] w-full mx-auto p-8 rounded-lg">
        <h2 className="text-5xl mb-20">
          Clima
          <span className="text-6xl text-accent_color font-bold ">Cock</span>
        </h2>

        <div>
          {/* Inputs ocultos para archivo y carpeta */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={onFileChange}
            accept=".txt,.csv,.json,.xml"
          />
          <input
            type="file"
            ref={folderInputRef}
            style={{ display: "none" }}
            webkitdirectory="true"
            directory="true"
            onChange={onFolderChange}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <Grid container spacing={3}>
            {/* Selección de archivo */}
            <Grid item size={4}>
              <FormLabel
                sx={{ color: "#202124", fontWeight: 800, lineHeight: "45px" }}
                className="!text-xl"
              >
                Selecciona un archivo
              </FormLabel>
            </Grid>
            <Grid item size={2}>
              <CustomButton
                action={openFileDialog}
                className="!p-2"
                as="button"
                type="button"
                disabled={isProcessing}
              >
                Buscar
              </CustomButton>
            </Grid>
            <Grid item size={6}>
              <p>{sourcePath}</p>
              {errors.sourcePath && (
                <p style={{ color: "red", marginTop: "4px" }}>
                  {errors.sourcePath.message}
                </p>
              )}
            </Grid>

            {/* Selección de carpeta destino */}
            <Grid item size={4}>
              <FormLabel
                sx={{ color: "#202124", fontWeight: 800, lineHeight: "45px" }}
                className="!text-xl"
              >
                Selecciona carpeta de destino
              </FormLabel>
            </Grid>
            <Grid item size={2}>
              <CustomButton
                action={openFolderDialog}
                className="!p-2"
                as="button"
                type="button"
                disabled={isProcessing}
              >
                Buscar
              </CustomButton>
            </Grid>
            <Grid item size={6}>
              <p>{destPath}</p>
              {errors.destPath && (
                <p style={{ color: "red", marginTop: "4px" }}>
                  {errors.destPath.message}
                </p>
              )}
            </Grid>

            {/* Tipo de archivo de salida */}
            <Grid item size={4}>
              <FormLabel
                sx={{ color: "#202124", fontWeight: 800, lineHeight: "45px" }}
                className="!text-xl"
              >
                Tipo de archivo de salida:
              </FormLabel>
            </Grid>
            <Grid item size={8}>
              <div>
                <Controller
                  name="outputFormat"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <CustomSelect
                      {...field}
                      options={[
                        { value: "csv", label: ".csv" },
                        { value: "txt", label: ".txt" },
                        { value: "xml", label: ".xml" },
                        { value: "json", label: ".json" },
                      ]}
                      errors={errors.outputFormat}
                      disabled={isProcessing}
                    />
                  )}
                />
              </div>
            </Grid>

            {/* Delimitador */}
            <Grid item size={4}>
              <FormLabel
                sx={{
                  color: isDelimiterDisabled ? "#20212470" : "#202124",
                  fontWeight: 800,
                  lineHeight: "45px",
                }}
                className="!text-xl"
              >
                {isEncrypted
                  ? "Delimitador del archivo de entrada:"
                  : "Delimitador del archivo de salida:"}
              </FormLabel>
            </Grid>
            <Grid item size={8}>
              <CustomInput
                innerRef={register("delimiter")}
                placeholder="Ingresa el delimitador del archivo"
                name="delimiter"
                errors={errors.delimiter}
                disabled={isProcessing || isDelimiterDisabled}
              />
            </Grid>

            <p>{isDelimiterDisabled.toString()}</p>
            {/* <p>a{watch("delimiter") && "El delimitador no puede estar vacío"}a</p> */}

            {/* Llave de cifrado/descifrado */}
            <Grid item size={4}>
              <FormLabel
                sx={{ color: "#202124", fontWeight: 800, lineHeight: "45px" }}
                className="!text-xl"
              >
                {isEncrypted ? "Llave para cifrar:" : "Llave para descifrar:"}
              </FormLabel>
            </Grid>
            <Grid item size={8}>
              <CustomInput
                innerRef={register("key")}
                placeholder="Ingresa la llave"
                name="key"
                errors={errors.key}
                disabled={isProcessing}
              />
            </Grid>
          </Grid>

          {/* Botón de procesar */}
          <CustomButton
            type="submit"
            className="my-10 max-w-[35rem] mx-auto !rounded-full"
            disabled={isProcessing}
            action={() => {validateDelimiter()}}
          >
            {isProcessing ? "Procesando..." : "Procesar"}
          </CustomButton>
        </form>

        {/* Áreas de visualización */}
        <Grid container spacing={3}>
          <Grid item size={6}>
            <CustomInput
              name="Preview"
              labelText="Preview"
              multiline
              rows={20}
              readOnly={true}
              placeholder="Contenido original aparecerá aquí"
              errors={false}
              value={previewContent}
            />
          </Grid>
          <Grid item size={6}>
            <CustomInput
              name="Result"
              labelText="Resultado"
              multiline
              rows={20}
              readOnly={true}
              placeholder="Resultado de la conversión aparecerá aquí"
              errors={false}
              value={resultContent}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Home;
