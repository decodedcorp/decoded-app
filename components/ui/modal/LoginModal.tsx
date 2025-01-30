import { ModalOverlay } from "./ModalOverlay";
import { pretendardBold } from "@/lib/constants/fonts";
import { useLocaleContext } from "@/lib/contexts/locale-context";
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  isClosing: boolean;
}

export function LoginModal({ isOpen, onClose, isClosing }: LoginModalProps) {
  const { t } = useLocaleContext();
  if (!isOpen && !isClosing) return null;

  return (
    <ModalOverlay onClose={onClose} isClosing={isClosing}>
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div
          className={`
            bg-[#101011] rounded-xl p-8 w-[90%] max-w-md
            transform transition-all duration-300 ease-in-out pointer-events-auto
            ${
              isClosing
                ? "opacity-0 translate-y-4 scale-95"
                : "opacity-100 translate-y-0 scale-100"
            }
          `}
        >
          <div className="flex flex-col items-center">
            <h2
              className={`${pretendardBold.className} text-2xl mb-6 text-white`}
            >
              로그인
            </h2>

            <button
              className="w-full bg-white text-black py-3 rounded-lg mb-4 
                hover:bg-gray-100 transition-colors"
              onClick={() => {
                onClose();
                alert("준비중입니다.");
              }}
            >
              Google로 계속하기
            </button>

            <button
              className="w-full bg-[#3B5998] text-white py-3 rounded-lg 
                hover:bg-[#344e86] transition-colors"
              onClick={() => {
                onClose();
                alert("준비중입니다.");
              }}
            >
              Facebook으로 계속하기
            </button>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}
