import { toastMsgState } from "@/store/toastMsgState";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import tw from "tailwind-styled-components";

const Toast = () => {
  const [toastObj, setToastObj] = useRecoilState(toastMsgState);

  useEffect(() => {
    if (toastObj.show)
      setTimeout(() => {
        setToastObj({ msg: "", show: false });
        console.log(toastObj.show);
      }, 2000);
  }, [toastObj.show]);

  return (
    <ToastDiv className="toast" style={{ transform: "translate(-50%, -50%)" }}>
      {toastObj.show && (
        <AlertDiv className="alert alert-info">
          <div>{toastObj.msg}</div>
        </AlertDiv>
      )}
    </ToastDiv>
  );
};

export default Toast;

const ToastDiv = tw.div`
w-fit h-fit absolute left-[50%] top-[50%]
`;

const AlertDiv = tw.div`
py-1 rounded-[10px]
dark-2 text-[#e5e7eb] text-[14px]
`;
