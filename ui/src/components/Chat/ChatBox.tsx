import React, { useState, useContext, useEffect, useRef } from "react";
import LabelTab from "@/components/_styled/LabelTab";
import tw from "tailwind-styled-components";
import ChatBubble from "./ChatBubble";
import { InputChatBox } from "../_styled/Input";
import { userInfoState } from "@/store/userInfoState";
import { useRecoilState } from "recoil";
import { WebSocketContext } from "@/context/WebSocketContext";
import { io } from "socket.io-client";
import {toastMsgState} from "@/store/toastMsgState";

interface ChatPropType {
  userId: string;
  username: string;
  content: string;
  mine: boolean;
}

const ChatBox = () => {
  const [chatContent, setChatContent] = useState<string>("");
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const [, setToastObj] = useRecoilState(toastMsgState);
  const stompClient = useContext(WebSocketContext);
  const [chatList, setChatList] = useState<ChatPropType[]>([]);
  const scrollRef = useRef<HTMLDivElement | undefined>(null);
  const [editDone, setEditDone] = useState<boolean>(false);
  const [socket, setSocket] = useState<any>(null);
  const [joining, setJoining] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);


  useEffect(()=> {
    const sock = io("ws://localhost:8000", {
      withCredentials: true,
      extraHeaders: { "my-custom-header": "abcd"}
    });
    // join response
    sock.on('join', () => {
      setJoining(false);
      console.log("joined!!!")
    });
    // partial answer
    sock.on('progress', ({role, id, text}) => {
      setChatList((prev) => [
          ...prev.filter((value) => !(value.username=='ChatGPT'&&value.userId==id)),
          { userId: id, username:'ChatGPT', content: text, mine: false }
        ]);
    });
    // complete answer
    sock.on('answer', () => setLoading(false));

    // join request
    setTimeout(()=>{sock.emit('join', userInfo.workspaceId);}, 1000)

    setSocket(sock);
  }, [])

  // const onClick = () => {
  //   socket.emit('feedback', userInfo.workspaceId, "code content");
  // }

  const sendChat = () => {
    stompClient.send(
      `/pub/video/chat/${userInfo.workspaceId}`,
      JSON.stringify({ userId: userInfo.userId, content: chatContent })
    );
    if (chatContent.includes("@chatgpt")) {
      if (joining) {
        setToastObj({show:true, msg:'ChatGPT와 연동하는 중입니다. 잠시 기다려주세요.'})
        return;
      }
      if (loading) {
        setToastObj({show:true, msg:'ChatGPT가 대답하는 중입니다. 한 번에 한 질문만 해주세요!'})
        return;
      }
      socket.emit('question', userInfo.workspaceId, chatContent);
      setLoading(true);
    }
  };

  useEffect(() => {
    if (stompClient.connected === true) {
      stompClient.subscribe(
        `/sub/video/chat/${userInfo.workspaceId}`,
        (msg) => {
          let data = JSON.parse(msg.body);
          let isMine = data.userId === userInfo.userId ? true : false;
          setChatList((prev) => {
            return [...prev, { ...data, mine: isMine }];
          });
        }
      );
    }
  }, [stompClient.connected]);

  // TODO: 채팅 input박스에 값 입력할 때마다 chatContent state 변화 -> 아래의 editDone이 true여서 콜백함수가 계속 실행됨. 다른 방법 모색해보기
  useEffect(() => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    setEditDone(false);
  }, [editDone === true]);

  return (
    <>
      <LabelTab label="채팅" />
      <MainDiv>
        { joining ? <BubbleDiv>ChatGPT가 연동되는 중입니다. {Spinner} </BubbleDiv> :
            loading ? <BubbleDiv> ChatGPT가 답변을 작성 중입니다. {Spinner} </BubbleDiv> : null  }
        <ChatList ref={scrollRef}>
          {chatList.map((chat: ChatPropType) => {
            return (
              <ChatBubble
                key={Math.random()}
                username={chat.username}
                content={chat.content}
                mine={chat.mine}
                onEditDone={setEditDone}
              />
            );
          })}
        </ChatList>
        <InputChatBox
            placeholder="채팅을 입력해주세요."
            setInput={setChatContent}
            enterHandler={sendChat}
        />
      </MainDiv>
    </>
  );
};

export default ChatBox;

const BubbleDiv = tw.div`
    w-[full] h-fit min-h-[25px]
    bg-neutral 
    rounded-[5px]
    px-[8px] py-[5px]
    text-[10px]
    break-words
`;

// const MainDiv = tw.div`
// w-full h-[calc(100%-32px)]
// overflow-h-auto
// dark-2
// rounded-[0_10px_10px_10px]
// overflow-x-hidden overflow-y-scroll
// p-[10px]
// `;

const Spinner =
  <div className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
  </div>;

const MainDiv = tw.div`
w-full h-[calc(100%-32px)] 
overflow-h-auto
dark-2
rounded-[0_10px_10px_10px]
p-[10px]
`;

const ChatList = tw.div`
w-full h-[calc(100%-50px)] 
overflow-h-auto
p-[10px]
overflow-x-hidden overflow-y-scroll
`;
