import { Component, OnInit } from '@angular/core';
import { PropertiesService } from '../../services/properties.service';
import { CanvasStateService } from '../../services/canvas-state.service';
import { SelectedTool } from '../../interfaces/selected-tool.interface';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.css'],
})
export class ActionsComponent implements OnInit {
  constructor(
    private propertiesService: PropertiesService,
    private canvasStateService: CanvasStateService
  ) {}

  private shapeList = new Array();
  private shapeList2 = new Array();

  public isUndoDisabled = false;
  public isRedoDisabled = false;

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
    this.propertiesService.shapeListValue.subscribe((currentShapeList) => {
      this.shapeList = currentShapeList;
    });
  }

  selectAction(item: string) {
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
    if (this.shapeList.length > 0) {
      this.isUndoDisabled = false;
      this.shapeList2.push(this.shapeList.pop());
      //canvas state
      this.canvasStateService.updateCanvas();
    }
  }

  redo() {
    if (this.shapeList2.length > 0) {
      this.isRedoDisabled = false;
      this.shapeList.push(this.shapeList2.pop());
      //canvas state
      this.canvasStateService.updateCanvas();
    }
  }
}
