import Image from "next/image";

const LOGO_URL =
  "https://galaxy-prod.tlcdn.com/view/user_321HpBS0N3wNsExhmni8Y9Gx4VV/3ca80491175345cc8307898f4730727c.png";

export function WarriorMark({ size = 40 }: { size?: number }) {
  return (
    <Image
      src={LOGO_URL}
      alt="Degen Warrior logo"
      width={size}
      height={size}
      className="rounded-full"
      style={{ width: size, height: size }}
    />
  );
}
