import logoImg from '../../img/rooted-robotics.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'h-8',
  md: 'h-12',
  lg: 'h-16',
};

export function Logo({ size = 'md' }: LogoProps) {
  return <img src={logoImg} alt="Rooted Robotics" className={sizes[size]} />;
}
