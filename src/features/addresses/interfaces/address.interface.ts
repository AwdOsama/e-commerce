import type { AddressFormValues } from "../schema/address.schema";

export interface UserAddress extends AddressFormValues {
  _id: string;
}

export interface AddressResponse {
  payload: {
    status?: string;
    results?: number;
    data: UserAddress[];
  };
}
