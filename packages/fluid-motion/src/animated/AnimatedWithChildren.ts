import { Animated } from "./Animated";

export class AnimatedWithChildren extends Animated {
  _children: Array<Animated>;

  constructor() {
    super();
    this._children = [];
  }

  __addChild = (child: Animated): void => {
    if (this._children.length === 0) {
      this.__attach();
    }
    this._children.push(child);
  };

  __removeChild = (child: Animated): void => {
    var index = this._children.indexOf(child);
    if (index === -1) {
      console.warn("Trying to remove a child that doesn't exist");
      return;
    }
    this._children.splice(index, 1);
    if (this._children.length === 0) {
      this.__detach();
    }
  };

  __getChildren = (): Array<Animated> => {
    return this._children;
  };
}
