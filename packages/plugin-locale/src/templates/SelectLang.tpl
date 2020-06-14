import React from 'react';
{{#Antd}}
import GlobalOutlined from '{{{ iconsPkgPath }}}/GlobalOutlined';
import { Menu, Dropdown } from 'antd';
import { ClickParam } from 'antd/{{{antdFiles}}}/menu';
import { DropDownProps } from 'antd/{{{antdFiles}}}/dropdown';
{{/Antd}}
import { getLocale, getAllLocales, setLocale } from './localeExports';

{{#Antd}}
export interface HeaderDropdownProps extends DropDownProps {
  overlayClassName?: string;
  placement?:
    | 'bottomLeft'
    | 'bottomRight'
    | 'topLeft'
    | 'topCenter'
    | 'topRight'
    | 'bottomCenter';
}

const HeaderDropdown: React.FC<HeaderDropdownProps> = ({
  overlayClassName: cls,
  ...restProps
}) => (
  <Dropdown
    overlayClassName={cls}
    {...restProps}
  />
);
{{/Antd}}

interface LocalData {
    lang: string,
    label?: string,
    icon?: string,
    title?: string,
}

interface SelectLangProps {
  globalIconClassName?: string,
  postLocalesData?: (locales: LocalData[]) => LocalData[],
  onItemClick?: (params:ClickParam) => void,
  className?:string;
}

const transformArrayToObject = (allLangUIConfig:LocalData[])=>{
  return allLangUIConfig.reduce((obj, item) => {
    if(!item.lang){
      return obj;
    }

    return {
      ...obj,
      [item.lang]: item,
    };
  }, {});
}

const defaultLangUConfigMap = {
  'zh-CN': {
    lang: 'zh-CN',
    label: '简体中文',
    icon: '🇨🇳',
    title: '语言'
  },
  'zh-TW': {
    lang: 'zh-TW',
    label: '繁体中文',
    icon: '🇭🇰',
    title: '語言'
  },
  'en-US': {
    lang: 'en-US',
    label: 'English',
    icon: '🇺🇸',
    title: 'Language'
  },
  'pt-BR': {
    lang: 'pt-BR',
    label: 'Português',
    icon: '🇧🇷',
    title: 'Idiomas'
  }
};

export const SelectLang: React.FC<SelectLangProps> = (props) => {
  {{#ShowSelectLang}}
  const { globalIconClassName, postLocalesData, onItemClick, ...restProps } = props;
  const selectedLang = getLocale();

  const changeLang = ({ key }: ClickParam): void => setLocale(key);

  const defaultLangUConfig = getAllLocales().map(
    key =>
      defaultLangUConfigMap[key] || {
        lang: key,
        label: key,
        icon: '🌐',
        title: key
      }
  );


  const allLangUIConfig = transformArrayToObject(postLocalesData ?  postLocalesData(defaultLangUConfig): defaultLangUConfig);

 const handleClick = onItemClick
  ? (params: ClickParam) => onItemClick(params)
  : changeLang;

  const menuItemStyle = { minWidth: '160px' }
  const langMenu = (
    <Menu 
      selectedKeys={[selectedLang]} onClick={handleClick}
    >
     {{#LocaleList}}
        <Menu.Item key={'{{locale}}'} style={menuItemStyle}>
          <span role='img' aria-label={allLangUIConfig['{{locale}}']?.label  || '{{locale}}'}>
            {allLangUIConfig['{{locale}}']?.icon || "🌐"}
          </span>{' '}
          {allLangUIConfig['{{locale}}']?.label || '{{locale}}'}
        </Menu.Item>
      {{/LocaleList}}
    </Menu>
  );

  const style = {
    cursor: 'pointer',
    padding: '0 12px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24
  }

  return (
    <HeaderDropdown overlay={langMenu} placement='bottomRight' {...restProps}>
      <span 
        className={globalIconClassName} 
        style={style}>
        <GlobalOutlined title={allLangUIConfig[selectedLang]?.title} />
      </span>
    </HeaderDropdown>
  );
  {{/ShowSelectLang}}
  return <></>
};
