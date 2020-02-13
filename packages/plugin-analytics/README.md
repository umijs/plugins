# @umijs/plugin-analytics

analytics for baidu tongji and google analytics

## Usage

Configure in `.umirc.js`,

```js
export default {
  plugins: ['@umijs/plugin-analytics'],
  analytics: {
    ga: 'google analytics code',
    baidu: '5a66cxxxxxxxxxx9e13',
  },
};
```

## Code

e.g `hm.src = "https://hm.baidu.com/hm.js?5a66c03cxxxxxx554f2b9e13";` baidu is `5a66c03cxxxxxx554f2b9e13`

## 百度事件跟踪

> 在 JS 中调用事件跟踪代码。 `window._hmt.push(['_trackEvent', category, action, opt_label, opt_value]);`

| 参数 | 说明 |
| :-- | :-: |
| category | 要监控的目标的类型名称，通常是同一组目标的名字，比如"视频"、"音乐"、"软件"、"游戏"等等。该项必填，不填、填"-"的事件会被抛弃。 |
| action | 用户跟目标交互的行为，如"播放"、"暂停"、"下载"等等。该项必填，不填、填"-"的事件会被抛弃。 |
| opt_label | 事件的一些额外信息，通常可以是歌曲的名称、软件的名称、链接的名称等等。该项选填，不填、填"-"代表此项为空。 |
| opt_value | 事件的一些数值信息，比如权重、时长、价格等等，在报表中可以看到其平均值等数据。该项可选。 |

## LICENSE

MIT
