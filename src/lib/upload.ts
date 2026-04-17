import { languages } from "./languages";

export interface UploadResult {
  /** URL path segment (may include a file extension for syntax highlighting). */
  key: string;
  /** Storage id without extension (same as API `key`). */
  storageKey: string;
  secret: string;
}

const getKeyWithExtension = (key: string, languageId: string): string => {
  if (languageId === "plain") {
    return key;
  }

  const targetLanguage = Object.values(languages).find(
    (l) => l.id === languageId,
  );

  if (!targetLanguage) {
    return key;
  }

  return `${key}.${targetLanguage.extension}`;
};

const upload = (
  contents: string,
  languageId: string,
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    if (!contents.length) {
      return reject("Contents is too short.");
    }

    return fetch("/api/documents", {
      method: "POST",
      headers: {
        Accept: "text/plain",
        "Content-Type": "text/plain",
      },
      credentials: "same-origin",
      body: contents,
    })
      .then((res) => res.json())
      .then((json) => {
        if (!json.ok) {
          return reject(json.error);
        }

        const storageKey = json.key as string;
        const key = getKeyWithExtension(storageKey, languageId);
        return resolve({
          key,
          storageKey,
          secret: json.secret,
        });
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

export default upload;
