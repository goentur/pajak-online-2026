export interface TaxMeta {
  name: string;
  persentase: boolean;
  realisasi: boolean;
  target: boolean;
  endpoint: string;
  color: string;
}

export interface TaxDetail {
  name: string;
  target: number;
  realisasi: number;
  persentase: number;
}