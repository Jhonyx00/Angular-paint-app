import { Component } from '@angular/core';
import { SelectedTool } from '../../interfaces/selected-tool.interface';
import { PropertiesService } from '../../services/properties.service';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
})
export class SelectComponent {
  constructor(private propertiesService: PropertiesService) {}

  public figureName = '';

  public srcImages: SelectedTool[] = [
    {
      id: 1,
      toolName: 'Select',
      imageURL: '../../../../assets/svg/rectangle.svg',
    },
    {
      id: 2,
      toolName: 'Eraser 2',
      imageURL: '../../../../assets/svg/oval.svg',
    },
  ];

  selectEraser(figureName: string) {
    this.figureName = figureName;
    console.log('tool: ', figureName);
    this.propertiesService.setSelectedShape(this.figureName);
  }
}
