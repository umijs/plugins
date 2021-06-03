const getLayoutRenderConfig = (currentPathConfig: {
  layout:
    | {
        hideMenu: boolean;
        hideNav: boolean;
        hideFooter: boolean;
      }
    | false;
  hideFooter: boolean;
}) => {
  const layoutRender: any = {};

  if (currentPathConfig?.hideFooter) {
    layoutRender.footerRender = false;
  }

  if (currentPathConfig?.layout == false) {
    layoutRender.pure = true;
    return layoutRender;
  }

  if (currentPathConfig?.layout?.hideMenu) {
    layoutRender.menuRender = false;
  }

  if (currentPathConfig?.layout?.hideFooter) {
    layoutRender.footerRender = false;
  }

  if (currentPathConfig?.layout?.hideNav) {
    layoutRender.headerRender = false;
  }

  return layoutRender;
};

export default getLayoutRenderConfig;
