import {createRouter, createMemoryHistory} from 'vue-router'
import Home from '../components/Home.vue'


const routes = [
    {
        path:'/',
        component:Home
    }
];

const router = createRouter({
    history:createMemoryHistory(),
    routes
})

export default router;