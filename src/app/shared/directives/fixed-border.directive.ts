import {
  Directive,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
} from '@angular/core';
import { ZoomService } from 'src/app/website/services/zoom.service';

@Directive({
  selector: '[fixedBorder]',
})
export class FixedBorderDirective implements OnInit {
  constructor(
    private element: ElementRef,
    private zoomService: ZoomService,
    private renderer: Renderer2
  ) {}

  private htmlElement!: HTMLElement;
  private zoomFactor = 0;

  private fixedOutline = 0;

  ngOnInit(): void {
    this.initZoomFactor();
    this.initElement();
    this.initElementStyle();
  }
  initZoomFactor() {
    this.zoomService.getZoomFactor().subscribe((currenZoomFactor) => {
      this.zoomFactor = currenZoomFactor;
    });
  }

  initElement() {
    this.htmlElement = this.element.nativeElement;
  }

  initElementStyle() {
    const outlineWidth = window.getComputedStyle(this.htmlElement).outlineWidth;
    this.fixedOutline = parseInt(outlineWidth);
  }

  @HostListener('window:wheel') onWheel() {
    this.renderer.setStyle(
      this.htmlElement,
      'outline',
      `${this.fixedOutline / this.zoomFactor}px dashed gray`
    );
  }
}
