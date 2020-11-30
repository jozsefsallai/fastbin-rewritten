export interface DocumentKeyData {
  key: string;
  extension: string | null;
}

const handleKey = (raw: string): DocumentKeyData => {
  const components = raw.split('.');

  if (components.length < 2) {
    return {
      key: raw,
      extension: null
    };
  }

  const extension = components.pop();
  const key = components.join('.');

  return {
    key,
    extension
  };
};

export default handleKey;
