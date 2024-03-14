import { Component } from '@angular/core';
import { SelectedTool } from '../../../shared/interfaces/selected-tool.interface';
import { ToolsService } from '../toolbar/services/tools.service';

@Component({
  selector: 'app-erasers',
  templateUrl: './erasers.component.html',
  styleUrls: ['./erasers.component.css'],
})
export class ErasersComponent {
  constructor(private toolsService: ToolsService) {}

  public selectedItem = '';

  public srcImages: SelectedTool[] = [
    {
      id: 1,
      toolName: 'Eraser',
      imageURL: '../../../../assets/svg/rectangle.svg',
    },
    {
      id: 2,
      toolName: 'Eraser 2',
      imageURL: '../../../../assets/svg/oval.svg',
    },
  ];

  selectEraser(eraserName: string) {
    this.selectedItem = eraserName;
    console.log('tool: ', eraserName);
    this.toolsService.setSelectedButton(this.selectedItem);
  }
}
