import { Component } from '@angular/core';
import { Figure } from '../../interfaces/figure.interface';
import { PropertiesService } from '../../services/properties.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css'],
})
export class OptionsComponent {
  constructor(private propertiesService: PropertiesService) {}
  public selectedOption = 0;
  public opsions: Figure[] = [
    { id: 1, url: '../../../../assets/svg/save.svg' },
    { id: 2, url: '../../../../assets/svg/open.svg' },
    { id: 3, url: '../../../../assets/svg/file.svg' },
  ];

  selectOption(optionId: number) {
    this.selectedOption = optionId;
    switch (optionId) {
      case 1:
        //save file
        this.propertiesService.setSelectedOption(this.selectedOption);
        break;
    }
  }
}
