export const flattenStyle = {
  current: (style: any) => style,
  inject(flatten: any) {
    flattenStyle.current = flatten;
  },
};
