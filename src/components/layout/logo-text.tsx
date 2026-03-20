interface LogoTextProps {
  size?: 'sm' | 'lg';
}

export function LogoText({ size = 'lg' }: LogoTextProps) {
  return (
    <span
      className={`font-display font-bold text-accent ${
        size === 'sm' ? 'text-2xl' : 'text-4xl'
      }`}
    >
      {"Funnghy's World"}
    </span>
  );
}
