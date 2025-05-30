import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  TextField,
  MenuItem,
  InputAdornment,
  FormControl,
  FormLabel,
} from "@mui/material";
import { AnimatePresence } from "framer-motion";
import { PresenceAnimation } from "./FadeIn";

/**
 * CustomSelect genérico con soporte para:
 * - options: array de { value, label } para las opciones
 * - icon: icono a la izquierda o derecha
 * - readOnly: deshabilitar selección
 * - manejo de errores vía errors.message
 * - backgroundColor: color de fondo del input
 */
const CustomSelect = ({
  innerRef,
  name,
  labelText,
  ariaLabel,
  options = [],
  value,
  onChange,
  errors,
  icon,
  iconPosition = "left",
  readOnly = false,
  backgroundColor = "#ffffff",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = !!errors?.message;

  return (
    <FormControl fullWidth>
      {labelText && (
        <FormLabel
          htmlFor={name}
          sx={{ color: "#202124", fontWeight: 800, lineHeight: "45px" }}
          className="!text-xl"
        >
          {labelText}
        </FormLabel>
      )}

      <TextField
        select
        fullWidth
        {...innerRef}
        name={name}
        aria-label={ariaLabel}
        variant="outlined"
        label={labelText}
        value={value}
        onChange={onChange}
        disabled={readOnly}
        SelectProps={{
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
        error={hasError}
        {...props}
      >
        {options.map(opt => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>

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

CustomSelect.propTypes = {
  innerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  name: PropTypes.string.isRequired,
  labelText: PropTypes.string,
  ariaLabel: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({ value: PropTypes.any, label: PropTypes.node })
  ),
  value: PropTypes.any,
  onChange: PropTypes.func,
  errors: PropTypes.shape({ message: PropTypes.string }),
  icon: PropTypes.element,
  iconPosition: PropTypes.oneOf(["left", "right"]),
  readOnly: PropTypes.bool,
  backgroundColor: PropTypes.string,
};

export default CustomSelect;
