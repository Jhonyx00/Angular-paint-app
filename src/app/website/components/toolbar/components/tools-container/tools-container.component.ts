import { Component } from '@angular/core';
import { ToolsService } from '../../services/tools.service';
import { Tool } from 'src/app/shared/interfaces/selected-tool.interface';
import { CanvasStateService } from 'src/app/shared/services/canvas-state.service';
import { ToolComponent } from '../tool/tool.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './tools-container.component.html',
  styleUrls: ['./tools-container.component.css'],
})
export class ToolbarComponent {
  constructor(
    private toolsService: ToolsService,
    private canvasStateService: CanvasStateService
  ) {}

  public selectedItemName: string = '';

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
      toolName: 'Rectangle',
      iconUrl: '../../../../assets/svg/rectangle.svg',
    },
    {
      toolName: 'Ellipse',
      iconUrl: '../../../../assets/svg/oval.svg',
    },
    {
      toolName: 'Hexagon',
      iconUrl: '../../../../assets/svg/hexagon.svg',
    },
    {
      toolName: 'Triangle',
      iconUrl: '../../../../assets/svg/triangle.svg',
    },
    {
      toolName: 'Star',
      iconUrl: '../../../../assets/svg/star.svg',
    },
  ];

  public selectionItems: Tool[] = [
    {
      toolName: 'Select',
      iconUrl: '../../../../assets/svg/rectangle.svg',
    },
    {
      toolName: 'Move 2',
      iconUrl: '../../../../assets/svg/star.svg',
    },
  ];

  public pencilItems: Tool[] = [
    {
      toolName: 'Line',
      iconUrl: '../../../../assets/svg/pencil.svg',
    },
    {
      toolName: 'Pencil',
      iconUrl: '../../../../assets/svg/rectangle.svg',
    },
  ];

  public eraserItems: Tool[] = [
    {
      toolName: 'Eraser',
      iconUrl: '../../../../assets/svg/rectangle.svg',
    },
    {
      toolName: 'Eraser 2',
      iconUrl: '../../../../assets/svg/oval.svg',
    },
  ];

  public fileItems: Tool[] = [
    {
      toolName: 'Save',
      iconUrl: '../../../../assets/svg/rectangle.svg',
    },
    {
      toolName: 'Open',
      iconUrl: '../../../../assets/svg/rectangle.svg',
    },
    {
      toolName: 'File',
      iconUrl: '../../../../assets/svg/undo.svg',
    },
  ];

  public actionItems: Tool[] = [
    {
      toolName: 'Undo',
      iconUrl: '../../../../assets/svg/undo.svg',
    },
    {
      toolName: 'Redo',
      iconUrl: '../../../../assets/svg/redo.svg',
    },
  ];
  //

  ngOnInit(): void {
    this.initCanvasImageList();
  }

  private initCanvasImageList(): void {
    this.canvasStateService.imagesListObservable.subscribe((currentList) => {
      this.imagesList = currentList;
    });
  }

  setSelectedTool(valores: string) {
    this.selectedItemName = valores;
    // this.selectedItemId = valores.id;
    console.log('Tool: ', this.selectedItemName);

    switch (this.selectedItemName) {
      case 'Undo':
        this.undo();
        break;

      case 'Redo':
        this.redo();
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
      this.canvasStateService.setImagesList(this.imagesList);
    } else {
    }
  }

  private redo(): void {
    // if aux array contains images, then it is porible to redo an action
    if (this.imagesListAux.length > 0) {
      this.imagesList.push(this.imagesListAux.pop());

      console.log('lista de redo', this.imagesList);
      this.canvasStateService.setImagesList(this.imagesList);
    } else {
    }
  }
}
