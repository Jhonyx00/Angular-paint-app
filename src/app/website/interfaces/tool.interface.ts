import { ToolName } from '../enums/tool-name.enum';

export interface Tool {
  id: number;
  name: ToolName;
}

export interface IconTool extends Tool {
  icon: string;
}
