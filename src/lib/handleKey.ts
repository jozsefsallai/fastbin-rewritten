export interface DocumentKeyData {
  key: string;
  extension?: string;
}

const handleKey = (raw: string): DocumentKeyData => {
  const components = raw.split(".");

  if (components.length < 2) {
    return {
      key: raw,
    };
  }

  const extension = components.pop();
  const key = components.join(".");

  return {
    key,
    extension,
  };
};

export default handleKey;
