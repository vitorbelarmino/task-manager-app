import * as Yup from "yup";
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .matches(emailRegex, "Email deve ser um email válido")
    .required("Email é obrigatório"),
  password: Yup.string()
    .min(4, "Senha deve ter no mínimo 4 caracteres")
    .required("Senha é obrigatório"),
});

export const registerSchema = loginSchema.concat(
  Yup.object().shape({
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Senhas não coincidem")
      .min(4, "Senha deve ter no mínimo 4 caracteres")
      .required("Confirme sua senha"),
  }),
);
