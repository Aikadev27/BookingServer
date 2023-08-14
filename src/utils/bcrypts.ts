import * as bcrypt from 'bcrypt';
const saltRound = 10;

export async function encodePassword(rawPassword: string) {
  return bcrypt.hashSync(rawPassword, saltRound);
}
