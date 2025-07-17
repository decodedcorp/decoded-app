"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { MapPin, ArrowLeft, User, Link } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocaleContext } from "@/lib/contexts/locale-context";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/style";

export interface ContextAnswer {
  location: string;
  source?: string;
}

export interface ContextStepSidebarProps {
  onAnswerChange: (answer: ContextAnswer) => void;
  onSubmit?: () => void;
  username?: string;
  userImageUrl?: string;
  isMobile?: boolean;
  modalType?: "request" | "style";
}

export function ContextStepSidebar({
  onAnswerChange,
  onSubmit,
  username = "kiyorib",
  userImageUrl,
  isMobile = false,
  modalType = "request",
}: ContextStepSidebarProps) {
  const { t } = useLocaleContext();

  type StepType = "location" | "source";
  const [step, setStep] = useState<StepType>("location");

  const [answers, setAnswers] = useState<ContextAnswer>({ location: "" });
  const [editingSourceId, setEditingSourceId] = useState<string | null>(null);
  const [sourceInput, setSourceInput] = useState("");
  const [sheetHeight, setSheetHeight] = useState<number>(isMobile ? 30 : 100);
  const [isDragging, setIsDragging] = useState(false);

  type SheetPosition = "collapsed" | "middle" | "expanded";
  const [sheetPosition, setSheetPosition] = useState<SheetPosition>("middle");

  useEffect(() => {
    setEditingSourceId(null);
    setSourceInput("");
  }, [step]);

  useEffect(() => {
    if (step === "location") {
      const newAnswers = { ...answers, source: undefined };
      setAnswers(newAnswers);
      onAnswerChange(newAnswers);
    }
  }, [step]);

  const locationOptions = [
    {
      value: "airport",
      label: t.request.steps.context.questions.location.options.airport,
    },
    {
      value: "concert",
      label: t.request.steps.context.questions.location.options.concert,
    },
    {
      value: "event",
      label: t.request.steps.context.questions.location.options.event,
    },
    {
      value: "casual",
      label: t.request.steps.context.questions.location.options.casual,
    },
    {
      value: "studio",
      label: t.request.steps.context.questions.location.options.studio,
    },
  ];

  const sourceOptions = [
    {
      value: "sns",
      label: t.request.steps.context.questions.source.options.sns,
    },
    {
      value: "personal",
      label: t.request.steps.context.questions.source.options.personal,
    },
    {
      value: "news",
      label: t.request.steps.context.questions.source.options.news,
    },
  ];

  const handleLocationClick = (value: string) => {
    if (value === answers.location) {
      const newAnswers = { ...answers, location: "" };
      setAnswers(newAnswers);
      onAnswerChange(newAnswers);
    } else {
      const newAnswers = { ...answers, location: value, source: undefined };
      setAnswers(newAnswers);
      onAnswerChange(newAnswers);
      setStep("source");
    }
  };

  const handleSourceClick = (value: string) => {
    if (value === answers.source && editingSourceId !== value) {
      const newAnswers = { ...answers, source: undefined };
      setAnswers(newAnswers);
      onAnswerChange(newAnswers);
      setEditingSourceId(null);
      return;
    }

    const hasCustomInput =
      answers.source &&
      answers.source.startsWith(value) &&
      answers.source !== value;

    setEditingSourceId(value);

    if (hasCustomInput) {
      setSourceInput(answers.source || "");
    } else {
      setSourceInput("");
    }

    if (!hasCustomInput) {
      const newAnswers = { ...answers, source: undefined };
      setAnswers(newAnswers);
      onAnswerChange(newAnswers);
    }
  };

  const handleSourceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSourceInput(value);

    const currentOption = editingSourceId || "";
    const newSource = value ? `${currentOption}:${value}` : undefined;

    const newAnswers = { ...answers, source: newSource };
    setAnswers(newAnswers);
    onAnswerChange(newAnswers);
  };

  const handleSourceInputBlur = () => {
    if (!sourceInput.trim()) {
      setEditingSourceId(null);
      const newAnswers = { ...answers, source: undefined };
      setAnswers(newAnswers);
      onAnswerChange(newAnswers);
    } else {
      setEditingSourceId(null);

      const currentOption = editingSourceId || "";
      const newSource = `${currentOption}:${sourceInput}`;

      const newAnswers = { ...answers, source: newSource };
      setAnswers(newAnswers);
      onAnswerChange(newAnswers);
    }
  };

  const handleDrag = (info: any) => {
    if (!isMobile) return;

    const newHeight = Math.max(
      20,
      Math.min(90, sheetHeight - info.delta.y * 0.2)
    );
    setSheetHeight(newHeight);
  };

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => {
    setIsDragging(false);

    if (sheetHeight < 25) {
      setSheetHeight(20);
      setSheetPosition("collapsed");
    } else if (sheetHeight > 60) {
      setSheetHeight(80);
      setSheetPosition("expanded");
    } else {
      setSheetHeight(42);
      setSheetPosition("middle");
    }
  };

  const toggleSheetHeight = () => {
    if (sheetPosition !== "expanded") {
      setSheetHeight(80);
      setSheetPosition("expanded");
    } else {
      setSheetHeight(42);
      setSheetPosition("middle");
    }
  };

  const handleBackdropClick = () => {
    if (sheetPosition === "expanded") {
      setSheetHeight(42);
      setSheetPosition("middle");
    } else {
      setSheetHeight(20);
      setSheetPosition("collapsed");
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted with values:", answers);

    const submittedAnswers = answers.source
      ? answers
      : { ...answers, source: undefined };

    onAnswerChange(submittedAnswers);

    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <>
      {isMobile && (
        <div
          className="fixed top-16 inset-x-0 bottom-0 bg-black/30 z-30"
          style={{
            opacity: sheetPosition === "collapsed" ? 0 : 0.3,
            transition: "opacity 0.3s ease",
          }}
          onClick={handleBackdropClick}
        />
      )}

      <motion.div
        className={cn(
          "w-full h-full flex flex-col bg-[#1A1A1A]",
          isMobile &&
            "fixed bottom-0 left-0 right-0 rounded-t-2xl shadow-lg z-40"
        )}
        style={
          isMobile
            ? {
                height: `${sheetHeight}vh`,
                transition: isDragging
                  ? "none"
                  : "height 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }
            : undefined
        }
        initial={isMobile ? { y: "100%" } : undefined}
        animate={isMobile ? { y: 0 } : undefined}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        {isMobile && (
          <motion.div
            className="h-10 w-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing py-3 bg-[#1A1A1A]"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.1}
            onDrag={handleDrag}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onTap={toggleSheetHeight}
          >
            <div className="w-14 h-1 bg-zinc-600 rounded-full mb-1"></div>
            {sheetPosition !== "expanded" && (
              <span className="text-xs text-zinc-500 mt-1">펼쳐서 보기</span>
            )}
          </motion.div>
        )}

        <div
          className={cn(
            "px-5 py-4 border-b border-zinc-800/50 flex items-center shrink-0",
            isMobile && "py-3"
          )}
        >
          <div className="h-9 w-9 mr-3 rounded-full overflow-hidden flex items-center justify-center bg-zinc-800 text-zinc-300">
            {userImageUrl ? (
              <img
                src={userImageUrl}
                alt={username}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-6 w-6" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white/80">
              {username}
            </span>
            <span className="text-xs text-zinc-400">Public · Private</span>
          </div>
        </div>

        <div
          className={cn(
            "flex-1 flex flex-col overflow-auto",
            isMobile ? "p-3" : "p-4"
          )}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              className="flex flex-col flex-1"
              initial={{ opacity: 0, x: step === "location" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: step === "location" ? 20 : -20 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className={cn(
                  "flex justify-between mb-5 shrink-0",
                  isMobile && "mb-3"
                )}
              >
                <div className="flex gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#EAFD66]/10 shrink-0">
                    <MapPin className="w-5 h-5 text-[#EAFD66]" />
                  </div>
                  <div>
                    <h3 className="text-white/80 font-medium text-sm">
                      {step === "location"
                        ? t.request.steps.context.questions.location.title
                        : t.request.steps.context.questions.source.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {step === "location"
                        ? "필수 입력 사항입니다"
                        : "선택 사항입니다"}
                    </p>
                  </div>
                </div>
                {step === "source" && (
                  <button
                    onClick={() => setStep("location")}
                    className="p-1.5 rounded-full hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-300 shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
              </div>

              {step === "location" ? (
                <div className="flex-1 space-y-2.5 overflow-y-auto overflow-x-hidden">
                  {locationOptions.map((option) => (
                    <motion.div
                      key={option.value}
                      onClick={() => handleLocationClick(option.value)}
                      className={`flex items-center space-x-3 ${
                        isMobile ? "p-3" : "p-3.5"
                      } rounded-lg transition-all cursor-pointer overflow-hidden
                        ${
                          answers.location === option.value
                            ? "bg-[#EAFD66]/10 border border-[#EAFD66]/30"
                            : "hover:bg-zinc-800/50 border border-transparent"
                        }`}
                      whileTap={{ scale: 0.995 }}
                    >
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center
                        ${
                          answers.location === option.value
                            ? "border-[#EAFD66]"
                            : "border-zinc-600"
                        } border`}
                      >
                        {answers.location === option.value && (
                          <div className="w-2 h-2 rounded-full bg-[#EAFD66]" />
                        )}
                      </div>
                      <Label className="flex-1 cursor-pointer text-sm text-zinc-300">
                        {option.label}
                      </Label>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 space-y-2.5 overflow-y-auto overflow-x-hidden">
                  {sourceOptions.map((option) => {
                    const hasCustomInput =
                      answers.source &&
                      answers.source.startsWith(`${option.value}:`) &&
                      answers.source !== option.value;
                    const customInputValue = hasCustomInput
                      ? answers.source?.split(":")?.[1] || ""
                      : "";

                    return (
                      <motion.div
                        key={option.value}
                        onClick={() => handleSourceClick(option.value)}
                        className={`flex items-center space-x-3 ${
                          isMobile ? "p-3" : "p-3.5"
                        } rounded-lg transition-all cursor-pointer overflow-hidden
                          ${
                            answers.source === option.value
                              ? "bg-[#EAFD66]/10 border border-[#EAFD66]/30"
                              : hasCustomInput
                              ? "bg-[#EAFD66]/5 border border-[#EAFD66]/20"
                              : "hover:bg-zinc-800/50 border border-transparent"
                          }`}
                        whileTap={{ scale: 0.995 }}
                      >
                        {editingSourceId === option.value ? (
                          <div className="flex items-center w-full pl-1">
                            <Link className="h-4 w-4 mr-2 text-zinc-400" />
                            <Input
                              autoFocus
                              value={sourceInput}
                              onChange={handleSourceInputChange}
                              onBlur={handleSourceInputBlur}
                              className={cn(
                                "flex-1 bg-zinc-800/50 border-zinc-700 text-zinc-300 text-xs",
                                isMobile ? "h-7 text-xs" : "h-8"
                              )}
                              placeholder={`${option.label} 관련 URL을 입력하세요`}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        ) : (
                          <>
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center
                              ${
                                answers.source === option.value ||
                                hasCustomInput
                                  ? "border-[#EAFD66]"
                                  : "border-zinc-600"
                              } border`}
                            >
                              {(answers.source === option.value ||
                                hasCustomInput) && (
                                <div className="w-2 h-2 rounded-full bg-[#EAFD66]" />
                              )}
                            </div>
                            <Label className="flex-1 cursor-pointer text-sm text-zinc-300">
                              {option.label}
                              {hasCustomInput && (
                                <span
                                  className={cn(
                                    "ml-2 text-xs text-[#EAFD66]/70",
                                    isMobile && "block mt-1 ml-0 text-[10px]"
                                  )}
                                >
                                  ✓{" "}
                                  {customInputValue.substring(
                                    0,
                                    isMobile ? 20 : 15
                                  )}
                                  {customInputValue.length >
                                  (isMobile ? 20 : 15)
                                    ? "..."
                                    : ""}
                                </span>
                              )}
                            </Label>
                          </>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}

              <div
                className={cn(
                  "mt-5 pt-4 border-t border-zinc-800/40 flex justify-end shrink-0",
                  isMobile && "mt-3 pt-3"
                )}
              >
                {step === "location" && answers.location && (
                  <button
                    onClick={() => setStep("source")}
                    className={cn(
                      "px-5 py-2.5 text-xs font-medium rounded-lg bg-[#EAFD66] text-[#1A1A1A] hover:bg-[#EAFD66]/90 transition-colors",
                      isMobile && "px-4 py-2"
                    )}
                  >
                    다음 단계
                  </button>
                )}

                {step === "source" && (
                  <button
                    onClick={handleSubmit}
                    className={cn(
                      "px-5 py-2.5 text-xs font-medium rounded-lg bg-[#EAFD66] text-[#1A1A1A] hover:bg-[#EAFD66]/90 transition-colors",
                      isMobile && "px-4 py-2"
                    )}
                  >
                    {answers.source ? "완료" : "건너뛰기"}
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
