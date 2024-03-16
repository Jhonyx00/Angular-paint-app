import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tool } from 'src/app/shared/interfaces/selected-tool.interface';
import { CanvasStateService } from 'src/app/shared/services/canvas-state.service';
import { ToolsService } from '../../services/tools.service';

@Component({
  selector: 'app-tool',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.css'],
})
export class ToolComponent {
  @Input() toolItems: Tool[] = [];
  @Input() toolGroupName: string = '';
  @Output()
  eventoEnviarDatos = new EventEmitter<{ valor: string; id: number }>();
  enviarShape(valor: string, id: number) {
    this.eventoEnviarDatos.emit({ valor, id });
  }
}
