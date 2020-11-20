import { IApi } from 'umi';

export default (api: IApi) => {
  const GA_KEY = process.env.GA_KEY;
  if (!api.userConfig.analytics && !GA_KEY) return;

  api.describe({
    key: 'analytics',
    config: {
      schema(joi) {
        return joi.object();
      },
    },
  });
  const { analytics = {} } = api.userConfig;
  const { baidu = false, ga = GA_KEY } = analytics || {};
  api.logger.log('insert analytics');

  const baiduTpl = (code: string) => {
    return `
    (function() {
      var hm = document.createElement('script');
      hm.src = 'https://hm.baidu.com/hm.js?${code}';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(hm, s);
    })();
  `;
  };

  // 引入gtag.js
  const requireGtagJs=(code:string)=>{
    return `
    (function() {
      var gtag = document.createElement("script");
      gtag.async = true;
      gtag.src = "https://www.googletagmanager.com/gtag/js?id=${code}";
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(gtag, s);
    })();
  `;
  }

  const gaTpl = (code: string) => {
    return `
    (function(){
      if (!location.port) {
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${code}');
      }
    })();
  `;
  };

  if (baidu) {
    api.addHTMLHeadScripts(() => [
      {
        content: 'var _hmt = _hmt || [];',
      },
    ]);
  }

  if (ga) {
    api.addHTMLHeadScripts(() => [
      {
        content: requireGtagJs(ga),
      },
    ]);
  }

  if (api.env !== 'development') {
    if (baidu) {
      api.addHTMLHeadScripts(() => [
        {
          content: baiduTpl(baidu),
        },
      ]);
    }
    if (ga) {
      api.addHTMLScripts(() => [
        {
          content: gaTpl(ga),
        },
      ]);
    }
  }
};
