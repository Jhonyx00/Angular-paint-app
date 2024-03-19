import { CanvasDimensions } from './canvas-dimensions.interface';
import { CursorPosition } from './cursor-position.interface';

export interface StatusbarProperties {
  canvasSize: CanvasDimensions;
  isOutsideCanvas: boolean;
  cursorPosition: CursorPosition;
}
