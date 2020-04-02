import React, { useState, useEffect } from 'react';
import { useIntl, getLocale, addLocale, getAllLocales, setLocale, formatMessage } from '../.umi-test/plugin-locale/localeExports';

export default function() {
  const intl = useIntl();
  const [list, setList] = useState(getAllLocales());
  const locale = getLocale();

  useEffect(() => {
    // Dynamically add new languages
    addLocale('zh-TW', {
      name: '妳好 {name}',
    });
    // refresh the list
    setList(getAllLocales());
  }, []);

  return (
    <div>
      <h1>Current language:{locale}</h1>
      <h2>{formatMessage({ id: 'name' }, { name: 'Traveler' })}</h2>
      {list.map(locale => (
        <a key={locale} onClick={() => { setLocale(locale, false) }}>
          {locale}
        </a>
      ))}
      <button data-testid="display" type="primary">
        {intl.formatMessage(
          {
            id: 'name',
          },
          {
            name: 'Traveler',
          },
        )}
      </button>
    </div>
  );
}
