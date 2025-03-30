export default function ProfileActions() {
  const user = {
    name: 'kiyori',
  };

  return (
    <div className="flex items-center gap-4">
      {/* 프로필 버튼 */}
      <div className="bg-zinc-800 rounded-full px-4 py-2 flex items-center">
        <span className="font-bold mr-1">{user.name?.charAt(0)}</span>
      </div>

      {/* 사용자 정보 */}
      <div className="bg-zinc-800 rounded-full px-4 py-2 flex flex-col items-center text-xs">
        <span className="font-bold">{user.name}</span>
      </div>

      {/* 프로필 보기 버튼 */}
      <div className="bg-zinc-800 rounded-full px-4 py-2 text-sm">
        프로필 보기
      </div>
    </div>
  );
}
