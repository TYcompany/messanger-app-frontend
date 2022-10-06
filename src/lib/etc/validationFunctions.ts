export function isValidEmail(inputString: string) {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(inputString);
}

export function isValidPhoneNumber(inputString: string) {
  return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(inputString);
}
