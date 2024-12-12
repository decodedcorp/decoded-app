'use client';

import MenuIcon from '@mui/icons-material/Menu';

interface HamburgerProps {
  openSidebar: () => void;
}

function Hamburger({ openSidebar }: HamburgerProps) {
  return (
    <MenuIcon
      className="cursor-pointer text-white hover:text-white/80 transition-colors"
      onClick={openSidebar}
    />
  );
}

export default Hamburger;
