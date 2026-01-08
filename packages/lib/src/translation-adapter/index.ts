// Factory pattern
export { createTranslationAdapter } from "./factory";
export type {
  TranslationFactory,
  TranslationProviderComponent,
  UseListLanguagesHook,
  UseSelectedLanguageActionsHook,
  UseSelectedLanguageStoreHook,
  UseTranslationHook,
} from "./factory";

export {
  useSelectedLanguageActions,
  useSelectedLanguageStore,
} from "./selected-language.store";

export type { ITranslationAdapter, Language } from "./types";
