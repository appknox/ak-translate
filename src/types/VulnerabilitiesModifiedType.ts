import VulnerabilityType from "./VulnerabilityType";

export interface VulnerabilityDiffType {
  hash: string;
  vulnerability: VulnerabilityType;
}

export interface IdVulnerabilityDiffMapType {
  [key: string]: VulnerabilityDiffType;
}

export default interface VulnerabilitiesModifiedType {
  [key: string]: IdVulnerabilityDiffMapType;
}
