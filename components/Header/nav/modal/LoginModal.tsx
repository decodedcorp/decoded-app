import { AccountSection } from "./sections/AccountSection";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-[calc(100%+12px)] w-[400px]">
      {/* Modal */}
      <div className="animate-in slide-in-from-top-2 duration-200">
        <div className="bg-gradient-to-b from-[#1A1A1A] to-black/95 rounded-2xl overflow-hidden shadow-2xl border border-white/5">
          {/* Header */}
          <div className="relative px-8 pt-14 text-center">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 hover:bg-white/5 transition-colors"
            >
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Decorative Elements */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#EAFD66]/20 to-transparent" />
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#EAFD66]/10 rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div className="flex flex-col">
            <div className="flex-1">
              <Tabs defaultValue="home">
                <div className="px-6">
                  <TabsContent value="home" className="min-h-[200px]">
                    <h2 className="text-lg font-bold text-white mb-4">홈</h2>
                    <AccountSection onClose={onClose} />
                  </TabsContent>
                  <TabsContent value="requests" className="min-h-[200px]">
                    <h2 className="text-lg font-bold text-white mb-4">요청</h2>
                    {/* 요청 탭 내용 */}
                  </TabsContent>
                  <TabsContent value="offers" className="min-h-[200px]">
                    <h2 className="text-lg font-bold text-white mb-4">제공</h2>
                    {/* 제공 탭 내용 */}
                  </TabsContent>
                  <TabsContent value="likes" className="min-h-[200px]">
                    <h2 className="text-lg font-bold text-white mb-4">
                      좋아요
                    </h2>
                    {/* 좋아요 탭 내용 */}
                  </TabsContent>
                  <TabsContent value="notifications" className="min-h-[200px]">
                    <h2 className="text-lg font-bold text-white mb-4">알림</h2>
                    {/* 알림 탭 내용 */}
                  </TabsContent>
                </div>

                {/* Tabs Navigation - 하단에 고정 */}
                <div className="border-t border-white/5 mt-8">
                  <div className="px-6 py-4">
                    <TabsList className="w-full h-12 bg-black/20 p-1 rounded-xl">
                      <TabsTrigger
                        value="home"
                        className="flex-1 rounded-lg text-xs font-medium data-[state=active]:bg-[#EAFD66]/10 data-[state=active]:text-[#EAFD66] text-gray-400"
                      >
                        홈
                      </TabsTrigger>
                      <TabsTrigger
                        value="requests"
                        className="flex-1 rounded-lg text-xs font-medium data-[state=active]:bg-[#EAFD66]/10 data-[state=active]:text-[#EAFD66] text-gray-400"
                      >
                        요청
                      </TabsTrigger>
                      <TabsTrigger
                        value="offers"
                        className="flex-1 rounded-lg text-xs font-medium data-[state=active]:bg-[#EAFD66]/10 data-[state=active]:text-[#EAFD66] text-gray-400"
                      >
                        제공
                      </TabsTrigger>
                      <TabsTrigger
                        value="likes"
                        className="flex-1 rounded-lg text-xs font-medium data-[state=active]:bg-[#EAFD66]/10 data-[state=active]:text-[#EAFD66] text-gray-400"
                      >
                        좋아요
                      </TabsTrigger>
                      <TabsTrigger
                        value="notifications"
                        className="flex-1 rounded-lg text-xs font-medium data-[state=active]:bg-[#EAFD66]/10 data-[state=active]:text-[#EAFD66] text-gray-400"
                      >
                        알림
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </div>
              </Tabs>
            </div>

            {/* Bottom Decoration */}
            <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#EAFD66]/5 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
