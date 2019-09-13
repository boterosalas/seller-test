export interface File {
  lastModified: number;
  lastModifiedDate: Date;
  name: String;
  size: number;
  type: String;
  webkitRelativePath: String;
  base64: String;
}

export interface Validation {
  message: string;
  type: TYPE_VALIDATION;
}

export enum TYPE_VALIDATION {
  MAX_SIZE,
  ACCEPT_TYPES
}
