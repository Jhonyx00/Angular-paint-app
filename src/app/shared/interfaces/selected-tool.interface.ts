export interface Tool {
  id: number;
  toolName: string;
  iconUrl: string;
}

export interface ToolArea {
  name: string;
  tools: Tool[];
}
