export interface Tool {
  toolName: string;
  iconUrl: string;
}

export interface ToolArea {
  name: string;
  tools: Tool[];
}
