import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CustomSelect from "../CustomSelect";

/* global describe, it, expect, jest */

describe("CustomSelect", () => {
    
    const mockOptions = [
        { value: "pdf", label: "PDF" },
        { value: "docx", label: "DOCX" },
    ];

    const setup = (props = {}) => {
        const defaultProps = {
        name: "fileType",
        labelText: "Tipo de archivo",
        value: "",
        onChange: jest.fn(),
        onBlur: jest.fn(),
        options: mockOptions,
        errors: {},
        ...props,
        };
        render(<CustomSelect {...defaultProps} />);
        return defaultProps;
    };

    it("debe renderizarse con el label", () => {
        setup();
        expect(screen.getByLabelText("Tipo de archivo")).toBeInTheDocument();
    });

    it("debe mostrar las opciones al hacer clic", () => {
        setup();
        fireEvent.mouseDown(screen.getByRole("combobox"));
        expect(screen.getByText("PDF")).toBeInTheDocument();
        expect(screen.getByText("DOCX")).toBeInTheDocument();
    });

    it("debe llamar a onChange cuando se selecciona una opción", () => {
        const { onChange } = setup();
        fireEvent.mouseDown(screen.getByRole("combobox"));
        fireEvent.click(screen.getByText("DOCX"));
        expect(onChange).toHaveBeenCalled();
    });

    it("debe mostrar la opción por defecto si no se selecciona ninguna", () => {
        setup();
        expect(
        screen.getByText("Seleccione tipo de archivo de salida")
        ).toBeInTheDocument();
    });
});
