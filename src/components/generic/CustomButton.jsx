import clsx from "clsx";
import React from "react";
import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";

const CustomButton = ({
  as: Component = "button",
  action = () => {},
  to = "",
  className = "",
  children,
  loading = false,
  props,
}) => {
  const CustomButtonProps =
    Component === "button" ? { onClick: action, disabled: loading } : { to };

  return (
    <Component
      className={clsx(
        "w-full cursor-pointer flex flex-shrink-0 text-xl justify-center items-center py-3.5 px-3 rounded-lg text-white text-center font-extrabold transition-all md:text-lg",
        {
          "bg-gray-400 cursor-not-allowed": loading,
          "bg-[#202124] hover:bg-accent_color": !loading,
        },
        className
      )}
      {...CustomButtonProps}
      {...props}
    >
      {loading ? (
        <>
          <CircularProgress size={24} className="text-white mr-2" color="#fff" />
          Cargando
        </>
      ) : (
        children
      )}
    </Component>
  );
};

CustomButton.propTypes = {
  as: PropTypes.elementType,
  action: PropTypes.func,
  to: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  loading: PropTypes.bool,
  props: PropTypes.object,
};

export default CustomButton;