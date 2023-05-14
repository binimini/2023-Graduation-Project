import { userInfoState } from "@/store/userInfoState";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import Stomp, { Client } from "webstomp-client";

const webSocketUrl = "ws://163.180.146.59/api/ws-connection";

const WebSocketContext = React.createContext<any>(
  Stomp.over(new WebSocket(webSocketUrl), { debug: false })
);
export { WebSocketContext };

export default ({ children }: { children: React.ReactNode }) => {
  const userInfo = useRecoilValue(userInfoState);
  const stompClient = useContext(WebSocketContext);

  const disconnectStomp = () => {};

  const connectStomp = () => {
    stompClient.connect(
      {},
      () => {
        // connect 완료
      },
      () => {
        console.error("Can't Connect Stomp");
      }
    );
  };

  const sendRoomInfo = () => {
    console.log(stompClient);

    stompClient.connect(
      {},
      () => {
        stompClient.send(
          `/video/joined-room-info/${userInfo.workspaceId}`,
          JSON.stringify({
            sessionId: userInfo.userId,
            userId: userInfo.userId,
          })
        );
        console.log("connect");
      },
      () => {
        console.error("Can't Connect Stomp");
      }
    );
  };

  useEffect(() => {
    if (stompClient.connected === false) {
      connectStomp();
    }
  }, []);

  return (
    <WebSocketContext.Provider value={stompClient}>
      {children}
    </WebSocketContext.Provider>
  );
};
