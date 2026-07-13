import { getTypeIconSrc } from '../utils/typeIcon';

export default function TypeIcon({ type, size = 20 }) {
  return (
    <img
      src={getTypeIconSrc(type)}
      alt={type}
      width={size}
      height={size}
      aria-hidden="true"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    />
  );
}
