import React, { useState, useContext, useEffect, useRef } from "react";
import LabelTab from "@/components/_styled/LabelTab";
import tw from "tailwind-styled-components";
import ChatBubble from "./ChatBubble";
import { InputChatBox } from "../_styled/Input";
import { userInfoState } from "@/store/userInfoState";
import { useRecoilState } from "recoil";
import { WebSocketContext } from "@/context/WebSocketContext";
import { io } from "socket.io-client";

interface ChatPropType {
  userId: string;
  username: string;
  content: string;
  mine: boolean;
}

const ChatBox = () => {
  const [chatContent, setChatContent] = useState<string>("");
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const stompClient = useContext(WebSocketContext);
  const [chatList, setChatList] = useState<ChatPropType[]>([]);
  const scrollRef = useRef<HTMLDivElement | undefined>(null);
  const [editDone, setEditDone] = useState<boolean>(false);
  const [socket, setSocket] = useState<any>(null);


  useEffect(()=> {
    const sock = io("ws://localhost:8000", {
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd"
      }
    });
    sock.emit('join', userInfo.workspaceId);
    sock.on('progress', (response) => {console.log(response)});

    // socket.emit('feedback', userInfo.workspaceId, "code content");
    setSocket(sock);
  }, [])

  const sendChat = () => {
    stompClient.send(
      `/pub/video/chat/${userInfo.workspaceId}`,
      JSON.stringify({ userId: userInfo.userId, content: chatContent })
    );
    if (chatContent.includes("@chatgpt")) {
      socket.emit('question', userInfo.workspaceId, chatContent);
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

// const MainDiv = tw.div`
// w-full h-[calc(100%-32px)]
// overflow-h-auto
// dark-2
// rounded-[0_10px_10px_10px]
// overflow-x-hidden overflow-y-scroll
// p-[10px]
// `;
const MainDiv = tw.div`
w-full h-[calc(100%-32px)] 
overflow-h-auto
dark-2
rounded-[0_10px_10px_10px]
p-[10px]
`;

const ChatList = tw.div`
w-full h-[calc(100%-32px)] 
overflow-h-auto
p-[10px]
overflow-x-hidden overflow-y-scroll
`;
