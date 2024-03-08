import { Component, OnInit } from '@angular/core';
import { Figure } from '../../interfaces/figure.interface';
import { PropertiesService } from '../../services/properties.service';

@Component({
  selector: 'app-figures',
  templateUrl: './figures.component.html',
  styleUrls: ['./figures.component.css'],
})
export class FiguresComponent implements OnInit {
  constructor(private propertiesService: PropertiesService) {}
  ngOnInit(): void {
    // const selectedFigure: number = this.selectShape();
  }

  public selectedFigure = 0;
  public selectedFigureStyle = '';

  public srcImages: Figure[] = [
    { id: 1, url: '../../../../assets/svg/rectangle.svg' },
    { id: 2, url: '../../../../assets/svg/oval.svg' },
    { id: 3, url: '../../../../assets/svg/hexagon.svg' },
    { id: 4, url: '../../../../assets/svg/triangle.svg' },
    { id: 5, url: '../../../../assets/svg/star.svg' },
    { id: 5, url: '../../../../assets/svg/star.svg' },
    { id: 5, url: '../../../../assets/svg/star.svg' },
    { id: 5, url: '../../../../assets/svg/star.svg' },
  ];

  selectShape(figureId: number) {
    this.selectedFigure = figureId;
    console.log('figure: ', figureId);

    this.selectedFigureStyle = 'selected-shape';

    this.propertiesService.setSelectedShape(this.selectedFigure);
  }
}
