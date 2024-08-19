import { Product } from "./product";

export interface ProductFind extends Partial<Pick<Product, "userId">> {}
