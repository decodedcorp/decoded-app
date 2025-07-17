"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { networkManager } from "@/lib/network/network";
import { toast } from "sonner";
import { Loader2, Camera, X, CheckCircle } from "lucide-react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { useLocaleContext } from "@/lib/contexts/locale-context";

interface Agreement {
  is_consent: boolean;
  consent_at: string;
}

interface AgreementsResponse {
  terms_of_service: Agreement;
  privacy_policy: Agreement;
  marketing: Agreement;
  notification: Agreement;
  tracking: Agreement;
}

interface ProfileSettingsProps {
  userEmail: string | null;
  userNickname: string | null;
  currentProfileImage: string | null;
  onClose: () => void;
}

export function ProfileSettings({
  userEmail,
  userNickname,
  currentProfileImage,
  onClose,
}: ProfileSettingsProps) {
  const { t } = useLocaleContext();
  const [nickname, setNickname] = useState(userNickname || "");
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(
    currentProfileImage
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [marketingConsent, setMarketingConsent] = useState<boolean>(false);
  const [isLoadingAgreements, setIsLoadingAgreements] = useState(true);
  const [termsAgreement, setTermsAgreement] = useState<Agreement | null>(null);
  const [privacyAgreement, setPrivacyAgreement] = useState<Agreement | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("날짜 변환 오류:", error);
      return dateString;
    }
  };

  useEffect(() => {
    const fetchAgreements = async () => {
      if (typeof window === "undefined") return;

      const userDocId = window.sessionStorage.getItem("USER_DOC_ID");
      if (!userDocId) {
        console.error("User doc ID not found");
        setIsLoadingAgreements(false);
        return;
      }

      try {
        const response = await networkManager.request(
          `/user/${userDocId}/agreements`,
          "GET",
          null
        );

        if (response && response.data) {
          const agreements = response.data as AgreementsResponse;

          if (agreements.marketing) {
            setMarketingConsent(agreements.marketing.is_consent);
          }

          if (agreements.terms_of_service) {
            setTermsAgreement(agreements.terms_of_service);
          }

          if (agreements.privacy_policy) {
            setPrivacyAgreement(agreements.privacy_policy);
          }
        }
      } catch (error) {
        console.error("Failed to fetch agreements:", error);
        const consentValue = window.localStorage.getItem("MARKETING_CONSENT");
        setMarketingConsent(consentValue === "true");
      } finally {
        setIsLoadingAgreements(false);
      }
    };

    fetchAgreements();
  }, []);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("이미지 크기는 5MB 이하여야 합니다");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("이미지 파일만 업로드 가능합니다");
        return;
      }

      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        const base64 = base64String.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) {
      toast.error("닉네임을 입력해주세요");
      return;
    }
    setIsLoading(true);

    try {
      const userDocId = window.sessionStorage.getItem("USER_DOC_ID");
      if (!userDocId) {
        throw new Error("사용자 정보를 찾을 수 없습니다");
      }

      // 요청 객체 생성
      const requestBody: {
        aka: string;
        marketing: boolean;
        base64_profile_image?: string;
      } = {
        aka: nickname,
        marketing: marketingConsent,
      };

      if (imageFile) {
        const base64Image = await convertFileToBase64(imageFile);
        requestBody.base64_profile_image = base64Image;
      }

      await networkManager.request(
        `/user/${userDocId}/update-settings`,
        "PATCH",
        requestBody
      );

      toast.success("프로필이 업데이트되었습니다");
      onClose();

      window.location.reload();
    } catch (error) {
      console.error("프로필 업데이트 오류:", error);
      toast.error("프로필 업데이트 실패. 다시 시도해주세요");
    } finally {
      setIsLoading(false);
    }
  };

  const getInitial = () => {
    return nickname ? nickname.charAt(0).toUpperCase() : "D";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="flex flex-col items-center mb-6">
        <div
          className="relative group cursor-pointer mb-3"
          onClick={handleImageClick}
        >
          {profileImage ? (
            <div className="relative h-24 w-24 rounded-full overflow-hidden">
              <Image
                src={profileImage}
                alt="프로필 이미지"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </div>
          ) : (
            <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
              <span className="text-3xl text-white font-semibold">
                {getInitial()}
              </span>
              <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />

        <p className="text-xs text-white/60 max-w-xs text-center">
          클릭하여 프로필 이미지를 업로드하세요 (최대 5MB)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-white/80">
          이메일
        </Label>
        <Input
          id="email"
          type="email"
          value={userEmail || ""}
          disabled
          className="bg-gray-900 text-white/60 border-gray-800"
        />
        <p className="text-xs text-white/40">이메일은 변경할 수 없습니다</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nickname" className="text-white/80">
          닉네임
        </Label>
        <Input
          id="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="bg-gray-900 text-white border-gray-800 focus:border-[#eafd66] focus:ring-[#eafd66]/20"
          placeholder="닉네임을 입력하세요"
        />
      </div>

      <div className="pt-2 border-t border-gray-800">
        {termsAgreement && (
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label className="text-white/80">이용약관</Label>
              <p className="text-xs text-white/40">
                {termsAgreement.is_consent
                  ? `${formatDate(termsAgreement.consent_at)}에 동의함`
                  : "동의 정보 없음"}
              </p>
            </div>
            <Switch
              id="terms-consent"
              checked={termsAgreement.is_consent}
              disabled
              className="data-[state=checked]:bg-[#eafd66] data-[state=checked]:!border-[#eafd66] opacity-90"
            />
          </div>
        )}

        {privacyAgreement && (
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label className="text-white/80">개인정보처리방침</Label>
              <p className="text-xs text-white/40">
                {privacyAgreement.is_consent
                  ? `${formatDate(privacyAgreement.consent_at)}에 동의함`
                  : "동의 정보 없음"}
              </p>
            </div>
            <Switch
              id="privacy-consent"
              checked={privacyAgreement.is_consent}
              disabled
              className="data-[state=checked]:bg-[#eafd66] data-[state=checked]:!border-[#eafd66] opacity-90"
            />
          </div>
        )}

        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <Label htmlFor="marketing-consent" className="text-white/80">
              마케팅 수신동의
            </Label>
            <p className="text-xs text-white/40">
              이벤트 및 프로모션 알림을 이메일로 받습니다
            </p>
          </div>
          <Switch
            id="marketing-consent"
            checked={marketingConsent}
            onCheckedChange={setMarketingConsent}
            className="data-[state=checked]:bg-[#eafd66] data-[state=checked]:!border-[#eafd66]"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="border-gray-800 text-white/80 hover:bg-gray-900 hover:text-white"
        >
          취소
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#eafd66] hover:bg-[#dbed57] text-black font-medium"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              저장 중...
            </>
          ) : (
            "저장하기"
          )}
        </Button>
      </div>
    </form>
  );
}
