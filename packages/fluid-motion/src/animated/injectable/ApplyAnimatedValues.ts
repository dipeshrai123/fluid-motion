export const ApplyAnimatedValues = {
  current: function ApplyAnimatedValues(instance: any, props: any): any {
    if (instance.setNativeProps) {
      instance.setNativeProps(props);
    } else {
      return false;
    }
  },
  transformStyles: function transformStyles(style: any) {
    return style;
  },
  inject(apply: any, transform: any) {
    ApplyAnimatedValues.current = apply;
    ApplyAnimatedValues.transformStyles = transform;
  },
};
