import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { StatusBarService } from './website/services/statusbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  canvasContainer: any;
  canvasMainContainer: any;
  constructor(private renderer: Renderer2) {}

  title = 'PaintXD';

  toolbarWidth = 0;
  toolbar: any;

  private toolbarFixedWidth = 100;
  private defaultvalue = 1.5;

  ngOnInit(): void {
    this.initComponents();
    this.resetDimension();
  }

  private initComponents() {
    // this.toolbar = this.renderer.selectRootElement('.toolbar-container', true);
  }

  private resetDimension() {}

  // @HostListener('window:resize') onResize() {
  //   // const pixelRatio = (event.target as Window).devicePixelRatio;

  //   this.renderer.setStyle(
  //     this.toolbar,
  //     'width',
  //     (this.toolbarFixedWidth * this.defaultvalue) / devicePixelRatio + 'px'
  //   );
  // }
}
