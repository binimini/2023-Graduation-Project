import React, { useState } from "react";
import { IconButton } from "@/components/_styled/Buttons";
import TimerForm from "./SetTimerPopup";
import TimerPortal from "./TimerPortal";
import TimerToast from "./TimerToast";
import useModal from "@/hooks/useModal";
import Modal from "@/hoc/Portal";

interface Time {
  hour: number;
  min: number;
  sec: number;
}
export interface TimerProps {
  onClose: () => void;
  onShowTimerToast: () => void;
  onClickTimerStart: (hour: number, min: number, sec: number) => void;
}

export interface TimerToastProps {
  timeData: Time;
  onTimerReset: () => void;
  onClose: () => void;
}

const TimerPopupBtn = () => {
  // timerForm관련 state
  const [timerFromIsShowing, setTimerFormIsShowing] = useState(false);

  const showTimerFormHandler = () => {
    setTimerFormIsShowing(true);
  };

  const hideTimerFormHandler = () => {
    setTimerFormIsShowing(false);
  };

  // timerToast관련 state, handler
  const [timerToastIsShowing, setTimerToastIsShowing] = useState(false);

  const showTimerToastHandler = () => {
    setTimerToastIsShowing(true);
  };
  const hideTimerToastHandler = () => {
    setTimerToastIsShowing(false);
  };

  // timer 입력 시간관련 state, handelr
  const [timerInputs, setTimerInputs] = useState({
    hour: parseInt(0),
    min: parseInt(0),
    sec: parseInt(0),
  });

  const timerSettingHandler = (hour: number, min: number, sec: number) => {
    setTimerInputs((prevState) => {
      return { ...prevState, hour: hour, min: min, sec: sec };
    });
  };

  const [isModalOpen, setIsModalOpen, onClickOpen] = useModal();

  return (
    <>
      <Modal
        className="h-[25%] min-h-[200px] w-[20%] min-w-[300px] max-w-[900px]"
        isShowing={isModalOpen}
        close={() => setIsModalOpen(false)}
      >
        <TimerForm
          onClickTimerStart={timerSettingHandler}
          onClose={hideTimerFormHandler}
          onShowTimerToast={showTimerToastHandler}
        />
      </Modal>

      <TimerPortal
        children={
          <TimerToast
            timeData={timerInputs}
            onClose={hideTimerToastHandler}
            onTimerReset={showTimerFormHandler}
          />
        }
        isShowing={timerToastIsShowing}
      />

      <IconButton name="stopwatch" size="lg" onClick={onClickOpen} />
    </>
  );
};

export default TimerPopupBtn;
