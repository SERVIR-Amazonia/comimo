import React from "react";
import styled from "@emotion/styled";
import PropTypes from "prop-types";

const envelopeIcon = (
  <svg viewBox="0 0 512 512">
    <polygon points="339.392,258.624 512,367.744 512,144.896" />
    <polygon points="0,144.896 0,367.744 172.608,258.624" />
    <path d="M480,80H32C16.032,80,3.36,91.904,0.96,107.232L256,275.264l255.04-168.032C508.64,91.904,495.968,80,480,80z" />
    <path
      d="M310.08,277.952l-45.28,29.824c-2.688,1.76-5.728,2.624-8.8,2.624c-3.072,0-6.112-0.864-8.8-2.624l-45.28-29.856
        L1.024,404.992C3.488,420.192,16.096,432,32,432h448c15.904,0,28.512-11.808,30.976-27.008L310.08,277.952z"
    />
  </svg>
);

const checkIcon = (
  <svg viewBox="0 -46 417.81333 417">
    <path
      d="m159.988281 318.582031c-3.988281 4.011719-9.429687 6.25-15.082031
        6.25s-11.09375-2.238281-15.082031-6.25l-120.449219-120.46875c-12.5-12.5-12.5-32.769531
        0-45.246093l15.082031-15.085938c12.503907-12.5 32.75-12.5 45.25 0l75.199219 75.203125
        203.199219-203.203125c12.503906-12.5 32.769531-12.5 45.25 0l15.082031 15.085938c12.5 12.5 12.5 32.765624
        0 45.246093zm0 0"
    />
  </svg>
);

const closeIcon = (
  <svg viewBox="0 0 512 512">
    <path
      d="M256,0C114.508,0,0,114.497,0,256c0,141.493,114.497,256,256,256c141.492,0,256-114.497,256-256
        C512,114.507,397.503,0,256,0z M256,472c-119.384,0-216-96.607-216-216c0-119.385,96.607-216,216-216
        c119.384,0,216,96.607,216,216C472,375.385,375.393,472,256,472z"
    />
    <path
      d="M343.586,315.302L284.284,256l59.302-59.302c7.81-7.81,7.811-20.473,0.001-28.284c-7.812-7.811-20.475-7.81-28.284,0
        L256,227.716l-59.303-59.302c-7.809-7.811-20.474-7.811-28.284,0c-7.81,7.811-7.81,20.474,0.001,28.284L227.716,256
        l-59.302,59.302c-7.811,7.811-7.812,20.474-0.001,28.284c7.813,7.812,20.476,7.809,28.284,0L256,284.284l59.303,59.302
        c7.808,7.81,20.473,7.811,28.284,0C351.398,335.775,351.397,323.112,343.586,315.302z"
    />
  </svg>
);

const searchIcon = (
  <svg viewBox="-1 0 136 136.21852">
    <path
      d="M 93.148438 80.832031 C 109.5 57.742188 104.03125 25.769531 80.941406 9.421875 C 57.851562
        -6.925781 25.878906 -1.460938 9.53125 21.632812 C -6.816406 44.722656 -1.351562 76.691406 21.742188 93.039062
        C 38.222656 104.707031 60.011719 105.605469 77.394531 95.339844 L 115.164062 132.882812 C 119.242188 137.175781
        126.027344 137.347656 130.320312 133.269531 C 134.613281 129.195312 134.785156 122.410156 130.710938 118.117188
        C 130.582031 117.980469 130.457031 117.855469 130.320312 117.726562 Z M 51.308594 84.332031 C 33.0625 84.335938
        18.269531 69.554688 18.257812 51.308594 C 18.253906 33.0625 33.035156 18.269531 51.285156 18.261719 C 69.507812
        18.253906 84.292969 33.011719 84.328125 51.234375 C 84.359375 69.484375 69.585938 84.300781 51.332031 84.332031
        C 51.324219 84.332031 51.320312 84.332031 51.308594 84.332031 Z M 51.308594 84.332031 "
    />
  </svg>
);

