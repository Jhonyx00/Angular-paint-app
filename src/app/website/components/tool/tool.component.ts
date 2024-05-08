import { Component, Input, OnInit } from '@angular/core';
import { IconTool } from '../../interfaces/tool.interface';
import { ToolName } from '../../enums/tool-name.enum';
import { CanvasStateService } from '../../services/canvas-state.service';
import { ToolsService } from '../../services/tools.service';

@Component({
  selector: 'tool-component',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.css'],
})
export class ToolComponent implements OnInit {
  constructor(
    private toolsService: ToolsService,
    private canvasStateService: CanvasStateService
  ) {}
  ngOnInit(): void {
    this.initCanvasImageList();
  }
  @Input() toolItems: IconTool[] = [];
  @Input() toolGroupName: string = '';

  private imagesList = new Array();
  private imagesListAux = new Array();

  public selectedTool!: IconTool;
  public selectedFileTool!: IconTool;

  private initCanvasImageList(): void {
    this.canvasStateService.getImageList().subscribe((currentList) => {
      this.imagesList = currentList;
    });
  }

  setSelectedTool(toolName: IconTool) {
    if (
      toolName.name == ToolName.Undo ||
      toolName.name == ToolName.Redo ||
      toolName.name == ToolName.Save
    ) {
      this.selectedFileTool = toolName;
      switch (this.selectedFileTool.name) {
        case ToolName.Undo:
          this.undo();
          break;

        case ToolName.Redo:
          this.redo();
          break;

        case ToolName.Save:
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
    if (this.imagesList.length > 0) {
      this.imagesListAux.push(this.imagesList.pop());

      console.log('undo list', this.imagesList);
      this.canvasStateService.setImageList(this.imagesList);
    } else {
    }
  }

  private redo(): void {
    if (this.imagesListAux.length > 0) {
      this.imagesList.push(this.imagesListAux.pop());

      console.log('redo list', this.imagesList);
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
