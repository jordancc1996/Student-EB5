import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  CheckCircle,
  CreditCard,
  DollarSign,
  FileText,
  Gift,
  GraduationCap,
  Home,
  Route,
  Shield,
  ShieldCheck,
  TrendingUp,
  UserCheck,
} from 'lucide-react';

const ICONS = {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  CheckCircle,
  CreditCard,
  DollarSign,
  FileText,
  Gift,
  GraduationCap,
  Home,
  Route,
  Shield,
  ShieldCheck,
  TrendingUp,
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
