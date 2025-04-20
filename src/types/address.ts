
export type AddressRecord = {
  TRACKNUM: string;
  ZIP: string;
  CITY: string;
  STREET: string;
  TYPE: string;
  LOW: string;
  HIGH: string;
  PPC: string;
  ALT_PPC?: string;
  FS?: string;
  RISK_CATEGORY?: string;
};

export type SearchResults = {
  exactMatches: AddressRecord[];
  nearMatches: AddressRecord[];
};
