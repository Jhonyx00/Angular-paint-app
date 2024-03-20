import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DynamicComponentProperties } from '../../interfaces/dynamic-component.interface';
import { DynamicComponentService } from '../../services/dynamic-component.service';
import { ImageDataService } from 'src/app/website/services/image-data.service';

@Component({
  selector: 'app-aux-div',
  templateUrl: './aux-div.component.html',
  styleUrls: ['./aux-div.component.css'],
})
export class AuxDivComponent implements OnInit, AfterViewInit {
  constructor(
    private dynamicComponentService: DynamicComponentService,
    private imageDataService: ImageDataService
  ) {}

  @ViewChild('auxCanvas', { static: true }) auxCanvas!: ElementRef;
  private ctxAux!: CanvasRenderingContext2D;

  private imageData: ImageData | undefined;

  public objectProps: DynamicComponentProperties = {
    width: '',
    height: '',
    top: '',
    left: '',
    background: '',
    border: '',
  };

  ngOnInit(): void {
    this.initComponentAuxDimensions();
  }

  ngAfterViewInit(): void {
    this.initAuxContext();
    this.initImage();
  }

  initAuxContext() {
    this.ctxAux = this.auxCanvas.nativeElement.getContext('2d');
  }

  initImage() {
    this.imageDataService.getImage().subscribe((image) => {
      console.log('la imagen seria: ', image);
      this.imageData = image;
      if (this.imageData !== undefined) {
        this.ctxAux.putImageData(
          this.imageData,
          0,
          0
          // parseFloat(this.objectProps.width),
          // parseFloat(this.objectProps.height)
        );
      }
    });

    console.log(this.auxCanvas.nativeElement.width); ///esta medida
  }

  private initComponentAuxDimensions() {
    this.dynamicComponentService
      .getDynamicComponentDimensions()
      .subscribe((current: DynamicComponentProperties) => {
        this.objectProps.width = current.width;
        this.objectProps.height = current.height;
        this.objectProps.top = current.top;
        this.objectProps.left = current.left;
        this.objectProps.background = current.background;
        this.objectProps.border = current.border;
      });
  }
}