const plusIcon = (
  <svg viewBox="0 0 448 448">
    <path
      d="m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0
        4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8
        8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0
        40-17.910156 40-40s-17.910156-40-40-40zm0 0"
    />
  </svg>
);

const minusIcon = (
  <svg viewBox="0 0 124 124">
    <path d="M112,50H12C5.4,50,0,55.4,0,62c0,6.6,5.4,12,12,12h100c6.6,0,12-5.4,12-12C124,55.4,118.6,50,112,50z" />
  </svg>
);

const statsIcon = (
  <svg viewBox="0 0 478 478">
    <path
      d="M119.5,187.75H17.1c-9.4,0-17,7.6-17.1,17.1v256c0,9.5,7.7,17.1,17.1,17.1h102.4c9.5,0,17.1-7.7,17.1-17.1v-256
        C136.6,195.35,128.9,187.75,119.5,187.75z"
    />
    <path
      d="M290.2,0.05H187.8c-9.4,0-17.1,7.6-17.1,17v443.8c0,9.5,7.7,17.1,17.1,17.1h102.4c9.5,0,17.1-7.7,17.1-17.1V17.15
        C307.3,7.65,299.6,0.05,290.2,0.05z"
    />
    <path
      d="M460.9,136.55H358.5c-9.5,0-17.1,7.6-17.1,17.1v307.2c0,9.5,7.7,17.1,17.1,17.1h102.4c9.5,0,17.1-7.7,17.1-17.1v-307.2
        C478,144.15,470.3,136.55,460.9,136.55z"
    />
  </svg>
);

const filterIcon = (
  <svg viewBox="0 0 512 512">
    <g>
      <path
        d="m187.304 252.717c8.045 11.642 5.64 1.941 5.64 233.997 0 20.766 23.692 32.651 40.39 20.23 71.353-53.797
          85.609-58.456 85.609-83.619 0-169.104-1.971-159.594 5.64-170.608l115.869-157.718h-369.016z"
      />
      <path
        d="m484.221 12.86c-4.14-7.93-12.26-12.86-21.199-12.86h-414.156c-19.305 0-30.664 21.777-19.59
          37.6.091.152-1.257-1.693 20.12 27.4h413.095c18.217-24.793 30.394-35.505 21.73-52.14z"
      />
    </g>
  </svg>
);

const downloadIcon = (
  <svg viewBox="0 0 512 512">
    <path
      d="M382.56,233.376C379.968,227.648,374.272,224,368,224h-64V16c0-8.832-7.168-16-16-16h-64c-8.832,0-16,7.168-16,16v208h-64
        c-6.272,0-11.968,3.68-14.56,9.376c-2.624,5.728-1.6,12.416,2.528,17.152l112,128c3.04,3.488,7.424,5.472,12.032,5.472
        c4.608,0,8.992-2.016,12.032-5.472l112-128C384.192,245.824,385.152,239.104,382.56,233.376z"
    />
    <path d="M432,352v96H80v-96H16v128c0,17.696,14.336,32,32,32h416c17.696,0,32-14.304,32-32V352H432z" />
  </svg>
);

const infoIcon = (
  <svg viewBox="0 0 45.999 45.999">
    <path
      d="M39.264,6.736c-8.982-8.981-23.545-8.982-32.528,0c-8.982,8.982-8.981,23.545,0,32.528c8.982,8.98,23.545,8.981,32.528,0
        C48.245,30.281,48.244,15.719,39.264,6.736z M25.999,33c0,1.657-1.343,3-3,3s-3-1.343-3-3V21c0-1.657,1.343-3,3-3s3,1.343,3,3V33z
        M22.946,15.872c-1.728,0-2.88-1.224-2.844-2.735c-0.036-1.584,1.116-2.771,2.879-2.771c1.764,0,2.88,1.188,2.917,2.771
        C25.897,14.648,24.746,15.872,22.946,15.872z"
    />
  </svg>
);

