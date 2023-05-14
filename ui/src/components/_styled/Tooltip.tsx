import React, { ReactChild } from "react";

interface Proptype {
  tip?: string;
  direction?: string;
  children: React.ReactNode;
}

const Tooltip = ({ children, tip, direction = "bottom" }: Proptype) => {
  return (
    <div className={`tooltip tooltip-${direction}`} data-tip={tip}>
      {children}
    </div>
  );
};

export default Tooltip;
