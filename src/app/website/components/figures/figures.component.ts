import { Component, OnInit } from '@angular/core';
import { SelectedTool } from '../../interfaces/selected-tool.interface';
import { PropertiesService } from '../../services/properties.service';

@Component({
  selector: 'app-figures',
  templateUrl: './figures.component.html',
  styleUrls: ['./figures.component.css'],
})
export class FiguresComponent implements OnInit {
  constructor(private propertiesService: PropertiesService) {}
  ngOnInit(): void {
    // const selectedFigure: number = this.selectShape();
  }

  public figureName = '';

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

  selectShape(figureName: string) {
    this.figureName = figureName;
    console.log('figure: ', figureName);

    this.propertiesService.setSelectedShape(this.figureName);
  }
}
