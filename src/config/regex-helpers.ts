export const customRegex = {
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  phoneRegExp: /^(\+\d{1,3})?\d{10,14}$/,
  nameRegex: /^[a-zA-Z\u00C0-\u00FF\s]*$/, // ? Only letters
  cityRegex: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/,
  latamDniExp: /^\d{7,9}$/,
  streetNameRegex: /^[a-zA-Z0-9\u00C0-\u00FF ]+$/,
  alphaNumericRegex: /^[a-zA-Z0-9]*$/,
  numericRegex: /^[0-9]*$/,
};
