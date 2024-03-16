import { Component, EventEmitter, Output } from '@angular/core';
import { Tool } from '../../../../../shared/interfaces/selected-tool.interface';
import { ToolsService } from '../../services/tools.service';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
})
export class SelectComponent {
  constructor(private toolsService: ToolsService) {}

  public selectedItem = '';

  public selectionItems: Tool[] = [
    {
      toolName: 'Move',
      iconUrl: '../../../../assets/svg/rectangle.svg',
      id: 1,
    },
    {
      toolName: 'Move 2',
      iconUrl: '../../../../assets/svg/star.svg',
      id: 2,
    },
  ];

  @Output()
  eventoEnviarDatos = new EventEmitter<{ valor: string; id: number }>();
  enviarShape(valor: string, id: number) {
    this.eventoEnviarDatos.emit({ valor, id });
  }
}
