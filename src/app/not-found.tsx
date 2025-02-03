"use client";

import { EditorView } from "@/components/editor/editor-view";

const ERROR_PAGE = `# Error 404

The requested page/snippet could not be found. Either it was never created, or
it got deleted from our database. If you're sure the snippet must be here,
contact me on GitHub: https://github.com/jozsefsallai

* To create a new snippet, press \`ctrl+i\`
`;

export default function NotFound() {
  return <EditorView contents={ERROR_PAGE} languageId="markdown" readOnly />;
}
