import { Component, OnInit } from '@angular/core';
import { Tool } from '../../../shared/interfaces/selected-tool.interface';
import { ToolsService } from '../toolbar/services/tools.service';

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

  public selectedItemName: string = '';
  public selectedItemId: number = 0;

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

  selectShape(selectedItemName: string, id: number) {
    this.selectedItemName = selectedItemName;
    this.selectedItemId = id;
    // console.log('focused', event.target as HTMLElement);

    console.log('figure: ', selectedItemName, id);

    // const newArray = this.shapeItems.filter((item) => {
    //   return item.isSelected === true;
    // });

    // console.log('nuevo arreglo', newArray);

    this.toolsService.setSelectedButton(this.selectedItemName);
  }
}

///usar nth-child() y en el parametro le pasamos el numero del item que seleccionamos
