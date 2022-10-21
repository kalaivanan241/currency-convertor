export type CurrencyType = {
  code: string;
  name: string;
  flag: string;
  symbol: string | boolean;
};

export type CurrencyMap = Record<string, CurrencyType>;
