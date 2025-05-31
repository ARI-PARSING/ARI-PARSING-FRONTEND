import { Button, FormLabel, Grid } from "@mui/material";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import CustomInput from "../components/generic/CustomInput";
import CustomSelect from "../components/generic/CustomSelect";
import CustomButton from "../components/generic/CustomButton";
import { Controller, useForm } from "react-hook-form";
import { fileSchema } from "../validations/FileSchema";
import { zodResolver } from "@hookform/resolvers/zod";

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

  // Tipo de archivo
  const [selected, setSelected] = useState("");

  // Subir archivo:
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const [sourcePath, setSourcePath] = useState("");
  const [destPath, setDestPath] = useState("");
  const [fileType, setFileType] = useState("");
  const [previewContent, setPreviewContent] = useState("");

  const openFileDialog = () => fileInputRef.current.click();
  const openFolderDialog = () => folderInputRef.current.click();

  // al seleccionar archivo
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
  const onSubmit = (data) => {
    console.log("Datos validados:", data);
  };

  return (
    <div className="bg-secondary_color_variant flex min-h-screen flex-1 items-center flex-col py-12 sm:px-6 lg:px-8">
      <div className="max-w-[1100px] w-full mx-auto p-8 rounded-lg">
        <h2 className="text-5xl mb-20">
          Clima
          <span className="text-6xl text-accent_color font-bold ">Cock</span>
        </h2>

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
          <Grid
            container
            spacing={3}
            
          >
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
              >
                {/* <FileOpenIcon className="mr-2" /> */}
                Buscar
              </CustomButton>
            </Grid>
            <Grid item size={6}>
              <p>{sourcePath}</p>
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
              >
                Buscar
              </CustomButton>
            </Grid>
            <Grid item size={6}>
              <p>{destPath}</p>
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
                Delimitador
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
                Llave para "cifrar/descifrar":
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
          <CustomButton type="submit" className="my-10 max-w-[35rem] mx-auto !rounded-full">Procesar</CustomButton>
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
