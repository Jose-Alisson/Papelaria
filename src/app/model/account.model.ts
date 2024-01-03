import { SafeUrl } from "@angular/platform-browser";

export declare class Account {
  id:string;
  photo: SafeUrl;
  photoUrl: string;
  name: string;
  email:string;
  password: string;
  phone: string;
  typeAccount: string;
  tokenAccess: string;
}
