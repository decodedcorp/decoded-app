"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera } from "lucide-react";

export function UserSettingsForm() {
  // 사용자 데이터 상태
  const [userData, setUserData] = useState({
    nickname: "",
    email: "",
    gender: "",
    bio: "",
    website: "",
    username: "",
  });

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    if (typeof window !== "undefined") {
      const email = window.sessionStorage.getItem("USER_EMAIL") || "";
      const nickname = window.sessionStorage.getItem("USER_NICKNAME") || "";
      
      setUserData(prev => ({
        ...prev,
        email,
        nickname,
        username: "", // 예시 데이터
        gender: "", // 예시 데이터
        bio: "", // 예시 데이터
        website: "", // 예시 데이터
      }));
    }
  }, []);

  // 폼 필드 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  // 라디오 버튼(성별) 변경 핸들러
  const handleGenderChange = (value: string) => {
    setUserData(prev => ({ ...prev, gender: value }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: API 연결은 나중에 구현
      console.log("제출된 데이터:", userData);
      alert("프로필이 저장되었습니다.");
    } catch (error) {
      console.error("프로필 저장 오류:", error);
      alert("저장 실패: 프로필을 저장하는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 이니셜 생성 (닉네임의 첫 글자)
  const getInitial = () => {
    return userData.nickname ? userData.nickname.charAt(0).toUpperCase() : "U";
  };

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="profile" className="text-sm">기본 정보</TabsTrigger>
        <TabsTrigger value="account" className="text-sm">계정 설정</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card className="border-white/5 bg-black/30">
          <CardHeader>
            <CardTitle>프로필 정보</CardTitle>
            <div className="text-sm text-gray-400">개인 정보와 프로필을 수정합니다</div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 프로필 사진 */}
              <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 mb-8">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-white/20">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 h-full w-full flex items-center justify-center text-white text-2xl font-semibold">
                      {getInitial()}
                    </div>
                  </div>
                  <button 
                    type="button"
                    className="absolute bottom-0 right-0 bg-white/10 hover:bg-white/20 transition-colors p-2 rounded-full"
                    onClick={() => alert("준비 중인 기능입니다.")}
                  >
                    <Camera className="h-4 w-4 text-white" />
                  </button>
                </div>

                <div className="space-y-2 flex-1">
                  <h3 className="text-sm font-medium text-white">프로필 사진</h3>
                  <p className="text-xs text-white/60">
                    이미지 파일은 5MB 이하의 JPG, PNG 또는 GIF 형식이어야 합니다.
                  </p>
                </div>
              </div>

              {/* 기본 정보 폼 */}
              <div className="grid gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nickname">이름</Label>
                    <Input 
                      id="nickname" 
                      name="nickname" 
                      value={userData.nickname} 
                      onChange={handleChange}
                      className="bg-black/30 border-white/10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender">성별</Label>
                    <RadioGroup 
                      value={userData.gender} 
                      onValueChange={handleGenderChange}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="cursor-pointer">남성</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="cursor-pointer">여성</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other" className="cursor-pointer">기타</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">소개</Label>
                  <Input 
                    id="bio" 
                    name="bio" 
                    placeholder="간단한 소개를 입력하세요" 
                    value={userData.bio} 
                    onChange={handleChange}
                    className="bg-black/30 border-white/10"
                  />
                  <p className="text-xs text-white/60">최대 200자까지 입력할 수 있습니다.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">웹사이트</Label>
                  <Input 
                    id="website" 
                    name="website" 
                    placeholder="https://" 
                    value={userData.website} 
                    onChange={handleChange}
                    className="bg-black/30 border-white/10"
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <div className="flex justify-end border-t border-white/5 pt-6 p-6">
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
              className="bg-[#EAFD66] text-black hover:bg-[#c9d855]"
            >
              {isLoading ? "저장 중..." : "변경사항 저장"}
            </Button>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="account">
        <Card className="border-white/5 bg-black/30">
          <CardHeader>
            <CardTitle>계정 설정</CardTitle>
            <div className="text-sm text-gray-400">사용자 계정 정보를 관리합니다</div>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input 
                  id="email" 
                  name="email" 
                  value={userData.email} 
                  disabled 
                  className="bg-black/30 border-white/10 text-white/60"
                />
                <p className="text-xs text-white/60">
                  이메일은 로그인에 사용되며 변경할 수 없습니다.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">사용자 이름</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-black/40 border border-r-0 border-white/10 rounded-l-md text-white/60">
                    @
                  </span>
                  <Input 
                    id="username" 
                    name="username" 
                    value={userData.username} 
                    onChange={handleChange}
                    className="bg-black/30 border-white/10 rounded-l-none"
                  />
                </div>
                <p className="text-xs text-white/60">
                  영문, 숫자, 밑줄(_)만 사용할 수 있습니다.
                </p>
              </div>
            </form>
          </CardContent>
          <div className="flex justify-end border-t border-white/5 pt-6 p-6">
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
              className="bg-[#EAFD66] text-black hover:bg-[#c9d855]"
            >
              {isLoading ? "저장 중..." : "변경사항 저장"}
            </Button>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
} 