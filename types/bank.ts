export interface Bank {
  id: string;
  name: string;
  code: string;
  country: string;
  region: string;
}

export interface GetBanksParams {
  region?: string;
  country?: string;
  search?: string;
}
