import React, { Dispatch, SetStateAction, useState } from "react";
import tw from "tailwind-styled-components";
import CodeSample from "@/components/Snapshot/CodeSample";
import SnapshotInfo from "@/components/Snapshot/SnapshotInfo";
import { ISnapshotInfo } from "@/interface/ISnapshot";
import { useRecoilState } from "recoil";
import { snapshotState } from "@/store/snapshotState";

interface PropType {
  list: Array<ISnapshotInfo>;
  setModal: Dispatch<SetStateAction<boolean>>
}

const SnapshotListModal = ({ list = [], setModal }: PropType) => {
  const [snapshotDetail, setSnapshotDetail] = useRecoilState(snapshotState);

  return (
    <MainDiv>
      <SnapshotListDiv>
        {list.map((e) => (
          <SnapshotInfo key={e.id} data={e} />
        ))}
      </SnapshotListDiv>
      <CodeSampleDiv>
        <CodeSample code={snapshotDetail.content} setModal={setModal}/>
      </CodeSampleDiv>
    </MainDiv>
  );
};

export default SnapshotListModal;

const MainDiv = tw.div`
w-full h-full
flex
`;

const SnapshotListDiv = tw.div`
w-[50%] h-full
p-[20px]
overflow-y-auto
`;

const CodeSampleDiv = tw.div`
w-[50%] h-full
dark-1
p-[36px_10px_10px_10px]
rounded-[0_10px_10px_0]
`;
