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
    {
      id: 1,
      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      id: 1,
      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      id: 1,
      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      id: 1,
      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      id: 1,
      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      id: 1,
      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      id: 1,
      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      id: 1,
      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      id: 1,
      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      id: 1,
      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      id: 1,
      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      id: 1,
      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      id: 1,
      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      id: 1,
      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      id: 1,
      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      id: 1,
      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
    },
    {
      id: 1,
      name: ToolName.Rhombus,
      icon: '../../../../assets/svg/rhombus.svg',
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
  public toolsItems: IconTool[] = [
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
