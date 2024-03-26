import { Component, OnDestroy } from '@angular/core';
import { ToolsService } from '../../../../services/tools.service';
import { CanvasStateService } from 'src/app/website/services/canvas-state.service';
import { Tools } from 'src/app/website/enums/tools.enum';
import { Tool } from 'src/app/website/interfaces/selected-tool.interface';

@Component({
  selector: 'app-toolbar',
  templateUrl: './tools-container.component.html',
  styleUrls: ['./tools-container.component.css'],
})
export class ToolbarComponent implements OnDestroy {
  constructor(
    private toolsService: ToolsService,
    private canvasStateService: CanvasStateService
  ) {}

  public selectedItemName!: Tools;

  public shapes = 'Shapes';
  public selection = 'Selection';
  public pencils = 'Pencils';
  public erasers = 'Erasers';
  public files = 'File';
  public actions = 'Actions';

  private imagesList = new Array();
  private imagesListAux = new Array();

  ////Tool arrays
  public shapeItems: Tool[] = [
    {
      toolName: Tools.Rectangle,
      iconUrl: '../../../../assets/svg/rectangle.svg',
    },
    {
      toolName: Tools.Ellipse,
      iconUrl: '../../../../assets/svg/oval.svg',
    },
    {
      toolName: Tools.Hexagon,
      iconUrl: '../../../../assets/svg/hexagon.svg',
    },
    {
      toolName: Tools.Triangle,
      iconUrl: '../../../../assets/svg/triangle.svg',
    },
    {
      toolName: Tools.Star,
      iconUrl: '../../../../assets/svg/star.svg',
    },
  ];

  public selectionItems: Tool[] = [
    {
      toolName: Tools.Select,
      iconUrl: '../../../../assets/svg/rectangle.svg',
    },
    {
      toolName: Tools.Select2,
      iconUrl: '../../../../assets/svg/star.svg',
    },
  ];

  public pencilItems: Tool[] = [
    {
      toolName: Tools.Line,
      iconUrl: '../../../../assets/svg/pencil.svg',
    },
    {
      toolName: Tools.Pencil,
      iconUrl: '../../../../assets/svg/rectangle.svg',
    },
  ];

  public eraserItems: Tool[] = [
    {
      toolName: Tools.Eraser,
      iconUrl: '../../../../assets/svg/rectangle.svg',
    },
    {
      toolName: Tools.Eraser2,
      iconUrl: '../../../../assets/svg/oval.svg',
    },
  ];

  public fileItems: Tool[] = [
    {
      toolName: Tools.Save,
      iconUrl: '../../../../assets/svg/rectangle.svg',
    },
    {
      toolName: Tools.Open,
      iconUrl: '../../../../assets/svg/rectangle.svg',
    },
    {
      toolName: Tools.File,
      iconUrl: '../../../../assets/svg/undo.svg',
    },
  ];

  public actionItems: Tool[] = [
    {
      toolName: Tools.Undo,
      iconUrl: '../../../../assets/svg/undo.svg',
    },
    {
      toolName: Tools.Redo,
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

  setSelectedTool(valores: Tools) {
    this.selectedItemName = valores;

    switch (this.selectedItemName) {
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
        this.initSelectedTool();
        break;
    }
  }

  initSelectedTool() {
    this.toolsService.setSelectedButton(this.selectedItemName);
  }

  private undo(): void {
    // if normal array contains images, then it is porible to undo an action
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
