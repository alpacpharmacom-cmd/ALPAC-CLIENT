import React from 'react';
import { 
  Bone as LucideBone, 
  Brain as LucideBrain, 
  Sparkles as LucideSparkles, 
  Shield as LucideShield, 
  Baby as LucideBaby, 
  Moon as LucideMoon, 
  Activity as LucideActivity 
} from 'lucide-react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

// 1. Bone & Joints Health
export const BoneJointsIcon: React.FC<IconProps> = ({ size = 64, ...props }) => (
  <LucideBone size={size} strokeWidth={1.75} {...(props as any)} />
);

// 2. Brain & Focus
export const BrainFocusIcon: React.FC<IconProps> = ({ size = 64, ...props }) => (
  <LucideBrain size={size} strokeWidth={1.75} {...(props as any)} />
);

// 3. Beauty & Weight Loss
export const BeautyWeightLossIcon: React.FC<IconProps> = ({ size = 64, ...props }) => (
  <LucideSparkles size={size} strokeWidth={1.75} {...(props as any)} />
);

// 4. Immunity Support
export const ImmunitySupportIcon: React.FC<IconProps> = ({ size = 64, ...props }) => (
  <LucideShield size={size} strokeWidth={1.75} {...(props as any)} />
);

// 5. Kids & Family Health
export const KidsFamilyIcon: React.FC<IconProps> = ({ size = 64, ...props }) => (
  <LucideBaby size={size} strokeWidth={1.75} {...(props as any)} />
);

// 6. Relaxation & Sleep
export const RelaxationSleepIcon: React.FC<IconProps> = ({ size = 64, ...props }) => (
  <LucideMoon size={size} strokeWidth={1.75} {...(props as any)} />
);

// 7. Digestive & Gut Health
export const DigestiveGutIcon: React.FC<IconProps> = ({ size = 64, ...props }) => (
  <LucideActivity size={size} strokeWidth={1.75} {...(props as any)} />
);

interface HealthGoalIconWrapperProps extends IconProps {
  goal: string;
}

export const HealthGoalIcon: React.FC<HealthGoalIconWrapperProps> = ({ goal, ...props }) => {
  const normalized = goal.toLowerCase();

  if (normalized.includes('bone') || normalized.includes('joint')) {
    return <BoneJointsIcon {...props} />;
  }
  if (normalized.includes('brain') || normalized.includes('focus')) {
    return <BrainFocusIcon {...props} />;
  }
  if (normalized.includes('beauty') || normalized.includes('weight')) {
    return <BeautyWeightLossIcon {...props} />;
  }
  if (normalized.includes('immun')) {
    return <ImmunitySupportIcon {...props} />;
  }
  if (normalized.includes('kid') || normalized.includes('famil')) {
    return <KidsFamilyIcon {...props} />;
  }
  if (normalized.includes('sleep') || normalized.includes('relax')) {
    return <RelaxationSleepIcon {...props} />;
  }
  if (normalized.includes('digest') || normalized.includes('gut')) {
    return <DigestiveGutIcon {...props} />;
  }

  // Fallback
  return (
    <LucideActivity size={props.size || 64} strokeWidth={2} {...(props as any)} />
  );
};
