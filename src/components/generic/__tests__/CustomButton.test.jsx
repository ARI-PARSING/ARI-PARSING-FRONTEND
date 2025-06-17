import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomButton from '../CustomButton';

/* global describe, it, expect, jest */

describe('CustomButton', () => {

    it('renderiza el botón con el texto proporcionado', () => {
        render(<CustomButton>Click aquí</CustomButton>);
        expect(screen.getByRole('button')).toHaveTextContent('Click aquí');
    });

    it('ejecuta la acción al hacer clic', () => {
        const handleClick = jest.fn();
        render(<CustomButton action={handleClick}>Click</CustomButton>);
        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('no ejecuta acción si loading está activo', () => {
        const handleClick = jest.fn();
        render(
        <CustomButton loading action={handleClick}>
            No activo
        </CustomButton>
        );
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        fireEvent.click(button);
        expect(handleClick).not.toHaveBeenCalled();
    });

    it('muestra spinner y texto "Cargando" cuando loading es true', () => {
        render(<CustomButton loading>Cargar</CustomButton>);
        expect(screen.getByText('Cargando')).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('puede renderizar como enlace si se especifica `as="a"`', () => {
        render(
        <CustomButton as="a" to="/ruta-prueba">
            Ir
        </CustomButton>
        );
        const link = screen.getByText('Ir');
        expect(link.tagName).toBe('A');
    });
    
});
