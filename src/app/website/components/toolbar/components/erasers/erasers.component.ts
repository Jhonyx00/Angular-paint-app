import { Component, EventEmitter, Output } from '@angular/core';
import { Tool } from '../../../../../shared/interfaces/selected-tool.interface';
import { ToolsService } from '../../services/tools.service';

@Component({
  selector: 'app-erasers',
  templateUrl: './erasers.component.html',
  styleUrls: ['./erasers.component.css'],
})
export class ErasersComponent {
  constructor(private toolsService: ToolsService) {}

  public selectedItem = '';

  public eraserItems: Tool[] = [
    {
      toolName: 'Eraser',
      iconUrl: '../../../../assets/svg/rectangle.svg',
      id: 1,
    },
    {
      toolName: 'Eraser 2',
      iconUrl: '../../../../assets/svg/oval.svg',
      id: 2,
    },
  ];

  @Output()
  eventoEnviarDatos = new EventEmitter<{ valor: string; id: number }>();
  enviarShape(valor: string, id: number) {
    this.eventoEnviarDatos.emit({ valor, id });
  }
}
