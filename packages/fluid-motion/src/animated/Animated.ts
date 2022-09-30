export class Animated {
  __attach: () => void = () => {};
  __detach: () => void = () => {};
  __getValue: () => any = () => {};
  __getAnimatedValue: () => any = () => this.__getValue();
  __addChild: (child: Animated) => void = () => {};
  __removeChild: (child: Animated) => void = () => {};
  __getChildren: () => Array<Animated> = () => [];
}
