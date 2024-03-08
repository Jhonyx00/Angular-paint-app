import { Component } from '@angular/core';
import { PropertiesService } from '../../services/properties.service';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.css'],
})
export class ColorComponent {
  constructor(private propertiesService: PropertiesService) {}

  setColor(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input) {
      this.propertiesService.changeColor(input.value);
    }
  }
}
