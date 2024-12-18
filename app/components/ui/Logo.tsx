import Image from 'next/image';

const Logo = () => {
  return (
    <Image
      src={logoWhite}
      alt="Logo"
      width={100}
      height={40}
      style={{ width: 'auto', height: 'auto' }}
      priority
    />
  );
};

export default Logo; 