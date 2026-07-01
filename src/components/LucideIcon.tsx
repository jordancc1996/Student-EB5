import {
  ArrowRight,
  CheckCircle,
  DollarSign,
  Gift,
  GraduationCap,
  UserCheck,
} from 'lucide-react';

const ICONS = {
  ArrowRight,
  CheckCircle,
  DollarSign,
  Gift,
  GraduationCap,
  UserCheck,
} as const;

export type LucideIconName = keyof typeof ICONS;

interface LucideIconProps {
  name: LucideIconName;
  size?: number;
  className?: string;
}

/** Hookless Lucide icon for SSR in Astro pages (no client:* directive). */
const LucideIcon = ({ name, size, className }: LucideIconProps) => {
  const Icon = ICONS[name];
  return <Icon size={size} className={className} />;
};

export default LucideIcon;
