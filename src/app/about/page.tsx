import { EditorView } from "@/components/editor/editor-view";
import { env } from "@/lib/env";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { Suspense } from "react";

export default async function AboutPage() {
  const readmePath = path.join(process.cwd(), "README.md");

  let readme = await fs.readFile(readmePath, "utf-8");
  readme = readme.replace(
    '<a href="https://vercel.com/new/project?template=jozsefsallai/fastbin-rewritten"><img width="128" src="https://vercel.com/button" alt="One-click Deployment" /></a>',
    "https://vercel.com/new/project?template=jozsefsallai/fastbin-rewritten",
  );
  readme = readme.replace(
    '<a href="https://app.netlify.com/start/deploy?repository=https://github.com/jozsefsallai/fastbin-rewritten"><img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify" /></a>',
    "https://app.netlify.com/start/deploy?repository=https://github.com/jozsefsallai/fastbin-rewritten",
  );
  readme = readme.replace(
    "[ABUSE_REPORT_EMAIL]",
    env.ABUSE_REPORT_EMAIL ?? "[EMAIL NOT PROVIDED]",
  );

  return (
    <Suspense>
      <EditorView contents={readme} languageId="markdown" readOnly />
    </Suspense>
  );
}
