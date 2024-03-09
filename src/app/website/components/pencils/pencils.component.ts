import { Component } from '@angular/core';
import { PropertiesService } from '../../services/properties.service';
import { SelectedTool } from '../../interfaces/selected-tool.interface';

@Component({
  selector: 'app-pencils',
  templateUrl: './pencils.component.html',
  styleUrls: ['./pencils.component.css'],
})
export class PencilsComponent {
  constructor(private propertiesService: PropertiesService) {}
  public selectedPencil = '';

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
    this.selectedPencil = pencilName;
    console.log('pencil: ', pencilName);

    this.propertiesService.setSelectedShape(this.selectedPencil);
  }
}
