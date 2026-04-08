import "preact";

declare global {
  namespace JSX {
    interface IntrinsicElements extends preact.JSX.IntrinsicElements { }
  }
}