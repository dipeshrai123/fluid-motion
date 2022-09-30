export const FlattenStyle = {
  current: (style: any) => style,
  inject(flatten: any) {
    FlattenStyle.current = flatten;
  },
};
