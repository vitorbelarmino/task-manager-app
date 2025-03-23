import * as Yup from "yup";
export const createTaskSchema = Yup.object().shape({
  userId: Yup.string().required("Usuário é obrigatório"),
  title: Yup.string().required("Título é obrigatório"),
  description: Yup.string().required("Descrição é obrigatória"),
});
