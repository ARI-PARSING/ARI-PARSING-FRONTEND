import React from "react";
import { render, screen } from "@testing-library/react";
import { PresenceAnimation } from "../FadeIn";
import { AnimatePresence } from "framer-motion";

/* global describe, it, expect */

describe("PresenceAnimation", () => {

    it("renderiza el componente como un div por defecto", () => {
        render(
        <AnimatePresence>
            <PresenceAnimation>Contenido de prueba</PresenceAnimation>
        </AnimatePresence>
        );
        expect(screen.getByText("Contenido de prueba").tagName).toBe("DIV");
    });

    it("renderiza el componente como un párrafo cuando se usa as='p'", () => {
        render(
        <AnimatePresence>
            <PresenceAnimation as="p">Texto de párrafo</PresenceAnimation>
        </AnimatePresence>
        );
        expect(screen.getByText("Texto de párrafo").tagName).toBe("P");
    });

    it("renderiza correctamente los children", () => {
        render(
        <AnimatePresence>
            <PresenceAnimation>
            <span>Elemento hijo</span>
            </PresenceAnimation>
        </AnimatePresence>
        );
        expect(screen.getByText("Elemento hijo")).toBeInTheDocument();
    });

    it("aplica props personalizados al componente", () => {
        render(
        <AnimatePresence>
            <PresenceAnimation data-testid="animado" className="test-class">
            Con clase
            </PresenceAnimation>
        </AnimatePresence>
        );
        const el = screen.getByTestId("animado");
        expect(el).toHaveClass("test-class");
    });

});
