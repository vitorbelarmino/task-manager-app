export function formatDateBR(date: string) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
}
