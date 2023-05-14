import { Dispatch, SetStateAction } from "react";
import { atom } from "recoil";

const initialState: { func: (arg: string) => void } = {
  func: (str) => {},
};

export const liveCodeContentSetter = atom({
  key: "liveCodeContentSetter",
  default: initialState,
});
