import React, { MouseEventHandler } from "react";
import tw from "tailwind-styled-components";

interface ButtonProps {
  type?: string;
  name?: string;
  size?: string;
  className?: string;
  width?: string;
  height?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const IconButton = ({
  type = "solid", // solid, regular, light, thin, duotone
  name = "",
  size = "", // 2x, xs, sm, lg, xl, 2xl
  className = "",
  width = "100%",
  height = "100%",
  disabled = false,
  onClick = () => {},
}: ButtonProps) => {
  return (
    <button
      style={{
        width: width,
        height: height,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={onClick}
      disabled={disabled}
    >
      <i className={`fa-${type} fa-${name} fa-${size} ${className || ""}`} />
    </button>
  );
};
