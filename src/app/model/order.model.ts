import { Account } from "./account.model"
import { Address } from "./address.model"
import { Amount } from "./amount.model"
import { Payment } from "./payment.model"

export declare class Order{
  id: string
  account: Account
  amounts: Amount[]
  payment: Payment | null
  status: string
  dateCriation: Date
  address: Address | null
}
