import React, { useState } from "react";
import styled from "@emotion/styled";

import { visiblePanelAtom } from "../home";

import SvgIcon from "./SvgIcon";
import { useAtom, useSetAtom } from "jotai";

const PanelOuter = styled.div`
  background: #fffff8;
  border-radius: ${({ isInverted }) => (isInverted ? "0 0 6px 6px" : "6px 6px 0 0")};
  bottom: ${({ isInverted }) => !isInverted && "var(--bar-height)"};
  display: ${({ active }) => (active ? "flex" : "none")};
  flex-direction: column;
  max-height: calc(100% - (2 * var(--bar-height)));
  position: absolute;
  top: ${({ isInverted }) => isInverted && "var(--bar-height)"};
  width: 33vw;
  z-index: 99;
  text-align: left;
`;

const Title = styled.div`
  background-color: var(--gray-1);
  border: 1px solid var(--gray-3);
  border-radius: ${({ isInverted }) => !isInverted && "6px 6px 0 0"};
  color: var(--white);
  display: flex;
  font: var(--unnamed-font-style-normal) var(--unnamed-font-weight-bold) var(--unnamed-font-size-18) /
    21px var(--unnamed-font-family-roboto);
  justify-content: space-between;
  letter-spacing: 0px;
  padding: 0.5rem;
  text-align: left;
  text-transform: uppercase;
`;

const Content = styled.div`
  overflow: auto;
  padding: 1rem;
`;

export default function ToolCard({ title, active, children, isInverted }) {
  const setVisiblePanel = useSetAtom(visiblePanelAtom);
  return (
    <PanelOuter
      id={`tool-panel-${title?.replaceAll(" ", "-").toLowerCase()}`}
      active={active}
      isInverted={isInverted}
    >
      <Title isInverted={isInverted}>
        {title}
        <SvgIcon
          onClick={() => setVisiblePanel(null)}
          icon="close"
          color="white"
          hoverFill="var(--gray-3)"
          size="24px"
        />
      </Title>
      <Content>{children}</Content>
    </PanelOuter>
  );
}
