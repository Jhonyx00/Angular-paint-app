import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tool } from '../../../../../shared/interfaces/selected-tool.interface';
import { ToolsService } from '../../services/tools.service';

@Component({
  selector: 'app-figures',
  templateUrl: './shapes.component.html',
  styleUrls: ['./shapes.component.css'],
})
export class FiguresComponent implements OnInit {
  constructor(private toolsService: ToolsService) {}
  ngOnInit(): void {
    // const selectedFigure: number = this.selectShape();
  }

  // @Input() data: Tool[] = []; //recibe del padre
  //envia al padre

  public shapeItems: Tool[] = [
    {
      toolName: 'Rectangle',
      iconUrl: '../../../../assets/svg/rectangle.svg',
      id: 1,
    },
    {
      toolName: 'Ellipse',
      iconUrl: '../../../../assets/svg/oval.svg',
      id: 2,
    },
    {
      toolName: 'Hexagon',
      iconUrl: '../../../../assets/svg/hexagon.svg',
      id: 3,
    },
    {
      toolName: 'Triangle',
      iconUrl: '../../../../assets/svg/triangle.svg',
      id: 4,
    },
    {
      toolName: 'Star',
      iconUrl: '../../../../assets/svg/star.svg',
      id: 5,
    },
  ];

  @Output()
  eventoEnviarDatos = new EventEmitter<{ valor: string; id: number }>();
  enviarShape(valor: string, id: number) {
    this.eventoEnviarDatos.emit({ valor, id });
  }
}
