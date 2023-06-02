import React from "react";

interface GMLogoProps {
  className: string;
}

function GMLogo(props: GMLogoProps) {
  return (
    <svg
      className={props?.className}
      viewBox='0 0 295.2 294.603'
    >
      <path d='M73.7 73.4L0 147.1l9.8 9.8C20.4 167.7 146.9 294 147.6 294.6c.2.2 14.6-13.8 31.9-31l31.6-31.3v-84.6l42.1-.2 42-.3-73.5-73.5C181.2 33.3 147.9.1 147.8 0c-.2-.2-33.5 32.9-74.1 73.4zm110.5 47.8l25 25-31 .3-31.1.2-.2 31.1-.3 31-30.8-30.7L85 147.4l5.8-6 31.3-31.3 25.4-25.4 5.9 5.7c3.2 3.2 17.1 17 30.8 30.8z'></path>
    </svg>
  );
}

export default GMLogo;
