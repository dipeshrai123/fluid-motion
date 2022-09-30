export const InteractionManager = {
  current: {
    createInteractionHandle: function () {},
    clearInteractionHandle: function (_handle: any) {},
  },
  inject(manager: any) {
    InteractionManager.current = manager;
  },
};
