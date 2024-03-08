import { Component, OnInit } from '@angular/core';
import { PropertiesService } from '../../services/properties.service';
import { CanvasStateService } from '../../services/canvas-state.service';

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

  ngOnInit(): void {}

  undo() {
    this.propertiesService.shapeListValue.subscribe((currentShapeList) => {
      this.shapeList = currentShapeList;
    });

    //ckeck if it is possible to undo action
    if (this.shapeList.length > 0) {
      this.isUndoDisabled = false;
      this.shapeList2.push(this.shapeList.pop());
      //Insert array into canvas
      this.propertiesService.setShapeList(this.shapeList);
      //console.log('undo from actions', this.shapeList);
      //canvas state
      this.canvasStateService.updateCanvas();
      console.log('redo list', this.shapeList2);
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
