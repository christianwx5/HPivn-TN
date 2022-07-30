import * as bcrypt from 'bcrypt';

/**
 * Crea hash para el password usando bcrypt
 * @param password String
 * @returns string type
 */
export const HashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

/**
 * Comparación de hash creado para el password
 * utilizando bcrypt
 * @param hash String
 * @param password String
 * @returns boolean type
 */
export const ComparePassword = async (
  hash: string,
  password: string,
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
};
