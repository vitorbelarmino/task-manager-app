import * as Yup from "yup";

type ValidationError = {
  [key: string]: string;
};
export function validateErrorsYup(error: Yup.ValidationError): ValidationError {
  const validationErrors: { [key: string]: string } = {};
  error.inner.forEach((err) => {
    if (err.path) {
      validationErrors[err.path] = err.message;
    }
  });
  return validationErrors;
}
