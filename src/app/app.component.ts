import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'PaintXD';
  public preferedWidth = 0;
  public preferedHeight = 0;
  public color = '#000s';

  ngOnInit(): void {
    this.preferedWidth = 800;
    this.preferedHeight = 600;
  }

  current: string = 'red';
  change(color: string) {
    this.current = color;
  }
}
