export interface DynamicComponentProperties {
  top: number;
  left: number;

  //colocar referenceWidth y referenceHeigt para que se tomen de referencia al redimensionar
  width: number;
  height: number;

  referenceWidth: number;
  referenceHeight: number;
  background: string;

  componentClass: string;
  //podria ahorrarme estos dos si lo sustituyo por una clase, puesto que un elemento puede tener mas de una sola clase
}
