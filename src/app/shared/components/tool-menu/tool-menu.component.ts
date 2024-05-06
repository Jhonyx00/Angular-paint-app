import { Component, Input, OnInit } from '@angular/core';
import { IconTool } from 'src/app/website/interfaces/tool.interface';

@Component({
  selector: 'app-tool-menu',
  templateUrl: './tool-menu.component.html',
  styleUrls: ['./tool-menu.component.css'],
})
export class ToolMenuComponent implements OnInit {
  ngOnInit(): void {
    console.log(this.toolItems);
  }
  @Input() toolGroupName: string = '';
  @Input() toolItems: IconTool[] = [];
}
