import { Component, OnDestroy } from '@angular/core';
import { ToolsService } from '../../services/tools.service';
import { CanvasStateService } from 'src/app/website/services/canvas-state.service';
import { ToolName } from 'src/app/website/enums/tool-name.enum';
import { IconTool } from '../../interfaces/tool.interface';

@Component({
  selector: 'toolbar-component',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnDestroy {
  constructor(
    private toolsService: ToolsService,
    private canvasStateService: CanvasStateService
  ) {}

  public selectedTool!: IconTool;
  public selectedFileTool!: IconTool;

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
      icon: '../../../../assets/svg/star.svg',
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

  ngOnInit(): void {
    this.initCanvasImageList();
  }

  public onClick() {
    this.canvasStateService.setResetValue(false);
  }

  private initCanvasImageList(): void {
    this.canvasStateService.getImageList().subscribe((currentList) => {
      this.imagesList = currentList;
    });
  }

  setSelectedTool(toolName: IconTool) {
    if (
      toolName.name == ToolName.Undo ||
      toolName.name == ToolName.Redo ||
      toolName.name == ToolName.Save
    ) {
      this.selectedFileTool = toolName;
      switch (this.selectedFileTool.name) {
        case ToolName.Undo:
          this.undo();
          break;

        case ToolName.Redo:
          this.redo();
          break;

        case ToolName.Save:
          this.saveWork();
          break;

        default:
          break;
      }
    } else {
      this.selectedTool = toolName;
      this.initSelectedTool();
    }
  }

  initSelectedTool() {
    this.toolsService.setSelectedButton(this.selectedTool);
  }

  private undo(): void {
    if (this.imagesList.length > 0) {
      this.imagesListAux.push(this.imagesList.pop());

      console.log('undo list', this.imagesList);
      this.canvasStateService.setImageList(this.imagesList);
    } else {
    }
  }

  private redo(): void {
    if (this.imagesListAux.length > 0) {
      this.imagesList.push(this.imagesListAux.pop());

      console.log('redo list', this.imagesList);
      this.canvasStateService.setImageList(this.imagesList);
    } else {
    }
  }

  private saveWork(): void {
    const base64ImageData = this.imagesList[this.imagesList.length - 1];
    let imageName = prompt('Enter image name');
    const downloadLink = document.createElement('a');
    downloadLink.href = base64ImageData;
    downloadLink.download = imageName || 'image1';
    downloadLink.click();
    window.URL.revokeObjectURL(downloadLink.href);
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
}
