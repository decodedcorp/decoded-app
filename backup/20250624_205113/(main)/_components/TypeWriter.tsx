"use client";

import { TypeAnimation } from 'react-type-animation';

export function TypeWriter() {
  return (
    <TypeAnimation
      sequence={[
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        1000,
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        1000,
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        1000,
      ]}
      wrapper="span"
      speed={50}
      repeat={Infinity}
    />
  );
} 