const layerIcon = (
  <svg viewBox="0 0 30 30">
    <path
      d="M26,9c0-0.419-0.259-0.776-0.625-0.924l-9.459-4.854h-0.018C15.627,3.085,15.325,3,15,3s-0.627,0.085-0.898,0.222h-0.018
        L4.625,8.076C4.259,8.224,4,8.581,4,9c0,0.416,0.255,0.772,0.617,0.923v0.02l9.474,4.838l0.009-0.004
        C14.372,14.915,14.674,15,15,15s0.628-0.085,0.9-0.223l0.009,0.004l9.474-4.838v-0.02C25.745,9.772,26,9.416,26,9z"
    />
    <path
      d="M25.375,14.076l-1.851-0.95c-2.905,1.487-6.87,3.511-6.916,3.528C16.093,16.884,15.553,17,15,17
        c-0.555,0-1.096-0.117-1.613-0.348c-0.044-0.016-4.005-2.038-6.911-3.526l-1.851,0.95C4.259,14.224,4,14.581,4,15
        c0,0.416,0.255,0.772,0.617,0.923v0.02l9.474,4.838l0.009-0.004C14.372,20.915,14.674,21,15,21s0.628-0.085,0.9-0.223l0.009,0.004
        l9.474-4.838v-0.02C25.745,15.772,26,15.416,26,15C26,14.581,25.741,14.224,25.375,14.076z"
    />
    <path
      d="M25.375,20.076l-1.851-0.95c-2.905,1.487-6.87,3.511-6.916,3.528C16.093,22.884,15.553,23,15,23
        c-0.555,0-1.096-0.117-1.613-0.348c-0.044-0.016-4.005-2.038-6.911-3.526l-1.851,0.95C4.259,20.224,4,20.581,4,21
        c0,0.416,0.255,0.772,0.617,0.923v0.02l9.474,4.838l0.009-0.004C14.372,26.915,14.674,27,15,27s0.628-0.085,0.9-0.223l0.009,0.004
        l9.474-4.838v-0.02C25.745,21.772,26,21.416,26,21C26,20.581,25.741,20.224,25.375,20.076z"
    />
  </svg>
);

const downIcon = (
  <svg viewBox="0 0 512 512">
    <path
      d="M98.9,184.7l1.8,2.1l136,156.5c4.6,5.3,11.5,8.6,19.2,8.6c7.7,0,14.6-3.4,19.2-8.6L411,187.1l2.3-2.6
        c1.7-2.5,2.7-5.5,2.7-8.7c0-8.7-7.4-15.8-16.6-15.8v0H112.6v0c-9.2,0-16.6,7.1-16.6,15.8C96,179.1,97.1,182.2,98.9,184.7z"
    />
  </svg>
);

const userIcon = (
  <svg viewBox="0 0 24 24">
    <circle cx="9" cy="5" r="5" />
    <path
      d="m11.534 20.8c-.521-.902-.417-2.013.203-2.8-.62-.787-.724-1.897-.203-2.8l.809-1.4c.445-.771 1.275-1.25 2.166-1.25.122 0
        .242.009.361.026.033-.082.075-.159.116-.237-.54-.213-1.123-.339-1.736-.339h-8.5c-2.619 0-4.75 2.131-4.75 4.75v3.5c0
        .414.336.75.75.75h10.899z"
    />
    <path
      d="m21.703 18.469c.02-.155.047-.309.047-.469
        0-.161-.028-.314-.047-.469l.901-.682c.201-.152.257-.43.131-.649l-.809-1.4c-.126-.218-.395-.309-.627-.211l-1.037.437c-.253-.193-.522-.363-.819-.487l-.138-1.101c-.032-.25-.244-.438-.496-.438h-1.617c-.252
        0-.465.188-.496.438l-.138 1.101c-.297.124-.567.295-.819.487l-1.037-.437c-.232-.098-.501-.008-.627.211l-.809
        1.4c-.126.218-.07.496.131.649l.901.682c-.02.155-.047.309-.047.469 0
        .161.028.314.047.469l-.901.682c-.201.152-.257.43-.131.649l.809
        1.401c.126.218.395.309.627.211l1.037-.438c.253.193.522.363.819.487l.138 1.101c.031.25.243.438.495.438h1.617c.252 0
        .465-.188.496-.438l.138-1.101c.297-.124.567-.295.819-.487l1.037.437c.232.098.501.008.627-.211l.809-1.401c.126-.218.07-.496-.131-.649zm-3.703
        1.531c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2z"
    />
  </svg>
);

