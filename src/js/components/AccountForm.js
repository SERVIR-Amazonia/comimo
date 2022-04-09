import React from "react";
import styled from "styled-components";

const FormArea = styled.div`
  display: flex;
  padding-top: 2rem;
  justify-content: center;
`;

const Form = styled.form`
  border: 2px solid black;
  border-radius: 4px;
  overflow: hidden;
  width: 25rem;
`;

const FormContents = styled.div`
  padding: 1rem;
`;

const CardHeader = styled.h2`
  background-color: #f0ad4e;
  border-bottom: 2px solid black;
  font-size: larger;
  margin: -1px;
  padding: 1rem;
`;

export default function AccountForm({header, submitFn, children}) {
  return (
    <FormArea>
      <Form
        onSubmit={e => {
          e.preventDefault();
          submitFn();
        }}
      >
        {header && (
          <CardHeader>
            {header}
          </CardHeader>
        )}
        <FormContents>
          {children}
        </FormContents>
      </Form>
    </FormArea>
  );
}
