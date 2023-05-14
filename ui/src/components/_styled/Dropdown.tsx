import tw from "tailwind-styled-components";

const DotDropdown = () => {
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0}>
        <IconButton
          onClick={onClickDotMenu}
          width="fit-content"
          name="ellipsis-vertical"
        />
      </label>
      <DropdownUl tabIndex={0}>
        <DropdownLi>
          <DropdownA>수정</DropdownA>
        </DropdownLi>
        <DropdownLi>
          <DropdownA className="font-warning">삭제</DropdownA>
        </DropdownLi>
      </DropdownUl>
    </div>
  );
};

const DropdownUl = tw.ul`
dropdown-content menu rounded-box w-20 
bg-base-100 p-[5px] text-sm shadow"
`;

const DropdownLi = tw.li`
text-2xs
flex justify-center items-center
`;
