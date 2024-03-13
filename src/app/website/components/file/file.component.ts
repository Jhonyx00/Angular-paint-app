import { Component } from '@angular/core';
import { PropertiesService } from '../../shared/services/properties.service';
import { SelectedTool } from '../../shared/interfaces/selected-tool.interface';
import { ToolsService } from '../toolbar/services/tools.service';

@Component({
  selector: 'app-options',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css'],
})
export class OptionsComponent {
  constructor(private toolsService: ToolsService) {}
  public selectedItem = '';
  public options: SelectedTool[] = [
    {
      id: 1,
      toolName: 'Save',
      imageURL: '../../../../assets/svg/rectangle.svg',
    },
    {
      id: 2,
      toolName: 'Open',
      imageURL: '../../../../assets/svg/rectangle.svg',
    },
    {
      id: 3,
      toolName: 'File',
      imageURL: '../../../../assets/svg/rectangle.svg',
    },
  ];

  selectOption(optionName: string) {
    this.selectedItem = optionName;
    this.toolsService.setSelectedButton(this.selectedItem);
    console.log('file: ', this.selectedItem);
  }

  //PLACE HERE saveWork FUNCTION
}
