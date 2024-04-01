import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToolName } from 'src/app/website/enums/tool-name.enum';
import { Tool } from 'src/app/website/interfaces/tool.interface';

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
  onPropertiesSent = new EventEmitter<ToolName>();
  sendToolName(toolName: ToolName) {
    this.onPropertiesSent.emit(toolName);
  }
}
