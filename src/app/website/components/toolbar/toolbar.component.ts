import { Component } from '@angular/core';
import { ToolName } from 'src/app/website/enums/tool-name.enum';
import { Tool } from 'src/app/website/interfaces/tool.interface';

@Component({
  selector: 'toolbar-component',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent {
  public selectedTool!: ToolName;
  public selectedFileTool!: ToolName;

  public shapes = 'Shapes';
  public selection = 'Select';
  public pencils = 'Pencils';
  public erasers = 'Erasers';
  public files = 'File';
  public actions = 'Actions';

  ////Tool arrays
  public shapeItems: Tool[] = [
    {
      toolName: ToolName.Rectangle,
      iconUrl: '../../../../assets/svg/rectangle.svg',
    },
    {
      toolName: ToolName.Ellipse,
      iconUrl: '../../../../assets/svg/oval.svg',
    },
    {
      toolName: ToolName.Hexagon,
      iconUrl: '../../../../assets/svg/hexagon.svg',
    },
    {
      toolName: ToolName.Triangle,
      iconUrl: '../../../../assets/svg/triangle.svg',
    },
    {
      toolName: ToolName.Pentagon,
      iconUrl: '../../../../assets/svg/pentagon.svg',
    },
    {
      toolName: ToolName.Star,
      iconUrl: '../../../../assets/svg/star.svg',
    },

    {
      toolName: ToolName.Rhombus,
      iconUrl: '../../../../assets/svg/rhombus.svg',
    },
  ];

  public selectionItems: Tool[] = [
    {
      toolName: ToolName.Select,
      iconUrl: '../../../../assets/svg/select.svg',
    },
    {
      toolName: ToolName.Select2,
      iconUrl: '../../../../assets/svg/star.svg',
    },
  ];

  public pencilItems: Tool[] = [
    {
      toolName: ToolName.Line,
      iconUrl: '../../../../assets/svg/pencil.svg',
    },
    {
      toolName: ToolName.Pencil,
      iconUrl: '../../../../assets/svg/rectangle.svg',
    },
  ];

  public eraserItems: Tool[] = [
    {
      toolName: ToolName.Eraser,
      iconUrl: '../../../../assets/svg/eraser.svg',
    },
    {
      toolName: ToolName.Eraser2,
      iconUrl: '../../../../assets/svg/oval.svg',
    },
  ];

  public fileItems: Tool[] = [
    {
      toolName: ToolName.Save,
      iconUrl: '../../../../assets/svg/rectangle.svg',
    },
    {
      toolName: ToolName.Open,
      iconUrl: '../../../../assets/svg/rectangle.svg',
    },
    {
      toolName: ToolName.File,
      iconUrl: '../../../../assets/svg/undo.svg',
    },
  ];

  public actionItems: Tool[] = [
    {
      toolName: ToolName.Undo,
      iconUrl: '../../../../assets/svg/undo.svg',
    },
    {
      toolName: ToolName.Redo,
      iconUrl: '../../../../assets/svg/redo.svg',
    },
  ];
}
