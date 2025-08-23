import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Ignore generated files and build outputs
  {
    ignores: [
      "src/api/generated/**",
      ".next/**",
      "node_modules/**", 
      "dist/**",
      "build/**",
      "out/**",
      "*.tsbuildinfo",
      "coverage/**"
    ]
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // 기존 배포 경고 설정
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "react/no-unescaped-entities": "warn",
      "@next/next/no-img-element": "error", // img 대신 next/image 사용 강제
      "react-hooks/exhaustive-deps": "warn",
      
      // CLAUDE.md 가이드라인 적용
      // 파일 길이 제한 (100줄)
      "max-lines": ["error", { "max": 100, "skipBlankLines": true, "skipComments": true }],
      
      // 함수 매개변수 제한 (5개)
      "max-params": ["error", 5],
      
      // 복잡도 제한
      "complexity": ["error", 10],
      
      // 중첩 깊이 제한
      "max-depth": ["error", 4],
      
      // 함수 길이 제한
      "max-lines-per-function": ["error", { "max": 50, "skipBlankLines": true, "skipComments": true }],
      
      // React 성능 최적화
      "react/jsx-no-bind": ["error", { "allowArrowFunctions": true }],
      "react/jsx-no-constructed-context-values": "error",
      
      // 네이밍 컨벤션
      "@typescript-eslint/naming-convention": [
        "error",
        {
          "selector": "variable",
          "format": ["camelCase", "PascalCase", "UPPER_CASE"]
        },
        {
          "selector": "function",
          "format": ["camelCase", "PascalCase"]
        },
        {
          "selector": "typeLike",
          "format": ["PascalCase"]
        }
      ],
      
      // Import 정리
      "import/no-unused-modules": "warn",
      "import/order": [
        "error",
        {
          "groups": [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index"
          ],
          "newlines-between": "always"
        }
      ]
    },
  },
];

export default eslintConfig;
