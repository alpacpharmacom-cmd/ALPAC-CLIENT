import React from 'react';
import { 
  Bone as LucideBone, 
  Brain as LucideBrain, 
  Sparkles as LucideSparkles, 
  Shield as LucideShield, 
  Baby as LucideBaby, 
  Moon as LucideMoon, 
  Activity as LucideActivity,
  Leaf as LucideLeaf,
  Footprints as LucideFootprints,
  Wind as LucideWind,
  Smile as LucideSmile,
  Scissors as LucideScissors,
  Droplet as LucideDroplet,
  Dumbbell as LucideDumbbell,
  Sparkle as LucideSparkle,
  Waves as LucideWaves,
  Sun as LucideSun,
  Droplets as LucideDroplets,
  Hourglass as LucideHourglass,
  Heart as LucideHeart
} from 'lucide-react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

interface HealthGoalIconWrapperProps extends IconProps {
  goal: string;
}

export const HealthGoalIcon: React.FC<HealthGoalIconWrapperProps> = ({ goal, ...props }) => {
  const normalized = goal.toLowerCase();

  // Nutrients Goals
  if (normalized.includes('bone') || normalized.includes('joint')) {
    return <LucideBone size={props.size || 64} strokeWidth={1.75} {...(props as any)} />;
  }
  if (normalized.includes('brain') || normalized.includes('focus')) {
    return <LucideBrain size={props.size || 64} strokeWidth={1.75} {...(props as any)} />;
  }
  if (normalized.includes('beauty') || normalized.includes('weight')) {
    return <LucideSparkles size={props.size || 64} strokeWidth={1.75} {...(props as any)} />;
  }
  if (normalized.includes('immun')) {
    return <LucideShield size={props.size || 64} strokeWidth={1.75} {...(props as any)} />;
  }
  if (normalized.includes('kid') || normalized.includes('famil')) {
    return <LucideBaby size={props.size || 64} strokeWidth={1.75} {...(props as any)} />;
  }
  if (normalized.includes('sleep') || normalized.includes('relax')) {
    return <LucideMoon size={props.size || 64} strokeWidth={1.75} {...(props as any)} />;
  }
  if (normalized.includes('digest') || normalized.includes('gut')) {
    return <LucideActivity size={props.size || 64} strokeWidth={1.75} {...(props as any)} />;
  }

  // Skin Care Concerns
  if (normalized.includes('oily') || normalized.includes('combined')) {
    return <LucideDroplets size={props.size || 64} strokeWidth={1.75} {...(props as any)} />;
  }
  if (normalized.includes('dry skin') || (normalized === 'dry skin')) {
    return <LucideDroplet size={props.size || 64} strokeWidth={1.75} {...(props as any)} />;
  }
  if (normalized.includes('anti-aging') || normalized.includes('aging')) {
    return <LucideHourglass size={props.size || 64} strokeWidth={1.75} {...(props as any)} />;
  }
  if (normalized.includes('brightening') || normalized.includes('even tone')) {
    return <LucideSparkles size={props.size || 64} strokeWidth={1.75} {...(props as any)} />;
  }
  if (normalized.includes('body care')) {
    return <LucideHeart size={props.size || 64} strokeWidth={1.75} {...(props as any)} />;
  }
  if (normalized.includes('sunscreen') || normalized.includes('sunscreens')) {
    return <LucideSun size={props.size || 64} strokeWidth={1.75} {...(props as any)} />;
  }
  if (normalized.includes('healing')) {
    return <LucideLeaf size={props.size || 64} strokeWidth={1.75} {...(props as any)} />;
  }
  if (normalized.includes('foot')) {
    return <LucideFootprints size={props.size || 64} strokeWidth={1.75} {...(props as any)} />;
  }
  if (normalized.includes('diodrant') || normalized.includes('deodorant')) {
    return <LucideWind size={props.size || 64} strokeWidth={1.75} {...(props as any)} />;
  }

  // Hair Care Concerns
  if (normalized.includes('hair loss')) {
    return <LucideScissors size={props.size || 64} strokeWidth={1.75} {...(props as any)} />;
  }
  if (normalized.includes('dandruff')) {
    return <LucideSparkle size={props.size || 64} strokeWidth={1.75} {...(props as any)} />;
  }
  if (normalized.includes('dry') || normalized.includes('damaged')) {
    return <LucideDroplet size={props.size || 64} strokeWidth={1.75} {...(props as any)} />;
  }

  // Oral Care Concerns
  if (normalized.includes('tooth paste') || normalized.includes('toothpaste')) {
    return <LucideSmile size={props.size || 64} strokeWidth={1.75} {...(props as any)} />;
  }
  if (normalized.includes('mouse wash') || normalized.includes('mouthwash') || normalized.includes('mouth wash')) {
    return <LucideDroplet size={props.size || 64} strokeWidth={1.75} {...(props as any)} />;
  }
  if (normalized.includes('fresh breath')) {
    return <LucideWind size={props.size || 64} strokeWidth={1.75} {...(props as any)} />;
  }

  // Muscles Concerns
  if (normalized.includes('pain relief')) {
    return <LucideActivity size={props.size || 64} strokeWidth={1.75} {...(props as any)} />;
  }
  if (normalized.includes('muscle recovery')) {
    return <LucideDumbbell size={props.size || 64} strokeWidth={1.75} {...(props as any)} />;
  }

  // Anti Scar Concerns
  if (normalized.includes('scar')) {
    return <LucideSparkle size={props.size || 64} strokeWidth={1.75} {...(props as any)} />;
  }
  if (normalized.includes('stretch')) {
    return <LucideWaves size={props.size || 64} strokeWidth={1.75} {...(props as any)} />;
  }

  // Fallback
  return (
    <LucideActivity size={props.size || 64} strokeWidth={2} {...(props as any)} />
  );
};
