import { Component } from '@angular/core';
import { SelectedTool } from '../../interfaces/selected-tool.interface';
import { PropertiesService } from '../../services/properties.service';

@Component({
  selector: 'app-erasers',
  templateUrl: './erasers.component.html',
  styleUrls: ['./erasers.component.css'],
})
export class ErasersComponent {
  constructor(private propertiesService: PropertiesService) {}

  public figureName = '';

  public srcImages: SelectedTool[] = [
    {
      id: 1,
      toolName: 'Eraser',
      imageURL: '../../../../assets/svg/rectangle.svg',
    },
    {
      id: 2,
      toolName: 'Eraser',
      imageURL: '../../../../assets/svg/oval.svg',
    },
  ];

  selectEraser(figureName: string) {
    this.figureName = figureName;
    console.log('tool: ', figureName);
    this.propertiesService.setSelectedShape(this.figureName);
  }
}
