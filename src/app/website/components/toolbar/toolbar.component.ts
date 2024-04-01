import { Component, OnDestroy } from '@angular/core';
import { ToolsService } from '../../services/tools.service';
import { CanvasStateService } from 'src/app/website/services/canvas-state.service';
import { ToolName } from 'src/app/website/enums/tool-name.enum';
import { Tool } from 'src/app/website/interfaces/tool.interface';

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

  public selectedTool!: ToolName;
  public selectedFileTool!: ToolName;

  public shapes = 'Shapes';
  public selection = 'Select';
  public pencils = 'Pencils';
  public erasers = 'Erasers';
  public files = 'File';
  public actions = 'Actions';

  private imagesList = new Array();
  private imagesListAux = new Array();

  ////Tool arrays
  public shapeItems: Tool[] = [
    {
      toolName: ToolName.Rectangle,
      iconUrl: '../../../../assets/svg/rectangle.svg',
    },
    {
      toolName: ToolName.Ellipse,
      iconUrl: '../../../../assets/svg/oval.svg',
    },
    {
      toolName: ToolName.Hexagon,
      iconUrl: '../../../../assets/svg/hexagon.svg',
    },
    {
      toolName: ToolName.Triangle,
      iconUrl: '../../../../assets/svg/triangle.svg',
    },
    {
      toolName: ToolName.Pentagon,
      iconUrl: '../../../../assets/svg/pentagon.svg',
    },
    {
      toolName: ToolName.Star,
      iconUrl: '../../../../assets/svg/star.svg',
    },

    {
      toolName: ToolName.Rhombus,
      iconUrl: '../../../../assets/svg/rhombus.svg',
    },
  ];

  public selectionItems: Tool[] = [
    {
      toolName: ToolName.Select,
      iconUrl: '../../../../assets/svg/select.svg',
    },
    {
      toolName: ToolName.Select2,
      iconUrl: '../../../../assets/svg/star.svg',
    },
  ];

  public pencilItems: Tool[] = [
    {
      toolName: ToolName.Line,
      iconUrl: '../../../../assets/svg/pencil.svg',
    },
    {
      toolName: ToolName.Pencil,
      iconUrl: '../../../../assets/svg/rectangle.svg',
    },
  ];

  public eraserItems: Tool[] = [
    {
      toolName: ToolName.Eraser,
      iconUrl: '../../../../assets/svg/eraser.svg',
    },
    {
      toolName: ToolName.Eraser2,
      iconUrl: '../../../../assets/svg/oval.svg',
    },
  ];

  public fileItems: Tool[] = [
    {
      toolName: ToolName.Save,
      iconUrl: '../../../../assets/svg/rectangle.svg',
    },
    {
      toolName: ToolName.Open,
      iconUrl: '../../../../assets/svg/rectangle.svg',
    },
    {
      toolName: ToolName.File,
      iconUrl: '../../../../assets/svg/undo.svg',
    },
  ];

  public actionItems: Tool[] = [
    {
      toolName: ToolName.Undo,
      iconUrl: '../../../../assets/svg/undo.svg',
    },
    {
      toolName: ToolName.Redo,
      iconUrl: '../../../../assets/svg/redo.svg',
    },
  ];
  //

  ngOnInit(): void {
    this.initCanvasImageList();
  }

  private initCanvasImageList(): void {
    this.canvasStateService.getImageList().subscribe((currentList) => {
      this.imagesList = currentList;
    });
  }

  setSelectedTool(toolName: ToolName) {
    if (toolName == 'Undo' || toolName == 'Redo' || toolName == 'Save') {
      this.selectedFileTool = toolName;
      switch (this.selectedFileTool) {
        case 'Undo':
          this.undo();
          break;

        case 'Redo':
          this.redo();
          break;

        case 'Save':
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
    // if normal array contains images, then it is posible to undo an action
    if (this.imagesList.length > 0) {
      this.imagesListAux.push(this.imagesList.pop());

      console.log('lista de undo', this.imagesList);
      this.canvasStateService.setImageList(this.imagesList);
    } else {
    }
  }

  private redo(): void {
    // if aux array contains images, then it is porible to redo an action
    if (this.imagesListAux.length > 0) {
      this.imagesList.push(this.imagesListAux.pop());

      console.log('lista de redo', this.imagesList);
      this.canvasStateService.setImageList(this.imagesList);
    } else {
    }
  }

  private saveWork(): void {
    const base64ImageData = this.imagesList[this.imagesList.length - 1]; //esto es igual a la ultima imagen del arreglo compartido
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
