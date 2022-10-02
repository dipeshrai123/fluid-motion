export type EndResult = { finished: boolean };
export type EndCallback = (result: EndResult) => void;

export class Animation {
  __active: boolean;
  __onEnd: EndCallback | null;
  start: (
    fromValue: number,
    onUpdate: (value: number) => void,
    onEnd: EndCallback | null,
    previousAnimation: Animation | null
  ) => void;
  stop(): void {}
  __debouncedOnEnd(result: EndResult) {
    var onEnd = this.__onEnd;
    this.__onEnd = null;
    onEnd && onEnd(result);
  }
}
