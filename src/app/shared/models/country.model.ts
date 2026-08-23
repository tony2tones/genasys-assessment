export interface Country {
  name: string;
  flag: string;
  alpha2Code: string;
}

export interface NationalityPrediction {
  countryCode: string;
  probability: number;
}
