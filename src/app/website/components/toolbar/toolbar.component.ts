import {
  Component,
  ComponentRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ToolsService } from '../../services/tools.service';
import { CanvasStateService } from 'src/app/website/services/canvas-state.service';
import { ToolName } from 'src/app/website/enums/tool-name.enum';
import { IconTool } from '../../interfaces/tool.interface';
import { ShapeContainerComponent } from 'src/app/shared/components/shape-container/shape-container.component';
import { ToolMenuComponent } from 'src/app/shared/components/tool-menu/tool-menu.component';
import { ToolComponent } from '../tool/tool.component';

@Component({
  selector: 'toolbar-component',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnDestroy {
  constructor() {}
  public shapes = 'Shapes';
  public selection = 'Select';
  public pencils = 'Pencils';
  public erasers = 'Erasers';
  public files = 'File';
  public actions = 'Actions';

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

  @ViewChild('toolMenu', { read: ViewContainerRef })
  private dynamicHost!: ViewContainerRef;
  private componentRef!: ComponentRef<ToolComponent>;

  openToolMenu(toolGroupName: string, toolItems: IconTool[]) {
    this.deleteComponent();
    this.createComponent(toolGroupName, toolItems);
  }
  //DINAMIC COMPONENT FUNCTIONS
  private createComponent(toolGroupName: string, toolItems: IconTool[]): void {
    this.componentRef = this.dynamicHost.createComponent(ToolComponent);
    this.componentRef.instance.toolGroupName = toolGroupName;
    this.componentRef.instance.toolItems = toolItems;
  }

  private deleteComponent(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
}
