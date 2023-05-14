import React, { Dispatch, SetStateAction } from "react";
import MonacoEditor from "@monaco-editor/react";
import tw from "tailwind-styled-components";
import { useRecoilState } from "recoil";
import { snapshotState } from "@/store/snapshotState";
import { liveCodeContentSetter } from "@/store/liveCode";

interface PropType {
  code: string;
  setModal: Dispatch<SetStateAction<boolean>>;
}

const CodeSample = ({ code, setModal }: PropType) => {
  const [snapshotDetail, setSnapshotDetail] = useRecoilState(snapshotState);
  const [liveCodeSetter] = useRecoilState(liveCodeContentSetter);

  const restoreSnapshot = () => {
    liveCodeSetter.func(code);
    setModal(false);
  };

  return (
    <>
      {snapshotDetail.id ? (
        <>
          <MonacoEditor
            width="100%"
            height="88%"
            language="python"
            theme="vs-dark"
            read-only={true}
            value={code}
          />
          <FooterDiv>
            <button
              className="accent"
              style={{ width: "100px" }}
              onClick={restoreSnapshot}
            >
              복구
            </button>
          </FooterDiv>
        </>
      ) : (
        <PlaceholderDiv>
          왼쪽의 스냅샷을 선택해 <br></br>코드를 불러오세요!
        </PlaceholderDiv>
      )}
    </>
  );
};

export default CodeSample;

const PlaceholderDiv = tw.div`
w-full h-full
flex justify-center items-center
text-sm text-center
`;

const FooterDiv = tw.div`
w-full
flex justify-end
pt-[10px]
`;
