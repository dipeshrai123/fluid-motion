export const requestAnimationFrame = {
  current: (cb: any) => window.requestAnimationFrame(cb),
  inject(injected: any) {
    requestAnimationFrame.current = injected;
  },
};

export const cancelAnimationFrame = {
  current: (id: any) => window.cancelAnimationFrame(id),
  inject(injected: any) {
    cancelAnimationFrame.current = injected;
  },
};
