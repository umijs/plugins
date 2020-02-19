# umi-plugin-block-dev

[![NPM version](https://img.shields.io/npm/v/umi-plugin-block-dev.svg?style=flat)](https://npmjs.org/package/umi-plugin-block-dev)
[![NPM downloads](http://img.shields.io/npm/dm/umi-plugin-block-dev.svg?style=flat)](https://npmjs.org/package/umi-plugin-block-dev)

A umi plugin for develop a umi block with umi

## Layout

### blankLayout

![image](https://user-images.githubusercontent.com/8186664/59409733-83d23a80-8de9-11e9-9a0b-e41b8b4ce5a8.png)

### ant-design-pro

![image](https://user-images.githubusercontent.com/8186664/59409669-52f20580-8de9-11e9-8f4f-23ee873efe1b.png)

### ant-design-pro-user

![image](https://user-images.githubusercontent.com/8186664/59409597-1f16e000-8de9-11e9-8993-e68ec1b4da0e.png)

## Usage

Configure in `.umirc.js`,

```js
export default {
  plugins: [['umi-plugin-block-dev', options]]
};
```

And you can use `create-umi` to create a umi block automatically:

```sh
$ yarn create umi --block
```

## options

```js
{
  layout: 'ant-design-pro', // or ant-design-pro-user
  menu: {
    name: 'demo',
    icon: 'home',
  },
  mockUmiRequest: true // whether to build mock data . _mock.js
}
```

### env

- BLOCK_DEV_PATH: custom block preview path
- BLOCK_DEV_MOCK_UMI_REQUEST: package mock data to build result, for build static preview site
- BLOCK_PAGES_LAYOUT: custom block Layout

## LICENSE

MIT
