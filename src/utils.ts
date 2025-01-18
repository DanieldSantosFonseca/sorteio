export const getOrThrow = (value: string): string => {
  const envValue = process.env[value];
  if (!envValue) {
    throw new Error(`Environment variable ${value} is not defined.`);
  }
  return envValue;
};
