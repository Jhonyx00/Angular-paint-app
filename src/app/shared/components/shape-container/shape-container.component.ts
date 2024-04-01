import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ShapeContainer } from '../../interfaces/shape.interface';
import { ShapeContainerService } from '../../services/shape-container.service';
import { ImageDataService } from 'src/app/shared/services/image-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'shape-container',
  templateUrl: './shape-container.component.html',
  styleUrls: ['./shape-container.component.css'],
})
export class ShapeContainerComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  constructor(
    private shapeContainerService: ShapeContainerService,
    private imageDataService: ImageDataService
  ) {}

  @ViewChild('auxCanvas', { static: true }) auxCanvas!: ElementRef;
  private ctxAux!: CanvasRenderingContext2D;

  private image$: Subscription | undefined;
  private dynamicComponent$: Subscription | undefined;

  public auxComponent: ShapeContainer = {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    background: '',
    componentClass: '',
    referenceWidth: 0,
    referenceHeight: 0,
  };

  ngOnInit(): void {
    this.initAuxComponentDimensions();
  }

  ngAfterViewInit(): void {
    this.initAuxContext();
    this.initImage();
  }

  initAuxContext() {
    this.ctxAux = this.auxCanvas.nativeElement.getContext('2d');
  }

  initImage() {
    this.image$ = this.imageDataService.getImage().subscribe((image) => {
      if (image != undefined) {
        this.auxCanvas.nativeElement.width = image?.width;
        this.auxCanvas.nativeElement.height = image?.height;
        this.ctxAux.putImageData(image, 0, 0);
      }
    });
  }

  private initAuxComponentDimensions() {
    this.dynamicComponent$ = this.shapeContainerService
      .getShapeContainer()
      .subscribe((currentAuxComponent: ShapeContainer) => {
        this.auxComponent = currentAuxComponent;
      });
  }

  ngOnDestroy(): void {
    this.image$?.unsubscribe();
    this.dynamicComponent$?.unsubscribe();
  }
}
