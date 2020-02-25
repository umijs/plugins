import React from 'react';
import {
  _,
  moment,
  classnames,
  debug,
  jsCookie,
  queryString,
  ReactHelmet,
} from 'umi';

export default () => {
  console.log('util test page', ReactHelmet);
  jsCookie.set('testcookit', 'testcookitvalue');
  return (
    <>
      <ReactHelmet defaultTitle="TITLE" />
      <ul>
        <li>lodash test: {_.sum([1, 1])}</li>
        <li>moment test: {moment().format('YYYY-MM-DD')}</li>
        <li>debug test: {typeof debug}</li>
        <li>jsCookie: {jsCookie.get('testcookit')}</li>
        <li>queryString: {queryString.stringify({ a: 'test' })}</li>
      </ul>
    </>
  );
};
