import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToolName } from 'src/app/website/enums/tool-name.enum';
import { Tool } from 'src/app/website/interfaces/tool.interface';
import { CanvasStateService } from '../../services/canvas-state.service';
import { ToolsService } from '../../services/tools.service';

@Component({
  selector: 'tool-component',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.css'],
})
export class ToolComponent {
  constructor(
    private toolsService: ToolsService,
    private canvasStateService: CanvasStateService
  ) {}
  @Input() toolItems: Tool[] = [];
  @Input() toolGroupName: string = '';

  private imagesList = new Array();
  private imagesListAux = new Array();

  public selectedTool!: ToolName;
  public selectedFileTool!: ToolName;

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
    const base64ImageData = this.imagesList[this.imagesList.length - 1];
    let imageName = prompt('Enter image name');
    const downloadLink = document.createElement('a');
    downloadLink.href = base64ImageData;
    downloadLink.download = imageName || 'image1';
    downloadLink.click();
    window.URL.revokeObjectURL(downloadLink.href);
  }
}
