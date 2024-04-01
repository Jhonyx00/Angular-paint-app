import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DynamicComponentProperties } from '../../interfaces/dynamic-component.interface';
import { DynamicComponentService } from '../../services/dynamic-component.service';
import { ImageDataService } from 'src/app/shared/services/image-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-aux-div',
  templateUrl: './aux-div.component.html',
  styleUrls: ['./aux-div.component.css'],
})
export class AuxDivComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private dynamicComponentService: DynamicComponentService,
    private imageDataService: ImageDataService
  ) {}

  @ViewChild('auxCanvas', { static: true }) auxCanvas!: ElementRef;
  private ctxAux!: CanvasRenderingContext2D;

  private image$: Subscription | undefined;
  private dynamicComponent$: Subscription | undefined;

  public auxComponent: DynamicComponentProperties = {
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
        //debo cambiar la dimension del canvas, con base en el nuevo valor de la redimension
        this.auxCanvas.nativeElement.width = image?.width;
        this.auxCanvas.nativeElement.height = image?.height;
        this.ctxAux.putImageData(image, 0, 0);
      }
    });
  }

  private initAuxComponentDimensions() {
    this.dynamicComponent$ = this.dynamicComponentService
      .getAuxComponent()
      .subscribe((currentAuxComponent: DynamicComponentProperties) => {
        this.auxComponent = currentAuxComponent;
      });
  }

  ngOnDestroy(): void {
    this.image$?.unsubscribe();
    this.dynamicComponent$?.unsubscribe();
  }
}
