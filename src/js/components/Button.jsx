import React from "react";
import styled from "@emotion/styled";
import { THEME } from "../constants";

const getBackgroundColor = ({ $active, $disabled, $secondaryButton }) => {
  if ($disabled) {
    return THEME.buttonDisabled.backgroundColor;
  } else if ($secondaryButton) {
    return $active
      ? THEME.secondaryButtonSelected.backgroundColor
      : THEME.secondaryButtonDefault.backgroundColor;
  } else {
    return $active
      ? THEME.primaryButtonSelected.backgroundColor
      : THEME.primaryButtonDefault.backgroundColor;
  }
};

const getBackgroundColorHover = ({ $disabled, $secondaryButton }) => {
  if ($disabled) {
    return THEME.buttonDisabled.backgroundColor;
  } else if ($secondaryButton) {
    return THEME.secondaryButtonHover.backgroundColor;
  } else {
    return THEME.primaryButtonHover.backgroundColor;
  }
};

const getBorderColor = ({ $active, $disabled, $secondaryButton }) => {
  if ($disabled) {
    return THEME.buttonDisabled.borderColor;
  } else if ($secondaryButton) {
    return $active
      ? THEME.secondaryButtonSelected.borderColor
      : THEME.secondaryButtonDefault.borderColor;
  } else {
    return $active
      ? THEME.primaryButtonSelected.borderColor
      : THEME.primaryButtonDefault.borderColor;
  }
};

const getBorderColorHover = ({ $disabled, $secondaryButton }) => {
  if ($disabled) {
    return THEME.buttonDisabled.borderColor;
  } else if ($secondaryButton) {
    return THEME.secondaryButtonHover.borderColor;
  } else {
    return THEME.primaryButtonHover.borderColor;
  }
};

const getFillColor = ({ $active, $disabled, $secondaryButton }) => {
  if ($disabled) {
    return THEME.buttonDisabled.fillColor;
  } else if ($secondaryButton) {
    return $active
      ? THEME.secondaryButtonSelected.fillColor
      : THEME.secondaryButtonDefault.fillColor;
  } else {
    return $active ? THEME.primaryButtonSelected.fillColor : THEME.primaryButtonDefault.fillColor;
  }
};

const getFillColorHover = ({ $disabled, $secondaryButton }) => {
  if ($disabled) {
    return THEME.buttonDisabled.fillColor;
  } else if ($secondaryButton) {
    return THEME.secondaryButtonHover.fillColor;
  } else {
    return THEME.primaryButtonHover.fillColor;
  }
};

const ButtonStyled = styled.button`
  background-color: ${getBackgroundColor};
  border-color: ${getBorderColor};
  border: 1px solid;
  border-radius: 0.25rem;
  color: ${getFillColor};
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  font-style: var(--unnamed-font-family-roboto);
  font-size: 18px;
  font-weight: var(--unnamed-font-weight-medium);
  letter-spacing: 0px;
  line-height: 1.5;
  max-height: 37px;
  padding: 0.2rem 0.5rem;
  text-align: center;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out;
  vertical-align: middle;

  &:hover {
    background-color: ${getBackgroundColorHover};
    border-color: ${getBorderColorHover};
    color: ${getFillColorHover};
  }
`;

function Button({ active, children, extraStyle, isDisabled, onClick, secondaryButton, tooltip }) {
  return (
    <ButtonStyled
      style={extraStyle}
      $active={active}
      $disabled={isDisabled}
      disabled={isDisabled}
      $secondaryButton={secondaryButton || false}
      onClick={onClick}
      title={tooltip}
    >
      {children}
    </ButtonStyled>
  );
}

export default Button;
