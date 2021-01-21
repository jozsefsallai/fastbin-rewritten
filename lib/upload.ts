import languages from './languages';

interface KeyAndSecret {
  key: string;
  secret: string;
}

const getKeyWithExtension = (key: string, languageId: string): string => {
  if (languageId === 'plain') {
    return key;
  }

  const targetLanguage = Object.values(languages).find(l => l.id === languageId);

  if (!targetLanguage) {
    return key;
  }

  return `${key}.${targetLanguage.extension}`;
};

const upload = (contents: string, languageId: string): Promise<KeyAndSecret> => {
  return new Promise((resolve, reject) => {
    if (!contents.length) {
      return reject('Contents is too short.');
    }

    return fetch('/api/documents', {
      method: 'POST',
      headers: {
        Accept: 'text/plain',
        'Content-Type': 'text/plain'
      },
      credentials: 'same-origin',
      body: contents
    })
      .then(res => res.json())
      .then(json => {
        if (json.ok) {
          const key = getKeyWithExtension(json.key, languageId);
          return resolve({
            key,
            secret: json.secret
          });
        } else {
          return reject(json.error);
        }
      })
      .catch(err => {
        return reject(err);
      });
  });
};

export default upload;
