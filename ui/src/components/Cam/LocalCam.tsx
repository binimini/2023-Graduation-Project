import { userInfoState } from "@/store/userInfoState";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import tw from "tailwind-styled-components";
import { IconButton } from "../_styled/Buttons";

interface PropType {
  onSetLocalStream: (stream: any) => void;
}

const LocalCam = ({ onSetLocalStream }: PropType) => {
  const localStream = useRef<MediaStream | undefined>(null);
  const localCam = useRef<HTMLVideoElement | undefined>(null);
  const cameraBtn = useRef<HTMLButtonElement | undefined>(null);
  const muteBtn = useRef<HTMLButtonElement | undefined>(null);
  const userInfo = useRecoilValue(userInfoState);

  const [cameraOff, setCameraOff] = useState(false);
  const [mute, setMute] = useState(false);

  // cam on/off 관리 함수
  const camClickHandler = () => {
    localStream.current?.getVideoTracks().forEach((track) => {
      track.enabled = cameraOff;
    });
    setCameraOff(!cameraOff);
  };

  // audio on/off 관리 함수
  const muteClickHandler = () => {
    localStream.current?.getAudioTracks().forEach((track) => {
      track.enabled = mute;
    });
    setMute(!mute);
  };

  const getMedia = async () => {
    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { facingMode: "true" },
      });
      if (localCam.current != null) {
        localCam.current.srcObject = localStream.current;
        localCam.current.play();
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(async () => {
    await getMedia();
    onSetLocalStream(localStream.current);
  }, []);

  return (
    <>
      <video id="localCam" ref={localCam}></video>
      {/* 원래 아래 부붙 className 동적으로 생성할 수 있는데 
      fontAwesome 측의 버그로 이런식으로 해야 재렌더링이 됨 .. 
      나중에 바꿀것 @todo */}
      <FlexDiv>
        <NicknameHolder>{userInfo.username} (나)</NicknameHolder>
        <ButtonsDiv>
          {cameraOff ? (
            <span>
              <span />
              <IconButton
                name="video-slash"
                size="sm"
                onClick={camClickHandler}
              />
            </span>
          ) : (
            <div>
              <IconButton name="video" size="sm" onClick={camClickHandler} />
            </div>
          )}
          {mute ? (
            <span>
              <span />
              <IconButton
                name="volume-slash"
                size="xs"
                onClick={muteClickHandler}
              />
            </span>
          ) : (
            <span>
              <IconButton name="volume" size="xs" onClick={muteClickHandler} />
            </span>
          )}
        </ButtonsDiv>
      </FlexDiv>
    </>
  );
};

export default LocalCam;

const FlexDiv = tw.div`
flex justify-between items-center 
px-[5px]
relative bottom-[30px]
`;
const NicknameHolder = tw.div`
text-[10px]
`;

const ButtonsDiv = tw.div`
w-fit 
px-[12px] py-[5px]
flex gap-[10px] justify-end
rounded-[5px] bg-neutral
`;
