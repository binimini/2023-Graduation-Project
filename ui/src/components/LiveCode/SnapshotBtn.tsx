import { MouseEventHandler } from "react";
import tw from "tailwind-styled-components";

interface PropType {
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const SnapshotFloatBtn = ({ onClick }: PropType) => {
  return (
    <button className="accent" onClick={onClick}>
      SNAPSHOT
    </button>
  );
};

export default SnapshotFloatBtn;