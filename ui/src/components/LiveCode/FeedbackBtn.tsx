import { MouseEventHandler } from "react";
import tw from "tailwind-styled-components";

interface PropType {
    onClick: MouseEventHandler<HTMLButtonElement>;
}

const FeedbackFloadBtn = ({ onClick }: PropType) => {

    return (
        <button className="accent" onClick={onClick}>
            FEEDBACK
        </button>
    );
};

export default FeedbackFloadBtn;
