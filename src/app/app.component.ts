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
    //this.resetDimension();

    const toolbar = this.renderer.selectRootElement('.toolbar-container', true);

    //console.log(event.target);

    const pixelRatio = (event.target as Window).devicePixelRatio;
    console.log(pixelRatio);

    const max = 7.5;
    const min = 0.375;

    this.renderer.setStyle(toolbar, 'zoom', `${pixelRatio - (pixelRatio - 1)}`);
    console.log('new', pixelRatio - (pixelRatio - 1));

    //que el zoom vaya incrementando o disminuyendo a mediante el evento de window resize
  }
}
