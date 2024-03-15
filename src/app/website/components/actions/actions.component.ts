import { Component, OnInit } from '@angular/core';
import { PropertiesService } from '../../../shared/services/properties.service';
import { CanvasStateService } from '../../../shared/services/canvas-state.service';
import { SelectedTool } from '../../../shared/interfaces/selected-tool.interface';
import { ToolsService } from '../toolbar/services/tools.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.css'],
})
export class ActionsComponent implements OnInit {
  constructor(
    private propertiesService: PropertiesService,
    private toolsService: ToolsService
  ) {}

  private imagesList = new Array();
  private imagesList2 = new Array();

  public selectedItem = '';

  ngOnInit(): void {
    this.initShapeList();
  }

  public srcImages: SelectedTool[] = [
    {
      id: 1,
      toolName: 'Undo',
      imageURL: '../../../../assets/svg/undo.svg',
    },
    {
      id: 2,
      toolName: 'Redo',
      imageURL: '../../../../assets/svg/redo.svg',
    },
  ];

  private initShapeList() {
    this.propertiesService.imagesListObservable.subscribe((currentList) => {
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
    //ckeck if it is possible to undo action
    if (this.imagesList.length > 0) {
      this.imagesList2.push(this.imagesList.pop());
      //canvas state
      // this.canvasStateService.updateCanvas();
    }

    console.log('lista de undo', this.imagesList);
  }

  redo() {
    if (this.imagesList2.length > 0) {
      this.imagesList.push(this.imagesList2.pop());
      //canvas state
      // this.canvasStateService.updateCanvas();
    }

    console.log('lista de redo', this.imagesList);
  }
}
