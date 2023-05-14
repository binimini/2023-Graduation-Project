import { Dispatch, SetStateAction, useState } from "react";

type useModalType = [
  boolean,
  Dispatch<SetStateAction<boolean>>,
  (e: React.MouseEvent<HTMLElement>) => void
];

const useModal = (): useModalType => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onClick = () => {
    setIsModalOpen(true);
  };

  return [isModalOpen, setIsModalOpen, onClick];
};

export default useModal;
