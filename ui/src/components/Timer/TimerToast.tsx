import { useEffect, useRef, useState } from "react";
import { TimerToastProps } from "./PopupBtn";
import tw from "tailwind-styled-components";
import { IconButton } from "@/components/_styled/Buttons";

// 숫자 2자리 string으로 변환
const padNumber = (num, len) => {
  return String(num).padStart(len, "0");
};
interface Interval {
  current?: Number;
}
const TimerToast = ({ timeData, onTimerReset, onClose }: TimerToastProps) => {
  // time관련 state, ref
  const [hour, setHour] = useState(padNumber(timeData.hour, 2));
  const [min, setMin] = useState(padNumber(timeData.min, 2));
  const [sec, setSec] = useState(padNumber(timeData.sec, 2));
  const initialTime = useRef(
    timeData.hour * 60 * 60 + timeData.min * 60 + timeData.sec
  );
  let interval = useRef<Interval>({ current: 0 });

  useEffect(() => {
    setHour(padNumber(timeData.hour, 2));
    setMin(padNumber(timeData.min, 2));
    setSec(padNumber(timeData.sec, 2));
    initialTime.current =
      timeData.hour * 60 * 60 + timeData.min * 60 + timeData.sec;
  }, [timeData]);

  // control관련 state
  const [isPlaying, setIsPlaying] = useState(true);

  //   hover관련 state
  const [isHovering, setIsHovering] = useState(false);

  const clickPauseHandler = () => {
    setIsPlaying(false);
  };
  const clickPlayHandler = () => {
    setIsPlaying(true);
  };
  const clickStopHandler = () => {
    initialTime.current = 0;
    // TODO: isPlaying = false되면서 멈췄지만, interval이 clear되지 않음. 추후 수정 필요
    setIsPlaying(false);
    // 즉시 화면에 0초로 보이기 위해
    setHour(padNumber(0, 2));
    setMin(padNumber(0, 2));
    setSec(padNumber(0, 2));
  };
  const clickResetHandler = () => {
    setIsPlaying(false);
    onTimerReset();
    onClose();
  };

  // 1초씩 줄어드는 effect
  useEffect(() => {
    if (isPlaying && initialTime.current !== 0) {
      interval = {
        current: setInterval(() => {
          initialTime.current -= 1;
          setSec(padNumber(initialTime.current % 60, 2));
          setMin(padNumber(parseInt((initialTime.current / 60) % 60), 2));
          setHour(padNumber(parseInt((initialTime.current / 60 / 60) % 60), 2));
        }, 1000),
      };
    }
    return () => clearInterval(interval.current);
  }, [isPlaying]);

  // timeover effect
  useEffect(() => {
    if (initialTime.current <= 0) {
      clearInterval(interval.current);
      // TODO: isPlaying = false되면서 멈췄지만, interval이 clear되지 않음. 추후 수정 필요
      setIsPlaying(false);
      //   TODO: time over 시 어떻게 처리할지 정하기 (e.g. bg-color 변경, 클릭 시 toast 내리기 or 모달창으로 알림 띄우고 toast 내리기)
    }
  }, [sec]);

  const timerControlDiv = (
    <div>
      <IconButton name="pause" size="lg" onClick={clickPauseHandler} />
      <IconButton name="play" size="lg" onClick={clickPlayHandler} />
      <IconButton name="stop" size="lg" onClick={clickStopHandler} />
      <IconButton name="rotate-left" size="lg" onClick={clickResetHandler} />
    </div>
  );

  return (
    <TimerToastDiv
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <TimerToastMainDiv>
        <div>
          <TimerToastTime>{hour} :</TimerToastTime>
          <TimerToastTime>{min} :</TimerToastTime>
          <TimerToastTime>{sec}</TimerToastTime>
        </div>
        {isHovering && timerControlDiv}
      </TimerToastMainDiv>
    </TimerToastDiv>
  );
};

export default TimerToast;

const TimerToastDiv = tw.div`
toast
toast-end
toast-top
`;

const TimerToastMainDiv = tw.div`
alert
alert-info
flex
flex-col
bg-accent
`;

const TimerToastTime = tw.p`
text-lg
`;
