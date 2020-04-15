const react = require('react');
// @ts-ignore
import allIcons from '@@/plugin-layout/icons';

export interface MenuDataItem {
  children?: MenuDataItem[];
  routes?: MenuDataItem[];
  hideChildrenInMenu?: boolean;
  hideInMenu?: boolean;
  icon?: string;
  locale?: string;
  name?: string;
  key?: string;
  path?: string;
  [key: string]: any;
}
function toHump(name: string) {
  return name.replace(/\-(\w)/g, function(all, letter) {
    return letter.toUpperCase();
  });
}

function formatter(data: MenuDataItem[]): MenuDataItem[] {
  if (!Array.isArray(data)) {
    return data;
  }
  (data || []).forEach((item = { path: '/' }) => {
    if (item.icon && typeof item.icon === "string") {
      const { icon } = item;
      const v4IconName = toHump(icon.replace(icon[0], icon[0].toUpperCase()));
      const NewIcon = allIcons[icon] || allIcons[`${v4IconName}Outlined`];
      if (NewIcon) {
        try {
          item.icon = react.createElement(NewIcon);
        } catch (error) {
          console.log(error);
        }
      }
    }
    if (item.routes || item.children) {
      const children = formatter(item.routes || item.children);
      // Reduce memory usage
      item.children = children;
    }
  });
  return data;
}

export function patchRoutes({ routes }) {
  formatter(routes);
}