import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tools } from 'src/app/website/enums/tools.enum';
import { Tool } from 'src/app/website/interfaces/selected-tool.interface';

@Component({
  selector: 'tool-component',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.css'],
})
export class ToolComponent {
  @Input() toolItems: Tool[] = [];
  @Input() toolGroupName: string = '';
  @Input() selectedTool: string = '';
  @Output()
  onPropertiesSent = new EventEmitter<Tools>();
  sendToolName(toolName: Tools) {
    this.onPropertiesSent.emit(toolName);
  }
}
