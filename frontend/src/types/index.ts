export interface Book {
  id: number;
  titulo: string;
  autor: string;
  data_leitura: string;
  avaliacao: number | null;
  resenha: string | null;
  userId: string;
}

export interface User {
  username: string;
  nome: string;
  tipo: string;
  status?: string;
  quant_acesso?: number;
}
