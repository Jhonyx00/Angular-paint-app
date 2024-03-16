import { Component } from '@angular/core';
import { ToolsService } from '../../services/tools.service';
import { Tool } from 'src/app/shared/interfaces/selected-tool.interface';
import { CanvasStateService } from 'src/app/shared/services/canvas-state.service';

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

  private selectedItemName: string = '';
  private selectedItemId: number = 0;

  setSelectedTool(valores: { valor: string; id: number }) {
    this.selectedItemName = valores.valor;
    this.selectedItemId = valores.id;
    console.log('Tool: ', this.selectedItemName, this.selectedItemId);
    this.toolsService.setSelectedButton(this.selectedItemName);

    switch (valores.valor) {
      case 'Undo':
        this.undo();
        break;

      case 'Redo':
        this.redo();
        break;

      default:
        break;
    }
  }

  public shapes = 'Shapes';
  public selection = 'Selection';
  public pencils = 'Pencils';
  public erasers = 'Erasers';

  public files = 'File';

  public actions = 'Actions';

  ////arreglos
  public shapeItems: Tool[] = [
    {
      toolName: 'Rectangle',
      iconUrl: '../../../../assets/svg/rectangle.svg',
      id: 1,
    },
    {
      toolName: 'Ellipse',
      iconUrl: '../../../../assets/svg/oval.svg',
      id: 2,
    },
    {
      toolName: 'Hexagon',
      iconUrl: '../../../../assets/svg/hexagon.svg',
      id: 3,
    },
    {
      toolName: 'Triangle',
      iconUrl: '../../../../assets/svg/triangle.svg',
      id: 4,
    },
    {
      toolName: 'Star',
      iconUrl: '../../../../assets/svg/star.svg',
      id: 5,
    },
  ];

  public selectionItems: Tool[] = [
    {
      toolName: 'Move',
      iconUrl: '../../../../assets/svg/rectangle.svg',
      id: 1,
    },
    {
      toolName: 'Move 2',
      iconUrl: '../../../../assets/svg/star.svg',
      id: 2,
    },
  ];

  public pencilItems: Tool[] = [
    {
      toolName: 'Line',
      iconUrl: '../../../../assets/svg/pencil.svg',
      id: 1,
    },
    {
      toolName: 'Pencil',
      iconUrl: '../../../../assets/svg/rectangle.svg',
      id: 2,
    },
  ];

  public eraserItems: Tool[] = [
    {
      toolName: 'Eraser',
      iconUrl: '../../../../assets/svg/rectangle.svg',
      id: 1,
    },
    {
      toolName: 'Eraser 2',
      iconUrl: '../../../../assets/svg/oval.svg',
      id: 2,
    },
  ];

  public fileItems: Tool[] = [
    {
      toolName: 'Save',
      iconUrl: '../../../../assets/svg/rectangle.svg',
      id: 1,
    },
    {
      toolName: 'Open',
      iconUrl: '../../../../assets/svg/rectangle.svg',
      id: 2,
    },
    {
      toolName: 'File',
      iconUrl: '../../../../assets/svg/undo.svg',
      id: 3,
    },
  ];

  public actionItems: Tool[] = [
    {
      toolName: 'Undo',
      iconUrl: '../../../../assets/svg/undo.svg',
      id: 1,
    },
    {
      toolName: 'Redo',
      iconUrl: '../../../../assets/svg/redo.svg',
      id: 2,
    },
  ];
  //

  //Actions

  //// Actions

  private imagesList = new Array();
  private imagesListAux = new Array();

  // private selectedItem = '';

  ngOnInit(): void {
    this.initCanvasImageList();
  }

  private initCanvasImageList(): void {
    this.canvasStateService.imagesListObservable.subscribe((currentList) => {
      this.imagesList = currentList;
    });
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
