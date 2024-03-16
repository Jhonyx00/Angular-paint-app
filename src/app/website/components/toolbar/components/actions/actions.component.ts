import { Component, OnInit } from '@angular/core';
import { CanvasStateService } from '../../../../../shared/services/canvas-state.service';
import { Tool } from '../../../../../shared/interfaces/selected-tool.interface';
import { ToolsService } from '../../services/tools.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.css'],
})
export class ActionsComponent implements OnInit {
  constructor(
    private toolsService: ToolsService,
    private canvasStateService: CanvasStateService
  ) {}

  private imagesList = new Array();
  private imagesListAux = new Array();

  private selectedItem = '';

  ngOnInit(): void {
    this.initCanvasImageList();
  }

  public actions: Tool[] = [
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

  private initCanvasImageList(): void {
    this.canvasStateService.imagesListObservable.subscribe((currentList) => {
      this.imagesList = currentList;
    });
  }

  public selectAction(item: string): void {
    this.selectedItem = item;
    this.toolsService.setSelectedButton(this.selectedItem);
    console.log('action: ', this.selectedItem);

    switch (item) {
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
