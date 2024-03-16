import { Component } from '@angular/core';
import { Tool } from '../../../shared/interfaces/selected-tool.interface';
import { ToolsService } from '../toolbar/services/tools.service';

@Component({
  selector: 'app-pencils',
  templateUrl: './pencils.component.html',
  styleUrls: ['./pencils.component.css'],
})
export class PencilsComponent {
  constructor(private toolsService: ToolsService) {}
  public selectedItem = '';

  public pencilItems: Tool[] = [
    {
      toolName: 'Line',
      iconUrl: '../../../../assets/svg/pencil.svg',
      id: 1,
    },
    {
      toolName: 'Pencil',
      iconUrl: '../../../../assets/svg/rectangle.svg',
      id: 2,
    },
  ];

  selectShape(pencilName: string) {
    this.selectedItem = pencilName;
    console.log('pencil: ', pencilName);

    this.toolsService.setSelectedButton(this.selectedItem);
  }
}
