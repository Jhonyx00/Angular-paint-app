import { Component } from '@angular/core';
import { SelectedTool } from '../../../shared/interfaces/selected-tool.interface';
import { ToolsService } from '../toolbar/services/tools.service';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
})
export class SelectComponent {
  constructor(private toolsService: ToolsService) {}

  public selectedItem = '';

  public srcImages: SelectedTool[] = [
    {
      id: 1,
      toolName: 'Move',
      imageURL: '../../../../assets/svg/rectangle.svg',
    },
    {
      id: 2,
      toolName: 'Move 2',
      imageURL: '../../../../assets/svg/star.svg',
    },
  ];

  shapeSelection(selectedItem: string) {
    this.selectedItem = selectedItem;
    console.log('tool: ', selectedItem);
    this.toolsService.setSelectedButton(this.selectedItem);
  }
}
