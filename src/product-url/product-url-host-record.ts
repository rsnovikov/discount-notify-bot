import { ProductUrlTypes } from "./product-url-types";

// TODO: ?move to the db
export const productUrlHostRecord: Record<ProductUrlTypes, string[]> = {
  [ProductUrlTypes.GLOBUS]: ["online.globus.ru", "www.globus.ru"],
};
