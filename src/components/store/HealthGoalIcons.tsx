import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

// 1. Bone & Joints Health
export const BoneJointsIcon: React.FC<IconProps> = ({ size = 64, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Bones meeting at joint */}
    <path d="M32 10v14c0 2-2 4-4 4s-4-2-4-4V10c0-2 1.8-3 4-3s4 1 4 3z" />
    <path d="M32 54V40c0-2 2-4 4-4s4 2 4 4v14c0 2-1.8 3-4 3s-4-1-4-3z" />
    {/* Joint capsule / cap */}
    <path d="M22 32c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8z" />
    {/* Joint gap line */}
    <path d="M24 32h12" />
    {/* Radiating health lines */}
    <path d="M12 28l4 2-4 2" />
    <path d="M52 28l-4 2 4 2" />
    <path d="M16 18l3 3" />
    <path d="M48 18l-3 3" />
  </svg>
);

// 2. Brain & Focus
export const BrainFocusIcon: React.FC<IconProps> = ({ size = 64, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Head outline */}
    <path d="M20 48c0 4.4 3.6 8 8 8h8c4.4 0 8-3.6 8-8v-2.5c0-1.8.8-3.5 2.2-4.6A16 16 0 0 0 48 30c0-8.8-7.2-16-16-16s-16 7.2-16 16c0 4.8 2.1 9.3 5.8 12.4 1.4 1.1 2.2 2.8 2.2 4.6V48z" />
    {/* Brain lobe representation in center */}
    <path d="M32 18c-3 0-5 2-5 5s2.5 4.5 5 4.5V18z" />
    <path d="M32 18c3 0 5 2 5 5s-2.5 4.5-5 4.5V18z" />
    <path d="M32 27.5c-4 0-6 2-6 5s3.5 4.5 6 4.5V27.5z" />
    <path d="M32 27.5c4 0 6 2 6 5s-3.5 4.5-6 4.5V27.5z" />
    {/* Spark / Focus lines */}
    <path d="M32 6v4" />
    <path d="M14 18l3 3" />
    <path d="M50 18l-3 3" />
    <path d="M8 30h4" />
    <path d="M52 30h4" />
  </svg>
);

// 3. Beauty & Weight Loss
export const BeautyWeightLossIcon: React.FC<IconProps> = ({ size = 64, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Elegant Face profile facing left */}
    <path d="M34 14c-8 0-14 6-14 14 0 5 2.5 9.5 6.5 12-2 1.5-3.5 4-4.2 7-.5 2.1-.3 4.3.5 6.3l.7 1.7" />
    {/* Nose and Lips outline */}
    <path d="M20 28h-2.5c-.8 0-1.5.5-1.8 1.2L15 31c-.3.7.2 1.5 1 1.5H18c1 0 1.5.5 1.5 1v1.5c0 .8-.7 1.5-1.5 1.5h-1" />
    {/* Leaf / Botanical Beauty element */}
    <path d="M38 12c4 0 10 3 12 9s-2 12-8 12c-4 0-10-3-12-9s2-12 8-12z" />
    <path d="M30 21c4 4 8 4 12 0" />
    {/* Sleek waistline/body curve */}
    <path d="M46 38c2 4 3 9 3 14 0 3-1 5-3 5H36c-2 0-3-2-3-5 0-5 1-10 3-14" />
  </svg>
);

// 4. Immunity Support
export const ImmunitySupportIcon: React.FC<IconProps> = ({ size = 64, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Shield */}
    <path d="M32 10c10 0 18 4 18 4v16c0 11-8 20-18 24C22 50 14 41 14 34V14s8-4 18-4z" />
    {/* Plus sign inside */}
    <path d="M32 20v14M25 27h14" />
    {/* Flexing muscle lines / shield aura */}
    <path d="M8 26c1-5 4-9 8-11" />
    <path d="M56 26c-1-5-4-9-8-11" />
    <path d="M9 36c1.5 4 4.5 7.5 8 9.5" />
    <path d="M55 36c-1.5 4-4.5 7.5-8 9.5" />
  </svg>
);

// 5. Pregnancy & Maternal Care
export const PregnancyMaternalIcon: React.FC<IconProps> = ({ size = 64, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Silhouette of mother / pregnant profile */}
    {/* Head */}
    <circle cx="30" cy="16" r="5" />
    {/* Back, pregnant belly, and legs */}
    <path d="M26 25c2 6 2 12 0 18-2 6-4 10-4 14" />
    <path d="M32 26c4 2 6 6 6 10 0 5-3 9-7 11" />
    {/* Arms holding belly gently */}
    <path d="M30 29c3 1.5 5 4 5 7.5 0 3-1.5 5-3.5 6.5" />
    {/* Hearts radiating love */}
    <path d="M42 22c-1.5-1.5-3 .5-3 2 0-1.5-1.5-3.5-3-2-1.5 1.5.5 3 3 5 2.5-2 4.5-3.5 3-5z" fill="none" />
    <path d="M46 32c-1-1-2 .3-2 1.3 0-1-1-2.3-2-1.3-1 1 .3 2 2 3.3 1.7-1.3 3-2.3 2-3.3z" fill="none" />
  </svg>
);

// 6. Kids & Family Health
export const KidsFamilyIcon: React.FC<IconProps> = ({ size = 64, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Father (Left) */}
    <circle cx="20" cy="20" r="5" />
    <path d="M12 36v-6c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6v6" />
    
    {/* Mother (Right) */}
    <circle cx="44" cy="22" r="5" />
    <path d="M36 38v-6c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6v6" />

    {/* Child (Center) */}
    <circle cx="32" cy="34" r="3.5" />
    <path d="M26 48v-4c0-2.2 1.8-4 4-4h4c2.2 0 4 1.8 4 4v4" />

    {/* Holding hands lines / unified ground */}
    <path d="M16 48h32" />
  </svg>
);

