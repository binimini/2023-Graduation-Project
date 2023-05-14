import React from "react";
import ReactDOM from "react-dom";

const TimerPortal = ({
  children,
  isShowing = true,
}: {
  children: React.ReactNode;
  isShowing: Boolean;
}) => {
  const portalElement = document.getElementById("modal-root");

  return (
    <>{isShowing && ReactDOM.createPortal(<>{children}</>, portalElement)}</>
  );
};

export default TimerPortal;
