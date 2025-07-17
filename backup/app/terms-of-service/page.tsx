"use client";

import React from "react";
import { cn } from "@/lib/utils/style";
import { pretendardMedium, pretendardBold } from "@/lib/constants/fonts";
import { useLocaleContext } from "@/lib/contexts/locale-context";

function TermsOfService() {
  const { t } = useLocaleContext();
  const terms = t.termsOfService;

  return (
    <div className="min-h-screen bg-black text-white/80 py-40">
      <div className="max-w-3xl mx-auto px-4">
        <div className="space-y-12">
          {/* 헤더 */}
          <div className="text-center space-y-4">
            <h1
              className={cn(
                pretendardBold.className,
                "text-3xl text-[#EAFD66]"
              )}
            >
              {terms.title}
            </h1>
            <p className="text-zinc-400">{terms.description}</p>
          </div>

          {/* 섹션들 */}
          <div className="space-y-10">
            {Object.values(terms.sections).map((section, index) => (
              <section key={index} className="space-y-4">
                <h2
                  className={cn(
                    pretendardMedium.className,
                    "text-xl text-[#EAFD66]"
                  )}
                >
                  {section.title}
                </h2>
                <div className="prose prose-invert max-w-none space-y-4">
                  {section.content && <p>{section.content}</p>}

                  {section.terms && (
                    <div className="space-y-4">
                      {(
                        section.terms as { term: string; definition: string }[]
                      ).map((term, i) => (
                        <div key={i} className="pl-4">
                          <p className="font-medium">{term.term}</p>
                          <p className="text-zinc-400">{term.definition}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.items && (
                    <div className="space-y-4">
                      {(
                        section.items as (
                          | string
                          | {
                              subtitle?: string;
                              content?: string;
                              list?: string[];
                            }
                        )[]
                      ).map((item, i) => (
                        <div key={i} className="pl-4">
                          {typeof item === "string" ? (
                            <p>{item}</p>
                          ) : (
                            <div className="space-y-2">
                              {item.subtitle && (
                                <h3 className="font-medium">{item.subtitle}</h3>
                              )}
                              {item.content && <p>{item.content}</p>}
                              {item.list && (
                                <ul className="list-disc pl-4 space-y-1">
                                  {item.list.map((listItem, j) => (
                                    <li key={j} className="text-zinc-400">
                                      {listItem}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>

          {/* 푸터 */}
          <div className="pt-8 border-t border-zinc-800">
            <p className="text-sm text-zinc-500 text-center">
              {terms.sections.appendix.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;
