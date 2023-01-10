import React from "react";
import styled from "styled-components";

const FullOpenVector = ({ open, setOpen }: { setOpen?: any; open: boolean }) => {
  return (
    <div className={"flex w-full justify-between"}>
      <StyledBorder />
      <StyledImage onClick={() => setOpen(!open)} open={open}>
        <img src={"/images/dashboard/fullopen.svg"} alt={""} />
      </StyledImage>
      <StyledBorder />
    </div>
  );
};

export default FullOpenVector;

const StyledBorder = styled.div`
  border-bottom: 1px solid rgba(255, 222, 0, 0.5);
  width: calc((100% - 85px) / 2);
  height: 0px;
  margin-top: 4px;
`;

const StyledImage = styled.div<{ open: boolean }>`
  transform: rotate(${({ open }) => (open ? "180deg" : "0")});
  margin-top: ${({ open }) => (open ? "-16px" : "0")};
  cursor: pointer;
  > img {
    opacity: 1;
  }
  position: relative;
  ::after {
    position: absolute;
    content: "";
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: url("/images/dashboard/fullopen-white.svg");
    opacity: 0;
  }
  :hover {
    > img {
      opacity: 0;
    }
    ::after {
      opacity: 1;
    }
  }
`;
