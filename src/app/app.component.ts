import {
  Component,
  ComponentRef,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Point } from './website/interfaces/point.interface';
import { MouseEventService } from './website/services/mouse-event.service';
import { StatusBarService } from './website/services/statusbar.service';
import { ToolName } from './website/enums/tool-name.enum';
import { IconTool } from './website/interfaces/tool.interface';
import { ToolMenuComponent } from './shared/components/tool-menu/tool-menu.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private mouseEventService: MouseEventService,
    private statusBarService: StatusBarService
  ) {}

  private isOutside = false;
  ngOnInit(): void {
    this.init();
  }

  init() {
    this.statusBarService.getOutsideCanvas().subscribe((isOutside) => {
      this.isOutside = isOutside;
    });
  }

  title = 'PaintXD';

  mouseDownPosition: Point = {
    x: 0,
    y: 0,
  };

  onWheel(event: WheelEvent, options: {}) {
    if (event.ctrlKey) {
      event.preventDefault();
    }
  }

  private isOnContainer = false;

  onMouseDown(event: MouseEvent) {
    if (event.button === 0 && !this.isOutside) {
      this.isOnContainer = true;
      this.mouseEventService.setMouseDownPosition({
        x: event.offsetX,
        y: event.offsetY,
      });
    }
  }

  onMouseMove(event: MouseEvent) {
    if (this.isOnContainer && !this.isOutside) {
      this.mouseEventService.setMouseMovePosition({
        x: event.offsetX,
        y: event.offsetY,
      });
    }
  }

  onMouseUp() {
    this.isOnContainer = false;
  }

  public shapes = 'Shapes';
  public selection = 'Select';
  public pencils = 'Pencils';
  public erasers = 'Erasers';
  public files = 'File';
  public actions = 'Actions';

  private imagesList = new Array();
  private imagesListAux = new Array();

  ////Tool arrays
  public shapeItems: IconTool[] = [
    {
      id: 1,
      name: ToolName.Rectangle,
      icon: '../../../../assets/svg/rectangle.svg',
    },
    {
      id: 1,
      name: ToolName.Ellipse,
      icon: '../../../../assets/svg/oval.svg',
    },
    {
      id: 1,
      name: ToolName.Hexagon,
      icon: '../../../../assets/svg/hexagon.svg',
    },
    {
      id: 1,
      name: ToolName.Triangle,
      icon: '../../../../assets/svg/triangle.svg',
    },
    {
      id: 1,
      name: ToolName.Pentagon,
      icon: '../../../../assets/svg/pentagon.svg',
    },
    {
      id: 1,
      name: ToolName.Star,
      icon: '../../../../assets/svg/star.svg',
    },

    {
      id: 1,
      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
  ];

  public selectionItems: IconTool[] = [
    {
      id: 2,
      name: ToolName.Select,
      icon: '../../../../assets/svg/select.svg',
    },
    {
      id: 10,
      name: ToolName.Select2,
      icon: '../../../../assets/svg/free-form-select.svg',
    },
  ];

  public pencilItems: IconTool[] = [
    {
      id: 3,
      name: ToolName.Line,
      icon: '../../../../assets/svg/pencil.svg',
    },
    {
      id: 3,
      name: ToolName.Pencil,
      icon: '../../../../assets/svg/rectangle.svg',
    },
  ];

  public eraserItems: IconTool[] = [
    {
      id: 4,
      name: ToolName.Eraser,
      icon: '../../../../assets/svg/eraser.svg',
    },
    {
      id: 4,
      name: ToolName.Eraser2,
      icon: '../../../../assets/svg/oval.svg',
    },
  ];

  public fileItems: IconTool[] = [
    {
      id: 5,
      name: ToolName.Save,
      icon: '../../../../assets/svg/rectangle.svg',
    },
    {
      id: 5,
      name: ToolName.Open,
      icon: '../../../../assets/svg/rectangle.svg',
    },
    { id: 5, name: ToolName.File, icon: '../../../../assets/svg/undo.svg' },
  ];

  public actionItems: IconTool[] = [
    { id: 6, name: ToolName.Undo, icon: '../../../../assets/svg/undo.svg' },
    { id: 6, name: ToolName.Redo, icon: '../../../../assets/svg/redo.svg' },
  ];
  //

  //
  public buttons = [
    {
      id: 1,
      title: this.files,
      icon: '../../../../assets/svg/rectangle.svg',
      toolItems: this.fileItems,
    },
    {
      id: 2,
      title: this.actions,
      icon: '../../../../assets/svg/rectangle.svg',
      toolItems: this.actionItems,
    },
    {
      id: 3,
      title: this.shapes,
      icon: '../../../../assets/svg/star.svg',
      toolItems: this.shapeItems,
    },
    {
      id: 4,
      title: this.pencils,
      icon: '../../../../assets/svg/pencil.svg',
      toolItems: this.pencilItems,
    },
    {
      id: 5,
      title: this.selection,
      icon: '../../../../assets/svg/select.svg',
      toolItems: this.selectionItems,
    },
    {
      id: 6,
      title: this.erasers,
      icon: '../../../../assets/svg/eraser.svg',
      toolItems: this.eraserItems,
    },
  ];

  ///
  @ViewChild('toolMenu', { read: ViewContainerRef })
  private dynamicHost!: ViewContainerRef;
  private componentRef!: ComponentRef<ToolMenuComponent>;

  openToolMenu(toolGroupName: string, toolItems: IconTool[]) {
    this.deleteComponent();
    this.createComponent(toolGroupName, toolItems);
  }
  //DINAMIC COMPONENT FUNCTIONS
  private createComponent(toolGroupName: string, toolItems: IconTool[]): void {
    this.componentRef = this.dynamicHost.createComponent(ToolMenuComponent);
    this.componentRef.instance.toolGroupName = toolGroupName;
    this.componentRef.instance.toolItems = toolItems;
  }

  private deleteComponent(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}
