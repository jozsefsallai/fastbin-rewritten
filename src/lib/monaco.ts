import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";

export function initializeMonaco(monaco: Monaco) {
  // add Cave Story TSC support
  monaco.languages.register({ id: "tsc" });
  monaco.languages.setMonarchTokensProvider("tsc", {
    tokenizer: {
      root: [
        // events
        [/#.+/, "number"],

        // commands
        [/<([A-Z0-9+-]{3})/, "tag"],

        // arguments
        [/[V0-9][0-9]{3}/, "attribute.value"],

        // comments
        [/\/\/.+/, "comment"],
      ],
    },
  });

  // change TypeScript defaults
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: true,
    noSuggestionDiagnostics: true,
  });
}

export function registerEditorActions(
  editorInstance: editor.IStandaloneCodeEditor,
  monaco: Monaco,
) {
  editorInstance.addAction({
    id: "fastbin.toggleWordWrap",
    label: "Toggle Word Wrap",
    keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.KeyZ],
    run: (ed) => {
      const wordWrap = ed.getOption(monaco.editor.EditorOption.wordWrap);
      ed.updateOptions({ wordWrap: wordWrap === "on" ? "off" : "on" });
    },
  });
}
