import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { DynamicComponentService } from './shared/services/dynamic-component.service';
import { StatusBarService } from './website/services/statusbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private renderer: Renderer2,
    private dynamicComponentService: DynamicComponentService,
    private statusBarService: StatusBarService
  ) {}

  title = 'PaintXD';
  private containerWidth = 0;
  private containerHeight = 0;

  @ViewChild('mainContainer', { static: true }) mainContainer!: ElementRef; //cambiar por renderer2
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef; //cambiar por renderer2

  ngOnInit(): void {
    this.resetDimension();
    //console.log(this.containerWidth, this.containerHeight);
  }

  private resetDimension() {
    this.containerWidth = this.canvasContainer.nativeElement.offsetWidth;
    this.containerHeight = this.canvasContainer.nativeElement.offsetHeight;

    this.statusBarService.setCanvasDimensions({
      width: this.containerWidth,
      height: this.containerHeight,
    });
  }

  @HostListener('window:resize', ['$event']) onResize(event: UIEvent) {
    const rect = this.mainContainer.nativeElement.getBoundingClientRect();
    // this.dynamicComponentService.setWindowRect({
    //   x: rect.x,
    //   y: rect.y,
    //   width: rect.width,
    //   height: rect.height,
    // });
    this.resetDimension();
    //console.log((event.target as Window).innerWidth);
  }
}
