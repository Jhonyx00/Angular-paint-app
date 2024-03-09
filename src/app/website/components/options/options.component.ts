import { Component } from '@angular/core';
import { PropertiesService } from '../../services/properties.service';
import { SelectedTool } from '../../interfaces/selected-tool.interface';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css'],
})
export class OptionsComponent {
  constructor(private propertiesService: PropertiesService) {}
  public selectedOption = '';
  public opsions: SelectedTool[] = [
    { id: 1, toolName: 'Save', imageURL: '../../../../assets/svg/save.svg' },
    { id: 2, toolName: 'Open', imageURL: '../../../../assets/svg/open.svg' },
    { id: 3, toolName: 'File', imageURL: '../../../../assets/svg/file.svg' },
  ];

  selectOption(optionName: string) {
    this.selectedOption = optionName;
    switch (optionName) {
      case 'Save':
        //save file
        this.propertiesService.setSelectedOption(this.selectedOption);
        break;
    }
  }

  //PLACE HERE saveWork FUNCTION
}
