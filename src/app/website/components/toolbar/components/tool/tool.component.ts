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
  @Input() selectedItemId: number = 0;
  @Output()
  eventoEnviarDatos = new EventEmitter<{ valor: string; id: number }>();
  enviarShape(valor: string, id: number) {
    this.eventoEnviarDatos.emit({ valor, id });
  }
}
