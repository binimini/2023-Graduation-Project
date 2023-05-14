import { doesNotReject } from "assert";
import {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";

const RemoteCam = forwardRef(
  ({ stompClient, sendMsg, localStream, pcs }, ref) => {
    const memList = useRef<HTMLDivElement | undefined>(null);
    const [remoteStreams, setRemoteStreams] = useState(new Object());
    const delremoteStreamsHandler = (memId) => {
      setRemoteStreams((prev: object) => {
        delete prev[memId];
        return { ...prev };
      });
    };
    let config = {
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
            "stun:stun4.l.google.com:19302",
          ],
        },
      ],
    };

    useImperativeHandle(ref, () => ({
      makePeerConnection,
      setPeerConnection,
    }));

    // webRTC
    const makePeerConnection = () => {
      // RTC connection 객체 생성
      const peerConnection = new RTCPeerConnection(config);

      if (localStream != null) {
        // 다른 user(원격 user)에게 전송될 트랙들에 myStream의 오디오, 비디오 트랙을 추가
        localStream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localStream);
        });
      }

      return peerConnection;
    };

    const setPeerConnection = (pc, from, to) => {
      // 다른 user(원격 user)에게 트랙을 받을 경우에 대해 eventListener 추가
      pc.ontrack = (event) => {
        setRemoteStreams((prev: object) => {
          return { ...prev, [to]: event.streams[0] };
        });
      };

      pc.onicecandidate = (event) => {
        console.log("ice candidate 얻음");
        sendMsg("/pub/video/caller-info", {
          from: from,
          to: to,
          signal: event.candidate,
          type: "ice",
        });
      };

      return pc;
    };

    const connectRemoteCam = () => {
      while (memList.current?.hasChildNodes()) {
        memList.current.removeChild(memList.current.firstChild);
      }
      Object.values(remoteStreams).forEach((stream) => {
        let remoteCamTemp = document.createElement("video");
        memList.current?.appendChild(remoteCamTemp);
        remoteCamTemp.srcObject = stream;
        let playPromise = remoteCamTemp.play();
        if (playPromise != null) {
          playPromise
            .then((_) => {
              // console.log(_);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    };

    useEffect(() => {
      if (stompClient != null) {
        connectRemoteCam();
      }
    }, [remoteStreams]);

    useEffect(() => {
      let streamKeys = Object.keys(remoteStreams);
      for (const streamKey of streamKeys) {
        if (Object.hasOwn(pcs, streamKey) === false) {
          delremoteStreamsHandler(streamKey);
        }
      }
    }, [pcs]);

    return (
      <>
        <div ref={memList}></div>
      </>
    );
  }
);

export default RemoteCam;
