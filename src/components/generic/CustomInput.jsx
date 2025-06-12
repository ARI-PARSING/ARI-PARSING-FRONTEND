import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  TextField,
  InputAdornment,
  FormControl,
  FormLabel,
} from "@mui/material";
import { AnimatePresence } from "framer-motion";
import { PresenceAnimation } from "./FadeIn";

/**
 * Este es el input generico del sistema, el cual se le puede enviar:
 * errors: un objeto con la propiedad message para mostrar un mensaje de error
 * icon: un icono para mostrar en el input
 * innerRef: una referencia para el input usado en react-hook-form
 * readOnly: si es solo vista (readonly)
 * multiline: si es textarea multilinea
 * rows: número de filas para multiline
 * backgroundColor: color de fondo del input
 */
const CustomInput = ({
  innerRef,
  name,
  type = "text",
  placeholder,
  ariaLabel,
  labelText,
  errors,
  icon,
  iconPosition = "left",
  readOnly = false,
  multiline = false,
  rows = 1,
  backgroundColor = "#ffffff",
  disabled = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = !!errors?.message;

  return (
    <FormControl fullWidth>
      {labelText && (
        <FormLabel
          htmlFor={name}
          sx={{
            color: "#202124",
            fontWeight: "800",
            lineHeight: "45px",
            mb: 1.,
          }}
          className="!text-xl"
        >
          {labelText}
        </FormLabel>
      )}

      <TextField
        fullWidth
        {...innerRef}
        name={name}
        type={type}
        placeholder={placeholder}
        aria-label={ariaLabel}
        variant="outlined"
        multiline={multiline}
        rows={rows}
        disabled={disabled}
        InputProps={{
          readOnly,
          startAdornment:
            icon && iconPosition === "left" ? (
              <InputAdornment
                position="start"
                color={hasError ? "error" : "primary"}
              >
                {React.cloneElement(icon, {
                  style: {
                    color: hasError
                      ? "#FF6B6B"
                      : isFocused
                      ? "#284485"
                      : "#202124",
                  },
                })}
              </InputAdornment>
            ) : null,
          endAdornment:
            icon && iconPosition === "right" ? (
              <InputAdornment
                position="end"
                color={hasError ? "error" : "primary"}
              >
                {React.cloneElement(icon, {
                  style: {
                    color: hasError
                      ? "#FF6B6B"
                      : isFocused
                      ? "#284485"
                      : "#202124",
                    cursor: "pointer",
                  },
                })}
              </InputAdornment>
            ) : null,
        }}
        sx={{
          opacity: disabled ? 0.3 : 1,
          "& .MuiOutlinedInput-root": {
            backgroundColor: backgroundColor,
            borderRadius: "0.3rem",
            borderColor: hasError
              ? "#FF6B6B"
              : isFocused
              ? "#284485"
              : "#202124",
            boxShadow: hasError
              ? "5px 5px 0px 0px #FF6B6B"
              : isFocused
              ? "6px 6px 0px 0px #284485"
              : "5px 5px 0px 0px #000",
            transition: "box-shadow 0.3s ease, border-color 0.3s ease",
            "&:hover": {
              borderColor: hasError ? "#FF6B6B" : "#000",
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderRadius: "0.3rem",
            borderWidth: "2px",
            borderColor: hasError
              ? "#FF6B6B !important"
              : isFocused
              ? "#284485 !important"
              : "#202124 !important",
          },
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />

      <div aria-live="polite" aria-atomic="true">
        <AnimatePresence>
          {errors?.message && (
            <PresenceAnimation
              as="p"
              id={`${name}-error`}
              role="alert"
              className="mx-5 mt-2 text-red-500 text-sm"
            >
              {errors.message}
            </PresenceAnimation>
          )}
        </AnimatePresence>
      </div>
    </FormControl>
  );
};

CustomInput.propTypes = {
  innerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  errors: PropTypes.shape({
    message: PropTypes.string,
  }),
  icon: PropTypes.element,
  iconPosition: PropTypes.oneOf(["left", "right"]),
  labelText: PropTypes.string,
  readOnly: PropTypes.bool,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  backgroundColor: PropTypes.string,
};

export default CustomInput;
