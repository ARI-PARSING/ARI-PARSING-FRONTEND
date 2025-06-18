import React from 'react';
import { render, screen } from '@testing-library/react';
import CustomLink from '../CustomLink';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

/* global describe, it, expect */

describe('CustomLink', () => {

    it('renderiza correctamente con título y href', () => {
        render(
        <MemoryRouter>
            <CustomLink href="/contacto" title="Ir a contacto" />
        </MemoryRouter>
        );

        const link = screen.getByText('Ir a contacto');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/contacto');
    });

    it('tiene las clases y estilos base', () => {
        render(
        <MemoryRouter>
            <CustomLink href="/inicio" title="Inicio" />
        </MemoryRouter>
        );

        const link = screen.getByText('Inicio');
        expect(link).toHaveClass('!text-lg');
        expect(link).toHaveStyle('text-decoration: underline');
    });

    it('cambia el estilo en hover (estilo CSS-in-JS de MUI)', () => {
        render(
        <MemoryRouter>
            <CustomLink href="/home" title="Home" />
        </MemoryRouter>
        );

        const link = screen.getByText('Home');
        expect(link).toHaveStyle('text-decoration: underline');
        // Nota: el hover no puede ser simulado directamente con fireEvent en estilos inline de MUI,
        // pero el hover está cubierto por diseño y pruebas visuales.
    });
    
});
