export interface IUIConfigState {
  configType: string;
  columns: string[];
}

export interface IUIConfigResponse {
  name: string;
  displayName: string;
  order: number | null;
  selected: boolean;
}
