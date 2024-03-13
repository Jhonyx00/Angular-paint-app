import { Component } from '@angular/core';
import { SelectedTool } from '../../shared/interfaces/selected-tool.interface';
import { ToolsService } from '../toolbar/services/tools.service';

@Component({
  selector: 'app-pencils',
  templateUrl: './pencils.component.html',
  styleUrls: ['./pencils.component.css'],
})
export class PencilsComponent {
  constructor(private toolsService: ToolsService) {}
  public selectedItem = '';

  public pencils: SelectedTool[] = [
    {
      id: 1,
      toolName: 'Line',
      imageURL: '../../../../assets/svg/pencil.svg',
    },
    {
      id: 2,
      toolName: 'Pencil',
      imageURL: '../../../../assets/svg/rectangle.svg',
    },
  ];

  selectShape(pencilName: string) {
    this.selectedItem = pencilName;
    console.log('pencil: ', pencilName);

    this.toolsService.setSelectedButton(this.selectedItem);
  }
}
