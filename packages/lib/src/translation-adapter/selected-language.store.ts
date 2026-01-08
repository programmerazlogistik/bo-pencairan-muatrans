import { zustandDevtools } from "@muatmuat/lib/utils";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Language, SelectedLanguageState } from "./types";

export type {
  ITranslationAdapter,
  Language,
  SelectedLanguageState,
  TranslationContextValue,
  TranslationParams,
} from "./types";

// Create selected language store
export const useSelectedLanguageStore = create<SelectedLanguageState>()(
  zustandDevtools(
    persist(
      (set) => ({
        selectedLanguage: null,
        actions: {
          setSelectedLanguage: (language) =>
            set({
              selectedLanguage: language,
            }),
        },
      }),
      {
        name: "locale-selection",
        // Only persist selectedLanguage, not actions
        partialize: (state) => ({ selectedLanguage: state.selectedLanguage }),
      }
    ),
    {
      name: "locale-selection",
    }
  )
);

type UseSelectedLanguageActionsHook = () => {
  setSelectedLanguage: (language: Language) => void;
};

// Hook to access selected language actions with explicit type annotation
export const useSelectedLanguageActions: UseSelectedLanguageActionsHook = () =>
  useSelectedLanguageStore((s) => s.actions);
