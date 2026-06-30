import { h } from 'preact';

export default function TypeIcon({ type, size = 20 }) {
  return (
    <img
      src={`/icons/types/${type.toLowerCase()}.svg`}
      alt={type}
      width={size}
      height={size}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    />
  );
}
