// ref:
// - https://umijs.org/plugin/develop.html

export default function (api, opts) {
  const { baidu, ga, judge } = opts;
  api.log.success("insert analytics");

  if (judge && !judge()) {
    return false;
  }

  const baiduTpl = function (code) {
    return `
    (function() {
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?${code}";
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(hm, s);
    })();
  `;
  };

  const gaTpl = function (code) {
    return `
    (function(){
      if (!location.port) {
        (function (i, s, o, g, r, a, m) {
          i['GoogleAnalyticsObject'] = r;
          i[r] = i[r] || function () {
              (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date();
          a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
          a.async = 1;
          a.src = g;
          m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
        ga('create', '${code}', 'auto');
        ga('send', 'pageview');
      }
    })();
  `;
  };

  if (baidu) {
    api.addHTMLHeadScript({
      content: 'var _hmt = _hmt || [];'
    });
  }

  if (process.env.NODE_ENV === "production") {
    if (baidu) {
      api.addHTMLHeadScript({
        content: baiduTpl(baidu)
      });
    }
    if (ga) {
      api.addHTMLScript({
        content: gaTpl(ga)
      });
    }
  }

};
