import { Link } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import { Link as ReactRouterLink } from "react-router-dom";

const CustomLink = ({ href, title }) => {
  return (
    <Link
      to={href}
      sx={{
        color: "#202124",
        textDecoration: "underline",
        "&:hover": {
          textDecoration: "none",
        },
      }}
      className="!text-lg"
      component={ReactRouterLink}
    >
      {title}
    </Link>
  );
};

CustomLink.propTypes = {
  href: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default CustomLink;