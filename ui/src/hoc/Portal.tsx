import { IconButton } from "@/components/_styled/Buttons";
import React, { Dispatch, ReactNode, SetStateAction, useEffect } from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";
import tw from "tailwind-styled-components";

const $portal = document.querySelector("#modal-root");

interface PropType {
  className: string;
  children: ReactNode;
  isShowing: boolean;
  close: Dispatch<SetStateAction<boolean>>;
}

const Modal = ({ children, isShowing, close, className }: PropType) => {
  return isShowing && $portal
    ? ReactDOM.createPortal(
        <>
          <ModalWrapper onClick={close}></ModalWrapper>
          <ModalContainer className={className}>
            <CloseButton>
              <IconButton name="close" onClick={close} />
            </CloseButton>
            {children}
          </ModalContainer>
        </>,

        $portal
      )
    : null;
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
`;

export const ModalWrapper = styled(Wrapper)`
  background: rgba(0, 0, 0, 0.4); // 바깥 배경 밝기
  z-index: 10;
`;

const ModalContainer = tw.div`
fixed
left-[50%]
bottom-[50%]
transform
translate-x-[-50%]
translate-y-[50%]
dark-2
w-[600px] h-[400px]
rounded-[10px] z-[100]
`;

const CloseButton = tw.div`
absolute right-0 w-fit p-[10px_14px]
`;

export default Modal;
