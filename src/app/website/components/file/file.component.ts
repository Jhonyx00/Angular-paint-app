import { Component } from '@angular/core';
import { PropertiesService } from '../../../shared/services/properties.service';
import { Tool } from '../../../shared/interfaces/selected-tool.interface';
import { ToolsService } from '../toolbar/services/tools.service';

@Component({
  selector: 'app-options',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css'],
})
export class OptionsComponent {
  constructor(private toolsService: ToolsService) {}
  public selectedItem = '';
  public fileItems: Tool[] = [
    {
      toolName: 'Save',
      iconUrl: '../../../../assets/svg/rectangle.svg',
      id: 1,
    },
    {
      toolName: 'Open',
      iconUrl: '../../../../assets/svg/rectangle.svg',
      id: 2,
    },
    {
      toolName: 'File',
      iconUrl: '../../../../assets/svg/undo.svg',
      id: 3,
    },
  ];

  selectOption(optionName: string) {
    this.selectedItem = optionName;
    this.toolsService.setSelectedButton(this.selectedItem);
    console.log('file: ', this.selectedItem);
  }

  //PLACE HERE saveWork FUNCTION
}
