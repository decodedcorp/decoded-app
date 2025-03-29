"use client";

import React from "react";
import { cn } from "@/lib/utils/style";
import { pretendardMedium, pretendardBold } from "@/lib/constants/fonts";
import { useLocaleContext } from "@/lib/contexts/locale-context";

function PrivacyPolicy() {
  const { t } = useLocaleContext();
  const privacyPolicy = t.privacyPolicy;

  return (
    <div className="min-h-screen bg-black text-white/80 py-40">
      <div className="max-w-3xl mx-auto px-4">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1
              className={cn(
                pretendardBold.className,
                "text-3xl text-[#EAFD66]"
              )}
            >
              {privacyPolicy.title}
            </h1>
            <p className="text-zinc-400">{privacyPolicy.description}</p>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {Object.values(privacyPolicy.sections).map((section, index) => (
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

                  {section.description && (
                    <div className="space-y-2">
                      {section.description.map((desc: string, i: number) => (
                        <p key={i}>{desc}</p>
                      ))}
                    </div>
                  )}

                  {section.items && (
                    <div className="space-y-6">
                      {Object.entries(
                        section.items as Record<
                          string,
                          { title: string; list?: string[] }
                        >
                      ).map(([key, item]) => (
                        <div key={key} className="space-y-2">
                          <h3 className="font-medium">{item.title}</h3>
                          {item.list && (
                            <ul className="list-disc pl-4 space-y-1">
                              {item.list.map((listItem, i) => (
                                <li key={i} className="text-zinc-400">
                                  {listItem}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {section.measures && (
                    <div className="space-y-6">
                      {Object.entries(
                        section.measures as Record<
                          string,
                          { title: string; list: string[] }
                        >
                      ).map(([key, measure]) => (
                        <div key={key} className="space-y-2">
                          <h3 className="font-medium">{measure.title}</h3>
                          <ul className="list-disc pl-4 space-y-1">
                            {measure.list.map((item, i) => (
                              <li key={i} className="text-zinc-400">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>

          {/* Footer */}
          <div className="pt-8 border-t border-zinc-800">
            <p className="text-sm text-zinc-500 text-center">
              {privacyPolicy.sections.changes.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
