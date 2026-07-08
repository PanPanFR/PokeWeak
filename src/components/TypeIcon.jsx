export default function TypeIcon({ type, size = 20 }) {
  return (
    <img
      src={`/icons/types/${type.toLowerCase()}.svg`}
      alt={type}
      width={size}
      height={size}
      aria-hidden="true"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    />
  );
}
