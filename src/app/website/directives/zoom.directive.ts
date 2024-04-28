import {
  Directive,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
} from '@angular/core';
import { ZoomService } from '../services/zoom.service';

@Directive({
  selector: '[zoom]',
})
export class ZoomDirective implements OnInit {
  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private zoomService: ZoomService
  ) {}

  ngOnInit(): void {
    this.initElement();
  }

  private htmlElement!: HTMLElement;
  private scaleRatio = 10;

  private initElement() {
    this.htmlElement = this.element.nativeElement;
  }

  @HostListener('window:wheel', ['$event']) onWheel(event: WheelEvent) {
    if (event.ctrlKey) {
      if (event.deltaY >= 100) {
        this.scaleRatio -= 1;
      } else {
        this.scaleRatio += 1;
      }

      const scale = Math.abs(this.scaleRatio / 10);
      this.renderer.setStyle(this.htmlElement, 'transform', `scale(${scale})`);

      this.zoomService.setZommFactor(scale);
    }
  }
}