// 7. Fitness & Sports Nutrition
export const FitnessSportsIcon: React.FC<IconProps> = ({ size = 64, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Muscular torso / chest and abs line art */}
    {/* Neck */}
    <path d="M26 12h12v4H26z" />
    {/* Shoulders and biceps */}
    <path d="M26 14C18 15 12 18 10 24c-2 6 2 12 6 12 3 0 5-2 6-4" />
    <path d="M38 14c8 1 14 4 16 10 2 6-2 12-6 12-3 0-5-2-6-4" />
    {/* Torso / Abs */}
    <path d="M22 32h20v18H22z" />
    {/* Chest lines */}
    <path d="M22 22c5 2 15 2 20 0" />
    <path d="M32 20v12" />
    {/* Abs lines */}
    <path d="M27 38h10M27 44h10" />
    {/* Shield aura behind */}
    <circle cx="32" cy="32" r="28" strokeDasharray="4 4" opacity="0.3" />
  </svg>
);

// 8. Relaxation & Sleep
export const RelaxationSleepIcon: React.FC<IconProps> = ({ size = 64, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Profile Sleeping Head outline */}
    <path d="M20 44c0 4.4 3.6 8 8 8h8c4.4 0 8-3.6 8-8v-2.5c0-1.8.8-3.5 2.2-4.6A16 16 0 0 0 48 26c0-8.8-7.2-16-16-16s-16 7.2-16 16c0 4.8 2.1 9.3 5.8 12.4 1.4 1.1 2.2 2.8 2.2 4.6V44z" />
    {/* Closed eye line */}
    <path d="M27 28q3 2 6 0" />
    {/* Crescent Moon inside head */}
    <path d="M36 16a6 6 0 0 0 5 7.5A6 6 0 1 1 36 16z" fill="none" />
    {/* Stars / Sleep zZZ */}
    <path d="M12 16l1.5 1.5M13.5 16l-1.5 1.5M52 14h3l-3 3h3" />
  </svg>
);

// 9. Digestive & Gut Health
export const DigestiveGutIcon: React.FC<IconProps> = ({ size = 64, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Stomach outline */}
    <path d="M38 12c-4 0-8 3-10 6-2-3-6-6-10-6-6 0-10 5-10 11s8 14 14 16v1" />
    {/* Intestines loop in center */}
    <path d="M22 40c-2.2 0-4 1.8-4 4s1.8 4 4 4h4c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4" />
    <path d="M42 40c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4c-2.2 0-4 1.8-4 4s1.8 4 4 4h4" />
    {/* Stomach outline - continuation */}
    <path d="M28 29c4 4 10 5 14 2 5-3 6-9 4-13s-6-7-10-6v1" />
    {/* Small checkmark in circle showing digestive health */}
    <circle cx="32" cy="24" r="5" />
    <path d="M30 24l1.5 1.5L34 22" />
  </svg>
);

// 10. Energy & Vitality
export const EnergyVitalityIcon: React.FC<IconProps> = ({ size = 64, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Heart outline */}
    <path d="M32 50L17.5 35.5A10.6 10.6 0 0 1 17.5 20c4-4 10.5-4 14.5 0s10.5 4 14.5 0 10.5-4 14.5 0a10.6 10.6 0 0 1 0 15.5L32 50z" />
    {/* Pulse line / ECG inside heart */}
    <path d="M22 30h4l2-6 3 12 2-9 2 3h5" />
    {/* Radiant sparks */}
    <path d="M32 8v4M12 18l3 2M52 18l-3 2" />
  </svg>
);

// 11. Hydration & Electrolytes
export const HydrationElectrolytesIcon: React.FC<IconProps> = ({ size = 64, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Water droplet */}
    <path d="M32 10C32 10 16 28 16 38c0 8.8 7.2 16 16 16s16-7.2 16-16C48 28 32 10 32 10z" />
    {/* Fluid rings / wave inside */}
    <path d="M20 40c4-2 8-2 12 0s8 2 12 0" />
    {/* Electrolytes sparkles / charges inside and outside */}
    <circle cx="32" cy="30" r="1.5" fill="currentColor" />
    <path d="M32 46v2M25 45l1.5-1.5M39 45l-1.5-1.5" />
    <path d="M12 24a4 4 0 0 1 8 0" />
    <path d="M44 24a4 4 0 0 1 8 0" />
  </svg>
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
  if (normalized.includes('pregnan') || normalized.includes('matern') || normalized.includes('mother')) {
    return <PregnancyMaternalIcon {...props} />;
  }
  if (normalized.includes('kid') || normalized.includes('famil')) {
    return <KidsFamilyIcon {...props} />;
  }
  if (normalized.includes('fit') || normalized.includes('sport') || normalized.includes('nutr')) {
    return <FitnessSportsIcon {...props} />;
  }
  if (normalized.includes('sleep') || normalized.includes('relax')) {
    return <RelaxationSleepIcon {...props} />;
  }
  if (normalized.includes('digest') || normalized.includes('gut')) {
    return <DigestiveGutIcon {...props} />;
  }
  if (normalized.includes('energ') || normalized.includes('vital')) {
    return <EnergyVitalityIcon {...props} />;
  }
  if (normalized.includes('hydrat') || normalized.includes('electrol')) {
    return <HydrationElectrolytesIcon {...props} />;
  }

  // Fallback
  return (
    <svg
      width={props.size || 64}
      height={props.size || 64}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
};
