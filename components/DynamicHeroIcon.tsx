// Might be worth looking at https://github.com/naquiroz/heroicons-lookup#readme
import * as HeroIcons from "@heroicons/react/outline";

export type IconName = keyof typeof HeroIcons;
interface IconProps {
  icon: IconName;
  className?: string;
}

const DynamicHeroIcon = ({ icon, className }: IconProps): JSX.Element => {
  const SingleIcon = HeroIcons[icon];

  return (
    <SingleIcon
      className={`flex-shrink-0 w-8 h-8 text-gray-600 ${className}`}
      aria-hidden="true"
    />
  );
};

export default DynamicHeroIcon;
