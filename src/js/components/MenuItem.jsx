import React from "react";
import styled from "@emotion/styled";

import IconButton from "./IconButton";

const Hidable = styled.div`
  display: ${({ active }) => !active && "none"};
`;

export default function MenuItem({ icon, selectedItem, itemName, onClick, tooltip, children }) {
  const active = selectedItem === itemName;
  return (
    <>
      <IconButton
        active={selectedItem === itemName}
        clickHandler={() => onClick(itemName)}
        icon={icon || itemName}
        tooltip={tooltip}
      />
      <Hidable active={active}>{children}</Hidable>
    </>
  );
}
