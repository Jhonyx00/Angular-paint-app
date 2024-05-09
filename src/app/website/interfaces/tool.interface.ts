import { ToolName } from '../enums/tool-name.enum';

export interface Tool {
  toolGroupID: number;
  toolId: number;
  name: ToolName;
}

export interface IconTool extends Tool {
  icon: string;
}
