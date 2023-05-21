import React, {useContext} from "react";
import {io} from "socket.io-client";

const SocketIOContext = React.createContext<any>(
    io("ws://localhost:8000", {
        withCredentials: true,
        extraHeaders: { "my-custom-header": "abcd"}
    })
)

export {SocketIOContext};

export default ({ children }: { children: React.ReactNode }) => {
    const socketIOClient = useContext(SocketIOContext);


    return (
        <SocketIOContext.Provider value={socketIOClient}>
            {children}
        </SocketIOContext.Provider>
    );
};

