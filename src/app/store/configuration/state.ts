export interface ConfigurationState {
  language: string;
  statusCases: Array<StatusCase>;
}

interface StatusCase {
  id: number;
  code: number;
  name: string;
  description: string;
  default: boolean;
  active: boolean;
  createDate: string;
  updateDate: string;
}
