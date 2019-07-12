import { join } from 'path';

export default {
  plugins: [
    [join(__dirname, '..', require('../package').main || 'index.js'),{
      code: '5a66c03cb0ae986f876184554f2b9e13',
      judge: ()=>true // true or false
    }],
  ],
}
