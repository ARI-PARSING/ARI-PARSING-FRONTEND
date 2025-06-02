import { Button, FormLabel, Grid } from "@mui/material";
import React, { useRef, useState } from "react";
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
    formState: { errors },
  } = useForm({
    resolver: zodResolver(fileSchema),
  });

  // Subir archivo:
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const [sourcePath, setSourcePath] = useState("");
  const [destPath, setDestPath] = useState("");
  const [fileType, setFileType] = useState("");
  const [previewContent, setPreviewContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const isEncrypted = fileType === "txt" || fileType === "csv";

  const openFileDialog = () => fileInputRef.current.click();
  const openFolderDialog = () => folderInputRef.current.click();

  // al seleccionar archivo
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
          // ..
        }
      }
      setPreviewContent(text);
    };
    reader.readAsText(file);
  };

  // al seleccionar carpeta
  const onFolderChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) {
      const root = files[0].webkitRelativePath.split("/")[0];
      setDestPath(root);
      setValue("destPath", root, { shouldValidate: true });
    }
  };

  // Enviar datossss
  const onSubmit = async (data) => {
    try {
      if (!selectedFile) {
        alert("Debe seleccionar un archivo antes de procesar.");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("key", data.key);
      formData.append("delimiter", data.delimiter);
      formData.append("documentType", data.outputFormat);
      // formData.append("pathFile", data.destPath);
      formData.append("pathFile", "nombre.ext");

      const response = await axios.post(
        "http://localhost:5000/upload/send",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Respuesta del servidor:", response.data);
      alert(
        "Archivo subido correctamente.\nRuta en servidor: " + response.data.path
      );
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      if (error.response) {
        alert(
          `Error del servidor (status ${error.response.status}): ${
            error.response.data.message || JSON.stringify(error.response.data)
          }`
        );
      } else {
        // red, Axios, Cors, etc.
        alert(
          "Error inesperado al subir el archivo. Revise la consola para más detalles."
        );
      }
    }
  };


   const [folderName, setFolderName] = useState(null);
  const [items, setItems] = useState([]);

  const handleSelectFolder = async () => {
    try {
      // Lanza el selector de carpetas
      const dirHandle = await window.showDirectoryPicker();
      setFolderName(dirHandle.name);

      const entries = [];
      for await (const entry of dirHandle.values()) {
        entries.push({ name: entry.name, type: entry.kind }); // "file" o "directory"
      }
      setItems(entries);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error al seleccionar la carpeta:", err);
      }
    }
  };


  return (
    <div className="bg-secondary_color_variant flex min-h-screen flex-1 items-center flex-col py-12 sm:px-6 lg:px-8">
      <div className="max-w-[1100px] w-full mx-auto p-8 rounded-lg">
        <h2 className="text-5xl mb-20">
          Clima
          <span className="text-6xl text-accent_color font-bold ">Cock</span>
        </h2>

         <button onClick={handleSelectFolder} style={{ padding: "0.5rem 1rem" }}>
        Seleccionar Carpeta
      </button>

        {/* <input directory="" webkitdirectory="" type="folder" /> */}


        {/* aaaaaaaaaaaaa
         <input
      type="file"
      webkitdirectory="true"
      directory=""
      multiple
      onChange={(e) => {
        const files = Array.from(e.target.files);
        // onFilesSelected(files);
      }}
    />
    aaaaaaaaaaaa */}





        <div>
          {/* Hidden inputs */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={onFileChange}
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* FILE */}
            <Grid item size={4}>
              <FormLabel
                htmlFor={name}
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
              >
                {/* <FileOpenIcon className="mr-2" /> */}
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

            {/* FILE */}
            <Grid item size={4}>
              <FormLabel
                htmlFor={name}
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

            {/* OUTPUT TYPE */}
            <Grid item size={4}>
              <FormLabel
                htmlFor={name}
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
                    />
                  )}
                />
              </div>
            </Grid>

            {/* DELIMITADOR */}
            <Grid item size={4}>
              <FormLabel
                sx={{ color: "#202124", fontWeight: 800, lineHeight: "45px" }}
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
              />
            </Grid>

            {/* KEY */}
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
                placeholder="Ingresa el delimitador del archivo"
                name="key"
                errors={errors.key}
              />
            </Grid>
          </Grid>
          <CustomButton
            type="submit"
            className="my-10 max-w-[35rem] mx-auto !rounded-full"
          >
            Procesar
          </CustomButton>
        </form>

        {/* VISUALIZADORES */}
        <Grid container spacing={3}>
          <Grid item size={6}>
            <CustomInput
              name="Preview"
              labelText="Preview"
              multiline
              rows={20}
              readOnly={true}
              placeholder=""
              errors={false}
              value={previewContent}
            />
          </Grid>
          <Grid item size={6}>
            <CustomInput
              name="Result"
              labelText="Result"
              multiline
              rows={20}
              readOnly={true}
              placeholder=""
              errors={false}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
export default Home;
