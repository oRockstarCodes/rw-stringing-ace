import {
  Award,
  Grip,
  Palette,
  Settings,
  Sparkles,
  Stamp,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Zap,
  Award,
  Wrench,
  Sparkles,
  Grip,
  Palette,
  Stamp,
  Settings,
};

interface ServiceIconProps {
  name: string;
  className?: string;
}

const ServiceIcon = ({ name, className }: ServiceIconProps) => {
  const Icon = iconMap[name] ?? Zap;
  return <Icon className={className} />;
};

export default ServiceIcon;
