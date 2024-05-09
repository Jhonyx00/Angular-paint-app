import {
  Component,
  ComponentRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MouseEventService } from './website/services/mouse-event.service';
import { StatusBarService } from './website/services/statusbar.service';
import { ToolName } from './website/enums/tool-name.enum';
import { IconTool } from './website/interfaces/tool.interface';
import { ToolsService } from './website/services/tools.service';

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

  public title = 'PaintXD';
  public shapes = 'Shapes';
  public selection = 'Select';
  public tools = 'Tools';
  public erasers = 'Erasers';
  public files = 'File';
  public actions = 'Actions';

  private isOutside = false;
  private isOnContainer = false;

  ////Tool arrays
  public shapeItems: IconTool[] = [
    {
      toolGroupID: 1,
      toolId: 1,
      name: ToolName.Rectangle,
      icon: '../../../../assets/svg/rectangle.svg',
    },
    {
      toolGroupID: 1,
      toolId: 2,
      name: ToolName.Ellipse,
      icon: '../../../../assets/svg/oval.svg',
    },
    {
      toolGroupID: 1,
      toolId: 3,
      name: ToolName.Hexagon,
      icon: '../../../../assets/svg/hexagon.svg',
    },
    {
      toolGroupID: 1,
      toolId: 4,
      name: ToolName.Triangle,
      icon: '../../../../assets/svg/triangle.svg',
    },
    {
      toolGroupID: 1,
      toolId: 5,
      name: ToolName.Pentagon,
      icon: '../../../../assets/svg/pentagon.svg',
    },
    {
      toolGroupID: 1,
      toolId: 6,
      name: ToolName.Star,
      icon: '../../../../assets/svg/star.svg',
    },

    {
      toolGroupID: 1,
      toolId: 7,
      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      toolGroupID: 1,
      toolId: 7,
      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      toolGroupID: 1,
      toolId: 7,

      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      toolGroupID: 1,
      toolId: 7,

      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      toolGroupID: 1,
      toolId: 7,

      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      toolGroupID: 1,
      toolId: 7,

      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      toolGroupID: 1,
      toolId: 7,

      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      toolGroupID: 1,
      toolId: 7,

      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      toolGroupID: 1,
      toolId: 7,

      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      toolGroupID: 1,
      toolId: 7,

      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      toolGroupID: 1,
      toolId: 7,

      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      toolGroupID: 1,
      toolId: 7,

      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      toolGroupID: 1,
      toolId: 7,

      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      toolGroupID: 1,
      toolId: 7,

      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      toolGroupID: 1,
      toolId: 7,

      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      toolGroupID: 1,
      toolId: 7,

      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      toolGroupID: 1,
      toolId: 7,

      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      toolGroupID: 1,
      toolId: 7,

      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      toolGroupID: 1,
      toolId: 7,

      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
  ];
  public selectionItems: IconTool[] = [
    {
      toolGroupID: 2,
      toolId: 1,

      name: ToolName.Select,
      icon: '../../../../assets/svg/select.svg',
    },
    {
      toolGroupID: 10,
      toolId: 2,
      name: ToolName.Select2,
      icon: '../../../../assets/svg/free-form-select.svg',
    },
  ];
  public toolsItems: IconTool[] = [
    {
      toolGroupID: 3,
      toolId: 1,
      name: ToolName.Line,
      icon: '../../../../assets/svg/pencil.svg',
    },
    {
      toolGroupID: 4,
      toolId: 2,
      name: ToolName.Eraser,
      icon: '../../../../assets/svg/eraser.svg',
    },
    {
      toolGroupID: 3,
      toolId: 3,
      name: ToolName.Pencil,
      icon: '../../../../assets/svg/rectangle.svg',
    },
    {
      toolGroupID: 4,
      toolId: 4,
      name: ToolName.Eraser2,
      icon: '../../../../assets/svg/oval.svg',
    },
  ];

  public fileItems: IconTool[] = [
    {
      toolGroupID: 5,
      toolId: 1,
      name: ToolName.Save,
      icon: '../../../../assets/svg/rectangle.svg',
    },
    {
      toolGroupID: 5,
      toolId: 2,
      name: ToolName.Open,
      icon: '../../../../assets/svg/rectangle.svg',
    },
    {
      toolGroupID: 5,
      toolId: 3,
      name: ToolName.File,
      icon: '../../../../assets/svg/undo.svg',
    },
  ];
  public actionItems: IconTool[] = [
    {
      toolGroupID: 6,
      toolId: 1,
      name: ToolName.Undo,
      icon: '../../../../assets/svg/undo.svg',
    },
    {
      toolGroupID: 6,
      toolId: 2,
      name: ToolName.Redo,
      icon: '../../../../assets/svg/redo.svg',
    },
  ];

  ngOnInit(): void {
    this.init();
    // this.initTools();
  }

  init() {
    this.statusBarService.getOutsideCanvas().subscribe((isOutside) => {
      this.isOutside = isOutside;
    });
  }

  onWheel(event: WheelEvent, options: {}) {
    if (event.ctrlKey) {
      event.preventDefault();
    }
  }

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
}
