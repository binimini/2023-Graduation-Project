import React, { useState } from "react";
import tw from "tailwind-styled-components";
import { useTheme } from "@/context/ThemeContext";
import Modal from "@/hoc/Portal";
import EnterCodeModal from "@/components/Home/EnterCodeModal";
import useModal from "@/hooks/useModal";
import { uuidv4 } from "@/utils/commonFunc/genUuid";
import { generateNickname } from "@/utils/commonFunc/genNickname";
import { usePost } from "@/hooks/useHttp";
import { userInfoState } from "@/store/userInfoState";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

const ImgURL = "https://embed.lottiefiles.com/animation/63487";

const Home = () => {
  const { themeColorset } = useTheme();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen, onClick] = useModal();
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);

  const setUserInfoHandler = (res: any) => {
    const workspaceId = res.rooms[0].id;
    const userId = res.users[0].id;
    const username = res.users[0].name;
    setUserInfo({
      userId: userId,
      username: username,
      workspaceId: workspaceId,
      host: true,
    });

    localStorage.setItem("workspace-id", workspaceId);
    localStorage.setItem("user-id", userId);
    localStorage.setItem("nickname", username);
    localStorage.setItem("host", "true");
    navigate(`/workspace/${workspaceId}`);
  };

  const { sendRequest } = usePost(
    {
      url: "/api/video",
    },
    setUserInfoHandler
  );

  const onClickCreateWorkspace = () => {
    const nickname = generateNickname();
    sendRequest({ username: nickname });
  };

  return (
    <HomeDiv>
      <TitleDiv style={{ color: themeColorset.pointColor }}>
        ConCoder
        <img width="200" src="src/assets/img/coder.gif" />
      </TitleDiv>
      <BtnContainer style={{ color: themeColorset.textColor }}>
        <BtnDiv>
          새로운 방을 만들고싶다면 ..
          <button className="styled" onClick={onClickCreateWorkspace}>
            CREATE A WORKSPACE
          </button>
        </BtnDiv>
        <BtnDiv>
          초대받으셨나요?
          <button className="styled" onClick={onClick}>
            ENTER CODE
          </button>
        </BtnDiv>
      </BtnContainer>
      <Modal
        className="h-[30%] w-[30%] min-w-[300px] max-w-[900px]"
        isShowing={isModalOpen}
        close={() => setIsModalOpen(false)}
      >
        <EnterCodeModal />
      </Modal>
    </HomeDiv>
  );
};

export default Home;

const HomeDiv = tw.div`
  flex flex-col justify-center items-center
`;

const TitleDiv = tw.div`
 text-[70px] font-bold py-[100px] px-[40px]
 flex gap-[20px] justify-center items-center
 tracking-wider
`;

const BtnContainer = tw.div`
  flex gap-[20px]
`;

const BtnDiv = tw.div`
  flex flex-col justify-center items-center gap-[5px]
`;
