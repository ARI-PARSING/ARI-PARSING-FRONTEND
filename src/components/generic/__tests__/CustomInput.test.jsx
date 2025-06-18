import React from 'react';
import { render, screen } from '@testing-library/react';
import CustomInput from '../CustomInput';
import '@testing-library/jest-dom';

/* global describe, it, expect */

describe('CustomInput', () => {

    it('renderiza correctamente con nombre y placeholder', () => {
        render(<CustomInput name="test" placeholder="Buscar..." />);
        expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument();
    });

    it('muestra la etiqueta si se proporciona labelText', () => {
        render(<CustomInput name="email" labelText="Correo Electrónico" />);
        expect(screen.getByText('Correo Electrónico')).toBeInTheDocument();
    });

    it('renderiza el input como multiline si se especifica', () => {
        render(<CustomInput name="comentarios" multiline rows={4} />);
        expect(screen.getByRole('textbox')).toHaveAttribute('rows', '4');
    });

    it('aplica la propiedad disabled correctamente', () => {
        render(<CustomInput name="disabled" disabled />);
        expect(screen.getByRole('textbox')).toBeDisabled();
    });
    
});
