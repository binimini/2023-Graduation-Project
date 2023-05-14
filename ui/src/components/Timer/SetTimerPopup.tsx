import { useState } from "react";
import tw from "tailwind-styled-components";
import styled from "styled-components";
import { TimerProps } from "./PopupBtn";

const TimerForm = ({
  onClose,
  onShowTimerToast,
  onClickTimerStart,
}: TimerProps) => {
  // timer 입력 시간관련 state, handelr
  const [timerInputs, setTimerInputs] = useState({
    hour: parseInt(0),
    min: parseInt(0),
    sec: parseInt(0),
  });

  const hourChangeHandler = (event: React.MouseEvent<HTMLElement>) => {
    setTimerInputs((prevState) => {
      return { ...prevState, hour: parseInt(event.target.value) };
    });
  };
  const minChangeHandler = (event: React.MouseEvent<HTMLElement>) => {
    setTimerInputs((prevState) => {
      return { ...prevState, min: parseInt(event.target.value) };
    });
  };
  const secChangeHandler = (event: React.MouseEvent<HTMLElement>) => {
    setTimerInputs((prevState) => {
      return { ...prevState, sec: parseInt(event.target.value) };
    });
  };

  // 시작하기 버튼 클릭 시, TimerToast 띄우고 TimerForm은 내리기
  const clickTimerStartHandler = () => {
    onClickTimerStart(timerInputs.hour, timerInputs.min, timerInputs.sec);
    onShowTimerToast();
    onClose();
  };

  return (
    <>
      <TimerFormMainDiv>
        <div className="w-full">
          <TimerTitle>타이머 시간을 설정하세요</TimerTitle>
          <TimerSettings>
            <TimerInput
              name="hour"
              placeholder="0"
              type="number"
              min="1"
              onChange={hourChangeHandler}
              value={timerInputs.hour}
            />
            {/* <InputBox placeholder="0" /> */}
            <p>:</p>
            <TimerInput
              name="min"
              placeholder="0"
              type="number"
              min="0"
              max="59"
              onChange={minChangeHandler}
              value={timerInputs.min}
            />
            {/* <InputBox placeholder="0" /> */}
            <p>:</p>
            <TimerInput
              name="sec"
              placeholder="0"
              type="number"
              min="0"
              max="59"
              onChange={secChangeHandler}
              value={timerInputs.sec}
            />
            {/* <InputBox placeholder="0" /> */}
          </TimerSettings>
        </div>

        <TimerAction>
          <button
            className="accent"
            style={{ width: "100%" }}
            onClick={clickTimerStartHandler}
          >
            시작하기
          </button>
        </TimerAction>
      </TimerFormMainDiv>
    </>
  );
};

export default TimerForm;

const TimerFormMainDiv = tw.div`
w-full h-full
flex
flex-col
pt-[10%] pb-[20px] px-[40px]
items-center justify-between
`;

const TimerTitle = tw.p`
text-lg
text-center
mb-[8px]
`;

const TimerSettings = tw.div`
flex
flex-row
justify-between items-center
gap-[6px]
`;

const TimerInput = tw.input`
input w-full
px-[5px]
text-center
bg-neutral
`;

const TimerAction = tw.div`
flex
flex-row
justify-center
mt-4
w-full
`;
