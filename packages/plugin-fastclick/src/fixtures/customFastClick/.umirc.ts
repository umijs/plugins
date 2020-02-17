
import { join } from 'path';

export default {
  history: {
    type: 'memory',
    options: {
      initialEntries: ['/'],
    },
  },
  fastclick: {
    libraryPath: join(__dirname, 'fastClick'),
  },
  mountElementId: '',
  routes: [
    { path: '/', component: 'index' },
  ],
}
