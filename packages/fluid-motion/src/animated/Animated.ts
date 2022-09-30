export class Animated {
  __attach: () => void;
  __detach: () => void;
  __getValue: () => any;
  __getAnimatedValue: () => any;
  __addChild: (child: Animated) => void;
  __removeChild: (child: Animated) => void;
  __getChildren: () => Array<Animated>;
}
