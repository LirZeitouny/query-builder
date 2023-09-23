import { RouteRecordRaw } from 'vue-router';
import RegistrationForm from '../components/authentication/RegistrationForm.vue';
import LoginForm from '../components/authentication/LoginForm.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/CreateQueryPage.vue') },
    ],
  },
  { path: '/register', component: RegistrationForm },
  { path: '/login', component: LoginForm },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
