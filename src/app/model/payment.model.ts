import { Account } from "./account.model";

export declare class Payment {
  id: string;
  status: string;
  typePay: string;
  value: number;
  account: Account | null;
}
