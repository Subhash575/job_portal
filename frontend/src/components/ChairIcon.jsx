// Small chair: purple when the seat is open, white when it is taken.
const ChairIcon = ({ open = false, className = 'w-5 h-[22px]' }) => (
  <svg aria-hidden="true" viewBox="0 0 20 22" className={className}>
    <rect
      x="4"
      y="2"
      width="12"
      height="11"
      rx="3"
      fill={open ? '#6d28d9' : '#ffffff'}
      stroke="#141414"
      strokeWidth="1.5"
    />
    <path
      d="M10 13v4M5 19h10"
      stroke="#141414"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export default ChairIcon;
