import React from 'react';
import { Link } from 'umi';
import { DatePicker } from 'antd';
import moment from 'moment';
import { useIntl, getLocale, getAllLocales, setLocale } from '../.umi-test/plugin-locale/localeExports';

export default function(props) {
  const intl = useIntl();
  const list = getAllLocales();
  const locale = getLocale();

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
        <Link key={locale} to={`/?locale=${locale}`}>
          {locale}
        </Link>
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
