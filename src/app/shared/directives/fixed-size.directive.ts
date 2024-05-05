import {
  Directive,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
} from '@angular/core';
import { ZoomService } from 'src/app/website/services/zoom.service';

@Directive({
  selector: '[fixedSize]',
})
export class FixedSizeDirective implements OnInit {
  constructor(
    private element: ElementRef,
    private zoomService: ZoomService,
    private renderer: Renderer2
  ) {}

  private htmlElement!: HTMLElement;
  private zoomFactor = 0;

  private width = 0;
  private height = 0;

  ngOnInit(): void {
    this.initElementProperties();
    this.initZoomFactor();
  }

  initZoomFactor() {
    this.zoomService.getZoomFactor().subscribe((currenZoomFactor) => {
      this.zoomFactor = currenZoomFactor;
    });
  }

  initElementProperties() {
    this.htmlElement = this.element.nativeElement;
    this.width = this.htmlElement.offsetWidth;
    this.height = this.htmlElement.offsetHeight;
  }

  @HostListener('window:wheel') onWheel() {
    this.renderer.setStyle(
      this.htmlElement,
      'width',
      `${this.width / this.zoomFactor}px`
    );

    this.renderer.setStyle(
      this.htmlElement,
      'height',
      `${this.height / this.zoomFactor}px`
    );
  }
}
