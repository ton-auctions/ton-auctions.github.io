import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';


export default tseslint.config({
  ignores: [
    "src/protocol/tact_*.ts",
    "src/protocol/wallet_v5.ts",
  ],
  extends: [
    eslint.configs.recommended,
    tseslint.configs.recommended,
    // tseslint.configs.recommendedTypeCheckedOnly,
    tseslint.configs.stylistic,
  ],
  // languageOptions: {
  //   parserOptions: {
  //     projectService: true,
  //     tsconfigRootDir: import.meta.dirname,
  //   },
  // },
});
