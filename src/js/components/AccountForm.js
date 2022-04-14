import React from "react";
import styled from "styled-components";
import TitledForm from "./TitledForm";

const FormArea = styled.div`
  display: flex;
  padding-top: 2rem;
  justify-content: center;
`;

export default function AccountForm(props) {
  return (
    <FormArea>
      <TitledForm {...props}/>
    </FormArea>
  );
}
