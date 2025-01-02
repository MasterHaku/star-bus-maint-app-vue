// src/router.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import HomeComponent from './components/Home.vue';
import VehicleComponent from './components/StarList.vue';
import StationsComponent from './components/StationsList.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomeComponent,
  },
  {
    path: '/vehicles',
    name: 'Vehicles',
    component: VehicleComponent,
  },
  {
    path: '/stations',
    name: 'Stations',
    component: StationsComponent,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
