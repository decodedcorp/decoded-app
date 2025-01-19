import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group';
import { Label } from '@radix-ui/react-label';
import { useState } from 'react';

interface ContextAnswer {
  location: string;
  locationOther?: string;
  source: string;
  sourceOther?: string;
  person: string;
  personOther?: string;
  activity: string;
  activityOther?: string;
  style: string;
  styleOther?: string;
}

interface ContextStepSidebarProps {
  onAnswerChange: (answers: ContextAnswer) => void;
}

export function ContextStepSidebar({
  onAnswerChange,
}: ContextStepSidebarProps) {
  const [answers, setAnswers] = useState<ContextAnswer>({
    location: '',
    source: '',
    person: '',
    activity: '',
    style: '',
  });

  const handleAnswerChange = (
    question: keyof ContextAnswer,
    value: string,
    isOther = false
  ) => {
    const newAnswers = {
      ...answers,
      [question]: value,
      ...(isOther && { [`${question}Other`]: '' }),
    };
    setAnswers(newAnswers);
    onAnswerChange(newAnswers);
  };

  return (
    <div className="w-full flex flex-col h-full">
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="bg-[#1A1A1A] rounded-lg p-6 space-y-8">
          {/* Q1. Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Q1. 이 사진은 어디에서 촬영되었나요?
            </h3>
            <RadioGroup
              value={answers.location}
              onValueChange={(value) => handleAnswerChange('location', value)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="airport" id="location-1" />
                <Label htmlFor="location-1">공항</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="event" id="location-2" />
                <Label htmlFor="location-2">행사장</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="home" id="location-3" />
                <Label htmlFor="location-3">집</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="studio" id="location-4" />
                <Label htmlFor="location-4">스튜디오</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nature" id="location-5" />
                <Label htmlFor="location-5">자연</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="location-6" />
                <Label htmlFor="location-6">기타</Label>
                {answers.location === 'other' && (
                  <Input
                    className="ml-2 w-48"
                    value={answers.locationOther}
                    onChange={(e) =>
                      handleAnswerChange('locationOther', e.target.value)
                    }
                    placeholder="직접 입력"
                  />
                )}
              </div>
            </RadioGroup>
          </div>

          {/* Q2. Source */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Q2. 이 사진의 업로드 경로는 무엇인가요?
            </h3>
            <RadioGroup
              value={answers.source}
              onValueChange={(value) => handleAnswerChange('source', value)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sns" id="source-1" />
                <Label htmlFor="source-1">
                  SNS에서 가져옴 (예: 인스타그램, 트위터)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="personal" id="source-2" />
                <Label htmlFor="source-2">개인적으로 촬영한 사진</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="news" id="source-3" />
                <Label htmlFor="source-3">뉴스나 블로그에서 가져옴</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="source-4" />
                <Label htmlFor="source-4">기타</Label>
                {answers.source === 'other' && (
                  <Input
                    className="ml-2 w-48"
                    value={answers.sourceOther}
                    onChange={(e) =>
                      handleAnswerChange('sourceOther', e.target.value)
                    }
                    placeholder="직접 입력"
                  />
                )}
              </div>
            </RadioGroup>
          </div>

          {/* Q3. Person */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Q3. 이 사진에 등장하는 주요 인물은 누구인가요?
            </h3>
            <RadioGroup
              value={answers.person}
              onValueChange={(value) => handleAnswerChange('person', value)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="celebrity" id="person-1" />
                <Label htmlFor="person-1">연예인</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="influencer" id="person-2" />
                <Label htmlFor="person-2">인플루언서</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ordinary" id="person-3" />
                <Label htmlFor="person-3">일반인</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="person-4" />
                <Label htmlFor="person-4">기타</Label>
                {answers.person === 'other' && (
                  <Input
                    className="ml-2 w-48"
                    value={answers.personOther}
                    onChange={(e) =>
                      handleAnswerChange('personOther', e.target.value)
                    }
                    placeholder="직접 입력"
                  />
                )}
              </div>
            </RadioGroup>
          </div>

          {/* Q4. Activity */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Q4. 사진 속 인물의 활동은 무엇인가요?
            </h3>
            <RadioGroup
              value={answers.activity}
              onValueChange={(value) => handleAnswerChange('activity', value)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="travel" id="activity-1" />
                <Label htmlFor="activity-1">여행</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="activity-2" />
                <Label htmlFor="activity-2">일상 생활</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="event" id="activity-3" />
                <Label htmlFor="activity-3">공식 행사 참석</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="shooting" id="activity-4" />
                <Label htmlFor="activity-4">촬영 중</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="activity-5" />
                <Label htmlFor="activity-5">기타</Label>
                {answers.activity === 'other' && (
                  <Input
                    className="ml-2 w-48"
                    value={answers.activityOther}
                    onChange={(e) =>
                      handleAnswerChange('activityOther', e.target.value)
                    }
                    placeholder="직접 입력"
                  />
                )}
              </div>
            </RadioGroup>
          </div>

          {/* Q5. Style */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Q5. 사진 속 인물의 스타일을 설명해주세요.
            </h3>
            <RadioGroup
              value={answers.style}
              onValueChange={(value) => handleAnswerChange('style', value)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="casual" id="style-1" />
                <Label htmlFor="style-1">캐주얼</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="formal" id="style-2" />
                <Label htmlFor="style-2">포멀/정장</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sporty" id="style-3" />
                <Label htmlFor="style-3">스포티</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="trendy" id="style-4" />
                <Label htmlFor="style-4">패셔너블/트렌디</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="style-5" />
                <Label htmlFor="style-5">기타</Label>
                {answers.style === 'other' && (
                  <Input
                    className="ml-2 w-48"
                    value={answers.styleOther}
                    onChange={(e) =>
                      handleAnswerChange('styleOther', e.target.value)
                    }
                    placeholder="직접 입력"
                  />
                )}
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
