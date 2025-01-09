import { HeroServer } from './hero-server';
import { HeroClient } from './hero-client';

export function Hero() {
  return (
    <HeroServer>
      <HeroClient />
    </HeroServer>
  );
}
