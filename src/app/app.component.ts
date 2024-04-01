import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private renderer: Renderer2) {}

  title = 'PaintXD';
  protected containerWidth = 0;
  protected containerHeight = 0;

  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef;

  ngOnInit(): void {
    this.containerWidth = this.canvasContainer.nativeElement.offsetWidth;
    this.containerHeight = this.canvasContainer.nativeElement.offsetHeight;
  }
}
