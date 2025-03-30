import ProfileActions from './profile-actions';
import FilterOptions from './filter-options';

export default function ProfileHeader() {
  return (
    <header className="mb-8">
      {/* 상단 헤더: 타이틀과 프로필 버튼 */}
      <div className="flex justify-between items-center mb-8">
        {/* 페이지 타이틀 */}
        <h1 className="text-2xl font-bold">MY PAGE</h1>
        
        {/* 프로필 영역 */}
        <ProfileActions />
      </div>
      
      <FilterOptions />
    </header>
  );
} 