const mineIcon = (
  <svg viewBox="0 0 512 512">
    <path
      d="M501.856,267.118c-11.311-38.168-31.9-73.311-59.634-101.848l8.224-8.224c5.768-5.768,5.768-15.12,0-20.888
        l-74.602-74.602c-5.767-5.768-15.12-5.768-20.888,0l-8.224,8.224c-28.538-27.735-63.681-48.324-101.849-59.635
        c-39.279-11.642-81.225-13.299-121.3-4.791c-6.758,1.435-11.619,7.361-11.703,14.27c-0.084,6.907,4.632,12.95,11.352,14.548
        l14.46,3.437c39.139,9.304,74.863,29.257,103.31,57.704l40.098,40.098l-4.476,4.476c-5.768,5.768-5.768,15.12,0,20.888
        l74.602,74.602c5.767,5.768,15.12,5.768,20.888,0l4.476-4.476l40.098,40.098c28.446,28.447,48.4,64.17,57.704,103.308l3.437,14.46
        c1.583,6.662,7.536,11.354,14.367,11.354c0.061,0,0.12,0,0.181-0.001c6.907-0.084,12.835-4.944,14.269-11.702
        C515.153,348.342,513.497,306.397,501.856,267.118z"
    />
    <path
      d="M260.211,186.14L4.326,442.025c-5.768,5.768-5.768,15.12,0,20.888l44.761,44.761c2.884,2.884,6.664,4.327,10.443,4.327
        c3.779,0,7.56-1.441,10.443-4.327l255.885-255.885L260.211,186.14z"
    />
  </svg>
);

const adminIcon = (
  <svg viewBox="0 0 20 20">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
  </svg>
);

const iconMap = {
  envelope: envelopeIcon,
  check: checkIcon,
  close: closeIcon,
  search: searchIcon,
  plus: plusIcon,
  minus: minusIcon,
  stats: statsIcon,
  filter: filterIcon,
  download: downloadIcon,
  info: infoIcon,
  layer: layerIcon,
  down: downIcon,
  user: userIcon,
  mine: mineIcon,
  admin: adminIcon,
};

const SvgIconContainer = styled.div`
  color: ${(props) => props.color};
  cursor: ${(props) => props.cursor};
  fill: ${(props) => props.color};
  height: ${(props) => props.size};
  max-height: ${(props) => props.size};
  max-width: ${(props) => props.size};
  padding: 2px;
  width: ${(props) => props.size};
  vertical-align: ${(props) => props.verticalAlign};

  &:hover {
    color: ${(props) => props.hoverColor};
    fill: ${(props) => props.hoverFill};
  }
`;
function SvgIcon({
  color,
  cursor,
  extraStyles,
  hoverColor,
  hoverFill,
  icon,
  onClick,
  size,
  verticalAlign,
}) {
  return (
    <SvgIconContainer
      color={color}
      cursor={cursor}
      hoverColor={hoverColor}
      hoverFill={hoverFill}
      size={size}
      verticalAlign={verticalAlign}
      onClick={onClick}
      style={{ ...extraStyles }}
    >
      {iconMap[icon]}
    </SvgIconContainer>
  );
}

SvgIcon.propTypes = {
  color: PropTypes.string,
  cursor: PropTypes.string,
  extraStyles: PropTypes.object,
  hoverColor: PropTypes.string,
  hoverFill: PropTypes.string,
  icon: PropTypes.oneOf(Object.keys(iconMap)).isRequired,
  onClick: PropTypes.func,
  size: PropTypes.string.isRequired,
  verticalAlign: PropTypes.string,
};

SvgIcon.defaultProps = {
  color: "currentColor",
  cursor: "pointer",
  extraStyles: {},
  verticalAlign: "middle",
};

export default SvgIcon;