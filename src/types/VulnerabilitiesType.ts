import VulnerabilityType from "./VulnerabilityType";


export interface IdVulnerabilityMapType {
  [key: string]: VulnerabilityType;
}

export default interface VulnerabilitiesType {
  [key: string]: IdVulnerabilityMapType;
}