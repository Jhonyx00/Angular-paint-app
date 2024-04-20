import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconTool } from '../../interfaces/tool.interface';

@Component({
  selector: 'tool-component',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.css'],
})
export class ToolComponent {
  @Input() toolItems: IconTool[] = [];
  @Input() toolGroupName: string = '';
  @Input() selectedTool!: IconTool;
  @Output()
  onPropertiesSent = new EventEmitter<IconTool>();
  sendToolName(toolName: IconTool) {
    this.onPropertiesSent.emit(toolName);
  }
}
