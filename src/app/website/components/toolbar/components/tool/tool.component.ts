import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tool } from 'src/app/shared/interfaces/selected-tool.interface';

@Component({
  selector: 'app-tool',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.css'],
})
export class ToolComponent {
  @Input() toolItems: Tool[] = [];
  @Input() toolGroupName: string = '';
  @Input() selectedItemName: string = '';
  @Output()
  onPropertiesSent = new EventEmitter<string>();
  sendToolName(toolName: string) {
    this.onPropertiesSent.emit(toolName);
  }
}
