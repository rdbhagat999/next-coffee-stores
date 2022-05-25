export interface CoffeeStore {
  id: number;
  name: string;
  imgUrl: string;
  websiteUrl: string;
  address: string;
  neighbourhood: string;
  voting: number;
}

export interface CoffeeStoreFields {
  id: string;
  name: string;
  address: string;
  neighbourhood: string;
  voting: number;
  imgUrl: string;
  recordId?: string;
}
