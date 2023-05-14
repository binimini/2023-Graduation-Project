import React, { useEffect } from "react";
import { Route, useNavigate } from "react-router-dom";

const PrivateRouter = () => {
//   useEffect(() => {
    const workspaceId = localStorage.getItem("workspace-id");

    const navigate = useNavigate();
    if (workspaceId) navigate(`/workspace/${workspaceId}`);
    else navigate("/home");
//   }, []);

  return <React.Fragment />;
};

export default PrivateRouter;
