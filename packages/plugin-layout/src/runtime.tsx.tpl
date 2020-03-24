import React from 'react';
import * as allIcons from '@ant-design/icons/es/icons';

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
  data.forEach((item = { path: '/' }) => {
    // Compatible with item.menu.icon and item.icon
    // The priority of item.menu.icon is higher
    const icon = item.menu?.icon || item.icon;
    if (icon) {
      const v4IconName = toHump(icon.replace(icon[0], icon[0].toUpperCase()));
      const NewIcon = allIcons[icon] || allIcons[`${v4IconName}Outlined`];
      if (NewIcon) {
        try {
          if (item.menu && item.menu.icon) {
            item.menu.icon = React.createElement(NewIcon);
          } else {
            item.icon = React.createElement(NewIcon);
          }
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
