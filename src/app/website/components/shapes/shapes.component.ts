import { Component, OnInit } from '@angular/core';
import { SelectedTool } from '../../shared/interfaces/selected-tool.interface';
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

  public selectedItem = '';

  public srcImages: SelectedTool[] = [
    {
      id: 1,
      toolName: 'Rectangle',
      imageURL: '../../../../assets/svg/rectangle.svg',
    },
    { id: 2, toolName: 'Ellipse', imageURL: '../../../../assets/svg/oval.svg' },
    {
      id: 3,
      toolName: 'Hexagon',
      imageURL: '../../../../assets/svg/hexagon.svg',
    },
    {
      id: 4,
      toolName: 'Triangle',
      imageURL: '../../../../assets/svg/triangle.svg',
    },
    { id: 5, toolName: 'Star', imageURL: '../../../../assets/svg/star.svg' },
  ];

  selectShape(selectedItem: string) {
    this.selectedItem = selectedItem;
    console.log('figure: ', selectedItem);

    this.toolsService.setSelectedButton(this.selectedItem);
  }
}
