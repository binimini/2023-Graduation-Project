import { useContext, useEffect, useRef, useState } from "react";
import LocalCam from "@/components/Cam/LocalCam";
import RemoteCam from "@/components/Cam/RemoteCam";
import { userInfoState } from "@/store/userInfoState";
import { useRecoilState } from "recoil";
import { WebSocketContext } from "@/context/WebSocketContext";

const CamList = () => {
  const [localStream, setLocalStream] = useState<MediaStream | undefined>(null);
  const setLocalStreamHandler = (stream) => {
    setLocalStream(stream);
  };

  // stomp
  const stompClient = useContext(WebSocketContext);

  // userInfo
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);

  // socket message send 함수
  const sendMsg = (endpoint: string, data: object) => {
    const payload = { ...data };
    stompClient?.send(
      `${endpoint}/${userInfo.workspaceId}`,
      JSON.stringify(payload)
    );
  };

  // webRTC
  const pcRef = useRef<Object | undefined>(new Object());
  const [pcs, setPcs] = useState<Object | undefined>(new Object());
  const setPcsHandler = (memId, pc) => {
    setPcs((prev: object) => {
      return { ...prev, [memId]: pc };
    });
  };
  const delPcsHandler = (memId) => {
    setPcs((prev: object) => {
      delete prev[memId];
      return { ...prev };
    });
  };

  // test용
  const [state, setState] = useState(0);
  const handler = () => {
    setState((prev) => {
      return !prev;
    });
    console.log(pcRef);
  };

  // remoteCam Component Ref
  const remoteCamRef = useRef();

  // user exit (브라우저 창 새로고침)
  const exit = () => {
    window.onbeforeunload = (event) => {
      event.preventDefault();
      event.returnValue = "";
      sendMsg("/pub/video/unjoined-room-info", {
        userId: userInfo.userId,
        sessionId: userInfo.userId,
      });
    };
  };

  // 본인이 입장했을 때 (workspace에 이미 다른 멤버들 존재할 때)
  const enterHandler = (users, pc) => {
    console.log("기존 멤버 리스트: " + users);
    for (let mem of users) {
      pc = remoteCamRef.current.makePeerConnection();
      pcRef.current[mem.id] = pc;
      setPcsHandler(mem.id, pc);
      pc = remoteCamRef.current.setPeerConnection(pc, userInfo.userId, mem.id);
    }
  };

  // 다른 멤버가 입장했을 때
  const memEnterHandler = async (newUserId, pc) => {
    console.log(newUserId + " 멤버가 방에 입장했습니다!");
    pc = remoteCamRef.current.makePeerConnection();
    pcRef.current[newUserId] = pc;
    setPcsHandler(newUserId, pc);
    pc = remoteCamRef.current.setPeerConnection(pc, userInfo.userId, newUserId);
    const offer = await pc.createOffer();
    pc.setLocalDescription(offer);
    sendMsg("/pub/video/caller-info", {
      from: userInfo.userId,
      to: newUserId,
      signal: offer,
      type: "offer",
    });
    console.log(newUserId + " 에게 offer 생성 후 보냄");
  };

  // offer 받았을 때
  const getOfferHandler = async (caller, offer, pc) => {
    console.log(caller + " 에게 offer 받음, offer : " + offer);
    pc = pcRef.current[caller];
    pc.setRemoteDescription(offer);
    console.log("remoteDescription 설정");
    const answer = await pc.createAnswer();
    pc.setLocalDescription(answer);
    console.log("locatDescription 설정");
    sendMsg("/pub/video/callee-info", {
      from: userInfo.userId,
      to: caller,
      signal: answer,
    });
    console.log(caller + " answer 생성 후 송신");
  };

  // ice 받았을 때
  const getIceHandler = (caller, ice, pc) => {
    console.log("ice 수신");
    pc = pcRef.current[caller];
    pc.addIceCandidate(ice);
    console.log("ice candidate 추가");
  };

  // answer 받았을 때
  const getAnswerHandler = (caller, answer, pc) => {
    console.log(caller + " 에게 answer 받음, answer : " + answer);
    pc = pcRef.current[caller];
    pc.setRemoteDescription(answer);
    console.log("remoteDescription 설정");
  };

  // 다른 멤버가 나갔을 때
  const memExitHandler = (exitedUserId) => {
    delete pcRef.current[exitedUserId];
    delPcsHandler(exitedUserId);
  };

  useEffect(() => {
    let pc;

    if (localStream !== null && stompClient.connected === true) {
      stompClient.subscribe(
        `/sub/video/joined-room-info/${userInfo.workspaceId}`,
        (msg) => {
          let users = JSON.parse(msg.body).userResponses;
          let topIdx = users.length - 1;
          let newUserId = users[topIdx].id;
          // workspace에 본인밖에 없음
          if (topIdx <= 0) return;
          // (본인이) workspace에 들어왔을 때 다른 멤버가 존재
          if (newUserId === userInfo.userId) {
            users.pop();
            enterHandler(users, pc);
            return;
          }
          // workspace에 새로운 멤버가 들어왔을 때
          memEnterHandler(newUserId, pc);
        }
      );

      stompClient.subscribe(
        `/sub/video/caller-info/${userInfo.workspaceId}`,
        (msg) => {
          let data = JSON.parse(msg.body);
          let caller = data.from;
          let callee = data.to;
          let payload = data.signal;

          if (caller === userInfo.userId || callee !== userInfo.userId) return;

          if (data.type === "offer") {
            getOfferHandler(caller, payload, pc);
          } else if (data.type === "ice") {
            getIceHandler(caller, payload, pc);
          }
        }
      );

      stompClient.subscribe(
        `/sub/video/callee-info/${userInfo.workspaceId}`,
        (msg) => {
          let data = JSON.parse(msg.body);
          let caller = data.from;
          let answer = data.signal;

          if (caller === userInfo.userId || data.to !== userInfo.userId) return;

          getAnswerHandler(caller, answer, pc);
        }
      );

      stompClient.subscribe(
        `/sub/video/unjoined-room-info/${userInfo.workspaceId}`,
        (msg) => {
          let data = JSON.parse(msg.body);
          let exitedUserId = data.userId;

          memExitHandler(exitedUserId);
        }
      );

      // connect되면 해당 endpoint로 메세지 전달 (입장 정보 전달)
      sendMsg("/pub/video/joined-room-info", {
        userId: userInfo.userId,
        sessionId: userInfo.userId,
      });

      exit();
    }
  }, [localStream]); // stompClient도 의존성으로 추가해야하는가? -> 우선 state가 변할 일이 없으니 빼놓고 진행

  return (
    <>
      <div>
        <LocalCam onSetLocalStream={setLocalStreamHandler} />
      </div>
      <div>
        <RemoteCam
          stompClient={stompClient}
          sendMsg={sendMsg}
          localStream={localStream}
          pcs={pcs}
          ref={remoteCamRef}
        />
      </div>
      {/* <button onClick={handler}>test !!</button> */}
    </>
  );
};

export default CamList;
