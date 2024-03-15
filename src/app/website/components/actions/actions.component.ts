import { Component, OnInit } from '@angular/core';
import { PropertiesService } from '../../../shared/services/properties.service';
import { CanvasStateService } from '../../../shared/services/canvas-state.service';
import {
  SelectedAction,
  SelectedTool,
} from '../../../shared/interfaces/selected-tool.interface';
import { ToolsService } from '../toolbar/services/tools.service';

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
  private imagesList2 = new Array();

  public selectedItem = '';

  private isRedoDisabled = false;
  private isUndoDisabled = false;

  ngOnInit(): void {
    this.initCanvasImageList();
  }

  public srcImages: SelectedAction[] = [
    {
      isDisabled: this.isUndoDisabled,
      toolName: 'Undo',
      imageURL: '../../../../assets/svg/undo.svg',
    },
    {
      isDisabled: this.isRedoDisabled,
      toolName: 'Redo',
      imageURL: '../../../../assets/svg/redo.svg',
    },
  ];

  private initCanvasImageList() {
    this.canvasStateService.imagesListObservable.subscribe((currentList) => {
      this.imagesList = currentList;
    });
  }

  selectAction(item: string) {
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

  undo() {
    // if normal array contains images, then it is porible to undo an action
    this.imagesList.length > 0
      ? (this.imagesList2.push(this.imagesList.pop()),
        (this.isUndoDisabled = false),
        console.log('lista de undo', this.imagesList),
        this.canvasStateService.setImagesList(this.imagesList))
      : (this.isUndoDisabled = true);
  }

  redo() {
    // if aux array contains images, then it is porible to redo an action
    this.imagesList2.length > 0
      ? (this.imagesList.push(this.imagesList2.pop()),
        (this.isRedoDisabled = false),
        console.log('lista de redo', this.imagesList),
        this.canvasStateService.setImagesList(this.imagesList))
      : (this.isRedoDisabled = true);
  }

  //this.canvasStateService.setImagesList(this.imagesList)
}
