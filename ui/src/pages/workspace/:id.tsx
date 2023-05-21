import { useEffect } from "react";
import AlgoFilterContainer from "@/components/AlgoProblem/AlgoFilter";
import AlgoInfo from "@/components/AlgoProblem/AlgoInfo";
import TestCaseList from "@/components/TestCase/TestCaseList";
import CompileInfo from "@/components/UserInfo/UserInfo";
import LiveCode from "@/components/LiveCode/LiveCode";
import useFetchAlgoInfo from "@/hooks/Components/useFetchAlgoInfo";
import ChatBox from "@/components/Chat/ChatBox";
import Modal from "@/hoc/Portal";
import useModal from "@/hooks/useModal";
import SnapshotBtn from "@/components/Snapshot/PopupBtn";
import TimerBtn from "@/components/Timer/PopupBtn";
import { IconButton } from "@/components/_styled/Buttons";
import tw from "tailwind-styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import CamList from "@/components/Cam/CamList";
import Toast from "@/components/_styled/Toast";
import WebSocketContext from "@/context/WebSocketContext";
import SocketIOContext from "@/context/SocketIOContext";
import { useRecoilState } from "recoil";
import { userInfoState } from "@/store/userInfoState";
import Tooltip from "@/components/_styled/Tooltip";
import { toastMsgState } from "@/store/toastMsgState";
import React from "react";

const Workspace = () => {
  const [sendRequestProbLevel, sendRequestProbCategory] = useFetchAlgoInfo();
  const [isModalOpen, setIsModalOpen, onClickExit] = useModal();
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const [, setToastObj] = useRecoilState(toastMsgState);

  const onClickShare = async () => {
    try {
      await navigator.clipboard.writeText(userInfo.workspaceId);
      setToastObj({
        msg: `클립보드에 복사되었습니다 \n (${userInfo.workspaceId})`,
        show: true,
      });
    } catch (e) {}
  };

  useEffect(() => {
    sendRequestProbLevel();
    sendRequestProbCategory();

    setUserInfo({
      userId: localStorage.getItem("user-id") || userInfo.userId || "",
      username: localStorage.getItem("nickname") || userInfo.username || "",
      workspaceId: userInfo.workspaceId || location.pathname.split("/")[2],
      host:
        localStorage.getItem("host") == "true" ? true : false || userInfo.host,
    });
  }, []);

  const exitWorkspace = () => {
    navigate("/home");
    localStorage.removeItem("workspace-id");
  };

  return (
    <>
      <SocketIOContext>
      <WebSocketContext>
        <MainDiv>
          {/* Section 1 */}
          <AlgoDiv>
            <AlgoFilterDiv className="w-[23vw]">
              <AlgoFilterContainer />
            </AlgoFilterDiv>
            <AlgoInfoDiv>
              <AlgoInfo />
            </AlgoInfoDiv>
          </AlgoDiv>
          {/* Section 2 */}
          <CodeDiv>
            <LiveCode />
          </CodeDiv>
          {/* Section 3 */}
          <FlexDiv>
            {/* 유저 정보 */}
            <UserInfoDiv>
              <CompileInfo />
            </UserInfoDiv>
            {/* 테스트 케이스 */}
            <TestCasaeDiv>
              <ChatBox />
            </TestCasaeDiv>
            {/* 아래 버튼 3개 */}
            <UtilButtonsDiv>
              <Tooltip direction="top" tip="워크스페이스 코드 복사">
                <UtilButtonDiv>
                  <IconButton name="copy" size="lg" onClick={onClickShare} />
                </UtilButtonDiv>
              </Tooltip>
              <Tooltip direction="top" tip="스냅샷">
                <UtilButtonDiv>
                  <SnapshotBtn />
                </UtilButtonDiv>
              </Tooltip>
              <Tooltip direction="top" tip="타이머">
                <UtilButtonDiv>
                  <TimerBtn />
                </UtilButtonDiv>
              </Tooltip>
              <Tooltip direction="top" tip="나가기">
                <UtilButtonDiv>
                  <IconButton
                    name="circle-xmark"
                    size="lg"
                    onClick={onClickExit}
                  />
                </UtilButtonDiv>
              </Tooltip>
            </UtilButtonsDiv>
          </FlexDiv>
          {/* Section 4 */}
          <FlexDiv2>
            <CamDiv>
              <CamList />
            </CamDiv>
            <ChatDiv>
              <TestCaseList />
            </ChatDiv>
          </FlexDiv2>
        </MainDiv>
        <Modal
          className="h-[20%] w-[20%] min-w-[200px] max-w-[900px]"
          isShowing={isModalOpen}
          close={() => setIsModalOpen(false)}
        >
          <FlexDiv3>
            <FlexDiv4>종료하시겠습니까?</FlexDiv4>
            <FlexDiv4 className="justify-end">
              <ExitButton
                style={{
                  marginTop: "0px",
                  marginBottom: "0px",
                  padding: "5px 20px",
                }}
                onClick={exitWorkspace}
              >
                종료
              </ExitButton>
            </FlexDiv4>
          </FlexDiv3>
        </Modal>
        <Toast />
      </WebSocketContext>
      </SocketIOContext>
    </>
  );
};

export default Workspace;

/* 기본 */
const CommonDiv = tw.div`
ml-[15px] my-[15px]
rounded-[20px] basis-[100px]
bg-[#222831]
`;

const MainDiv = tw.div`
w-full min-w-[1000px] h-full
flex
overflow-hidden
dark-1
`;

const FlexDiv = tw(CommonDiv)`
grow-[2] flex flex-col
bg-inherit
`;

const FlexDiv2 = tw(CommonDiv)`
grow h-[calc(100%-30px)]
mr-[15px]
flex flex-col gap-[15px]
bg-inherit
`;

const FlexDiv3 = tw.div`
h-full
flex flex-col
justify-center items-center
py-[5%]
`;

const FlexDiv4 = tw.div`
w-full h-1/2 flex items-end justify-center
`;

/* 3.4.1 실시간 화상 회의 */
const CamDiv = tw.div`
dark-2
w-full h-[300px] min-h-[300px]
rounded-[20px]
`;

/* 3.4.7 채팅 */
const ChatDiv = tw.div`
w-full h-[calc(100%-320px)]
rounded-[20px]
`;

/* 3.4.4 알고리즘 문제 추천 */
const AlgoDiv = tw(CommonDiv)`
grow-[2] bg-inherit
`;

const AlgoFilterDiv = tw(CommonDiv)`
m-0
h-[20%]
bg-inherit
`;

const AlgoInfoDiv = tw(CommonDiv)`
m-0 mt-[15px]
h-[calc(80%-15px)]
`;

/* 3.4.2 실시간 동시 코딩 */
const CodeDiv = tw(CommonDiv)`
grow-[6] bg-[#1E1E1E]
`;

/* 3.4.5 컴파일 정보 */
const UserInfoDiv = tw(CommonDiv)`
m-0 mb-[15px] dark-1
w-full h-[20%]
basis-auto
`;

/* 3.4.6 테스트 케이스 */
const TestCasaeDiv = tw(CommonDiv)`
m-0 mb-[15px] dark-1
w-full h-full min-h-[420px]
basis-auto
`;

/* 부가기능 버튼들 */
const UtilButtonsDiv = tw(CommonDiv)`
m-0 w-full
min-h-[60px] h-[10%]
flex gap-[10px] justify-end items-end
bg-inherit
`;

const UtilButtonDiv = tw(CommonDiv)`
m-0
max-w-[60px]
h-[60px] w-[60px]
`;

const ExitButton = tw.button`
accent m-[10px] px-[10px]
`;
