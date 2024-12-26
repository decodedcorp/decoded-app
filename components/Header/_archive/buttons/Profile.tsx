'use client';

import PersonIcon from '@mui/icons-material/Person';

function Profile({ openLoginModal }: { openLoginModal: () => void }) {
  return (
    <PersonIcon
      className="cursor-pointer text-white mr-4"
      onClick={openLoginModal}
    />
  );
}

export default Profile;
