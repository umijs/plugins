import React, { useEffect } from 'react';
import { DatePicker, Button } from 'antd';
import moment from 'moment';
import zhTW from 'antd/es/locale/zh_TW';
import { useIntl, getLocale, addLocale, getAllLocales, setLocale } from '../.umi-test/plugin-locale/localeExports';

export default function(props) {
  const intl = useIntl();
  const list = getAllLocales();
  const locale = getLocale();

  useEffect(() => {
    // Dynamically add new languages
    addLocale('zh-TW', {
      name: '妳好 {name}',
      'about.title': '關於標題'
    }, {
      momentLocale: 'zh-tw',
      antd: zhTW,
    });
  }, []);

  return (
    <div>
      <h1>Current language:{locale}</h1>
      <h2>标题: <p id="title">{props.route.title}</p></h2>
      <DatePicker />
      <p id="moment">{moment().set({
              year: 2020,
              month: 2,
              date: 21,
            })
            .format('LL')}</p>
      {list.map(locale => (
        <Button key={locale} onClick={() => { setLocale(locale, false) }}>
          {locale}
        </Button>
      ))}
      <p data-testid="display" type="primary">
        {intl.formatMessage(
          {
            id: 'name',
          },
          {
            name: 'Traveler',
          },
        )}
      </p>
    </div>
  );
}
