
import { join } from 'path';

export default {
  history: {
    type: 'memory',
    options: {
      initialEntries: ['/'],
    },
  },
  fastClick: {
    libraryPath: join(__dirname, 'fastClick'),
  },
  mountElementId: '',
  routes: [
    { path: '/', component: 'index' },
  ],
}
