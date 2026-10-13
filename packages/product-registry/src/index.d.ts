import type { RegistryEntryV1, RegistryLockV1 } from "@web-temify/product-contracts";

export interface ProductFilters {
  readonly kind?: RegistryEntryV1["kind"];
  readonly tier?: RegistryEntryV1["tier"];
  readonly maturity?: RegistryEntryV1["maturity"];
  readonly query?: string;
}

export declare function assertRegistryLock(registry: RegistryLockV1): RegistryLockV1;
export declare function listProducts(registry: RegistryLockV1, filters?: ProductFilters): RegistryEntryV1[];
export declare function getProductByKey(registry: RegistryLockV1, productKey: string): RegistryEntryV1 | undefined;
export declare function getRegistrySummary(registry: RegistryLockV1): RegistryLockV1["counts"];
