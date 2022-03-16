import React from "react";
import styled from "styled-components";

const PanelOuter = styled.div`
  background: #fffff8;
  display: flex;
  flex-direction: column;
  height: 100%;
  left: 50px;
  position: absolute;
  top: 0;
  width: 33vw;
  z-index: 99;
`;

const Title = styled.h2`
  border-bottom: 1px solid gray;
  padding: .5rem;
`;

const Content = styled.div`
  overflow: auto;
  padding: 1rem;
`;

export default function ToolPanel({title, children}) {
  return (
    <PanelOuter>
      <Title>
        {title}
      </Title>
      <Content>
        {children}
      </Content>
    </PanelOuter>
  );
}
