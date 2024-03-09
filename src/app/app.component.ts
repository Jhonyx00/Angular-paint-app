import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'PaintXD';

  ngOnInit(): void {}

  // @HostListener('window:resize', ['event']) onResize(event: any) {
  //   console.log(event);
  // }

  // elZoom = '';

  // @HostListener('window:resize', ['$event']) onResize(event: any) {
  //   this.elZoom = '100% ';
  //   alert(event.shiftKey);

  //   window.devicePixelRatio = 1.5;
  //   console.log(window.devicePixelRatio);
  // }
}
