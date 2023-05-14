import Stomp, { Client } from "webstomp-client";
import axios from "axios";
import { useEffect, useState } from "react";

const SignalingConnect = () => {
  const [stompClient, setStompClient] = useState<Client | undefined>(null);
  // 현재 유저 입장 시 해당 유저에 대한 userId, roomId 생성하는 코드가 없어서 임시로 작성
  const [userId, setUserId] = useState<string | undefined>(null);
  const [roomId, setRoomId] = useState<string | undefined>(null);

  const getDummy = () => {
    axios
      .get("http://163.180.146.59/api/dummy")
      .then((res) => {
        const { data } = res;
        setUserId(data.users[0].id);
        setRoomId(data.rooms[0].id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (userId === null && roomId === null) {
      getDummy();
    }

    if (stompClient === null) {
      setStompClient(
        // TODO: 추후 sockJS로 생성하기
        Stomp.over(new WebSocket("ws://163.180.146.59/api/ws-connection"), {
          debug: true,
        })
      );
    } else if (stompClient !== null && userId !== null && roomId !== null) {
      stompClient?.connect(
        {},
        () => {
          // 해당 endpoint 구독
          stompClient.subscribe("/sub/video/joined-room-info", (data) => {
            console.log(JSON.parse(data.body));
          });

          // 해당 endpoint 구독
          stompClient.subscribe("/sub/video/unjoined-room-info", (data) => {
            console.log(JSON.parse(data.body));
          });

          // connect되면 해당 endpoint로 메세지 전달 (입장 정보 전달)
          stompClient.send(
            "/pub/video/joined-room-info",
            JSON.stringify({
              roomId: roomId,
              userId: userId,
              sessionId: userId,
            })
          );
        },
        () => {
          console.log("error has occurred while trying to connect stompClient");
        }
      );
    }
  }, [stompClient, userId, roomId]);

  return <></>;
};

export default SignalingConnect;
