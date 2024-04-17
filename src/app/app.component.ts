import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { StatusBarService } from './website/services/statusbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  canvasContainer: any;
  canvasMainContainer: any;
  constructor(
    private renderer: Renderer2,
    private statusBarService: StatusBarService
  ) {}

  title = 'PaintXD';
  private containerWidth = 0;
  private containerHeight = 0;
  toolbarWidth = 0;
  toolbar: any;

  // @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef; //cambiar por renderer2

  ngOnInit(): void {
    this.initComponents();
    this.resetDimension();
    //console.log(this.containerWidth, this.containerHeight);
  }

  private initComponents() {
    this.canvasMainContainer = this.renderer.selectRootElement(
      '.canvas-main-container',
      true
    );

    this.canvasContainer = this.renderer.selectRootElement(
      '.canvas-container',
      true
    );
  }

  private resetDimension() {
    const canvasWidth = this.canvasMainContainer.getBoundingClientRect().width;
    const canvasHeight =
      this.canvasMainContainer.getBoundingClientRect().height;

    this.renderer.setStyle(this.canvasContainer, 'width', canvasWidth + 'px');
    this.renderer.setStyle(this.canvasContainer, 'height', canvasHeight + 'px');

    this.statusBarService.setCanvasDimensions({
      width: canvasWidth,
      height: canvasHeight,
    });
  }

  @HostListener('window:resize') onResize() {
    // const pixelRatio = (event.target as Window).devicePixelRatio;
    this.toolbar = this.renderer.selectRootElement('.toolbar-container', true);

    const defaultvalue = 1.5;

    this.renderer.setStyle(
      this.toolbar,
      'width',
      (66 * defaultvalue) / devicePixelRatio + 'px'
    );

    ///hacer un servicio que le envie el boundingClientRect cada vez que se redimensiona
    //canvasBoundingClientRect
  }
}
