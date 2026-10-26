import { FlatCompat } from "@eslint/eslintrc";
const compat = new FlatCompat({ baseDirectory: import.meta.dirname });
export default [...compat.extends("next/core-web-vitals", "next/typescript"), { ignores: [".next/**", "node_modules/**", ".validation/**", "next-env.d.ts"] }, { files: ["src/features/**", "src/components/**", "src/data/mockData.ts"], rules: { "@next/next/no-img-element": "off", "react/no-unescaped-entities": "off", "@typescript-eslint/no-explicit-any": "warn", "@typescript-eslint/no-unused-vars": "warn" } }];
