interface GMILogoProps {
  className: string;
}

function GMILogo(props:GMILogoProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      version='1.1'
      viewBox='0 0 28.7 28.7'
      xmlSpace='preserve'
    className={props.className}
    >
      <g
        fillOpacity='1'
        strokeDasharray='none'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeOpacity='1'
        transform='translate(-1.65 -1.65)'
      >
        <path
          fill='#f20d0d'
          stroke='none'
          strokeWidth='1'
          d='M12 6l4-4 14 14h-8z'
          vectorEffect='non-scaling-stroke'
        ></path>
        <path
          fill='#1eb464'
          stroke='none'
          strokeWidth='1'
          d='M6 12l14 14-4 4L2 16z'
          vectorEffect='non-scaling-stroke'
        ></path>
        <path
          fill='#fff'
          stroke='none'
          strokeWidth='1'
          d='M10 16l6-6-4-4-6 6zm6 6v-6h6v8l-2 2z'
          vectorEffect='non-scaling-stroke'
        ></path>
        <path
          fill='none'
          stroke='#000'
          strokeWidth='0.7'
          d='M16 2l14 14h-8l-6-6-6 6 6 6v-6h6v8l-6 6L2 16z'
        ></path>
      </g>
    </svg>
  );
}

export default GMILogo;

