const env = (key: string, isPublic: boolean = false): string => {
  key = key.replace(/[-\.]/g, '_').toUpperCase();

  if (isPublic) {
    return process.env[`NEXT_PUBLIC_${key}`];
  }

  return process.env[key];
};

export default env;
