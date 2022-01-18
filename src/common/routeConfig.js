import { App, HomePage } from '../features/home';

const routes = [
  {
    path: '/:chain',
    component: App,
    childRoutes: [{ path: '/:chain', component: HomePage, isIndex: true }],
  },
];

export default routes;
