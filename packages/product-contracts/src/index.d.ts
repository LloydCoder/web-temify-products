export type ProductKind = "standalone" | "launch-kit";
export type ProductMaturity = "planned" | "scaffolded" | "in_development" | "verification" | "release_candidate" | "released" | "withdrawn";
export type ProductTier = "Tier 1" | "Tier 2" | "Tier 3" | "Tier 4" | "Tier 5";
export type RightsStatus = "unverified" | "declared" | "under_review" | "verified" | "rejected";
export type SecurityScanStatus = "not_started" | "pending" | "passed" | "failed" | "exception_approved";
export type DataClassification = "none" | "public" | "internal" | "confidential" | "regulated";

export interface ProductManifestV1 {
  readonly schemaVersion: 1;
  readonly productKey: string;
  readonly name: string;
  readonly tier: ProductTier;
  readonly kind: ProductKind;
  readonly maturity: ProductMaturity;
  readonly source: { readonly repository: string; readonly commit: string | null };
  readonly runtime: { readonly framework: string; readonly version: string };
  readonly commands: {
    readonly build: string;
    readonly test: string;
    readonly lint: string;
    readonly typecheck: string;
    readonly security?: string;
  };
  readonly compatibility: Readonly<Record<string, unknown>>;
  readonly license: { readonly licenseType: string; readonly thirdPartyNotices: string };
  readonly rights: { readonly status: RightsStatus; readonly evidenceReference: string | null };
  readonly security: {
    readonly dataClassification: DataClassification;
    readonly threatModel: string;
    readonly scanStatus: SecurityScanStatus;
  };
}

export interface LaunchKitManifestV1 {
  readonly schemaVersion: 1;
  readonly kitKey: string;
  readonly name: string;
  readonly maturity: ProductMaturity;
  readonly components: readonly {
    readonly productKey: string;
    readonly versionRange: string;
    readonly optional?: boolean;
  }[];
  readonly compatibility: Readonly<Record<string, unknown>>;
  readonly validation: {
    readonly compositionTestCommand: string;
    readonly securityReviewRequired: boolean;
  };
}

export interface RegistryEntryV1 {
  readonly sequence: number;
  readonly productKey: string;
  readonly name: string;
  readonly tier: ProductTier;
  readonly kind: ProductKind;
  readonly catalogueStatus: "planned";
  readonly maturity: ProductMaturity;
  readonly manifestPath: string | null;
  readonly sourcePath: string | null;
  readonly releaseEvidence: "not_available" | "available";
}

export interface RegistryLockV1 {
  readonly schemaVersion: 1;
  readonly generatedFrom: "catalog/products.json";
  readonly catalogueStatus: "planned-not-release-evidence";
  readonly counts: {
    readonly total: number;
    readonly standalone: number;
    readonly launchKits: number;
    readonly admittedStandaloneWorkspaces: number;
    readonly manifestsPresent: number;
    readonly released: number;
  };
  readonly entries: readonly RegistryEntryV1[];
}

export interface ReleaseEvidenceV1 {
  readonly schemaVersion: 1;
  readonly productKey: string;
  readonly version: string;
  readonly sourceCommit: string;
  readonly artifactDigest: `sha256:${string}`;
  readonly evidence: {
    readonly tests: string;
    readonly security: string;
    readonly rights: string;
    readonly accessibility: string;
    readonly sbom: string;
  };
  readonly approval: {
    readonly approvedBy: string;
    readonly approvedAt: string;
    readonly reference: string;
  };
}
