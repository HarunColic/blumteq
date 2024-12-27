import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import {rules} from "eslint-config-next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // Disable the rule completely
      "no-unused-vars": ["warn", {vars: "all", varsIgnorePattern: "^_", args: "none"}], // Ignore unused variables prefixed with '_'
    }
  }
];

export default eslintConfig;
