export const isEmailValid = (email: string) => /\S+@\S+\.\S+/.test(email);
export const isPasswordValid = (password: string) => password.length >= 6;
export const isAdult = (birthDate: string) => {
  const today = new Date();
  const birth = new Date(birthDate);
  const age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) return age - 1;
  return age >= 18;
};
