import Vue from 'vue'
import VueRouter from 'vue-router'

import autoriseComponent from '../components/autoriseComponent'
import mainPage from '../components/mainPage'
import kp from '../components/kp'
import editZakazForm from '../components/managerPanel/editZakazForm'
import addZakazForm from '../components/managerPanel/addZakazForm'
import tovarToBase from '../components/managerPanel/tovarToBase'
import scladToBase from '../components/scladToBase'
import finalReport from '../components/finalReport'
import roatLists from '../components/zakupPanel/roatLists'
import editRoadList from '../components/zakupPanel/editRoadList'

import store from '../store';
import allLibs from '../lib/libs'

Vue.use(VueRouter);

let router = new VueRouter ( {
    mode: 'history',    
    routes: [
            {
                path: '/',
                name: 'service',
                meta: {title: "Панель управления"},
                component: mainPage
            },
            
            {
                path: '/add_zak',
                name: 'addzak',
                meta: {title: "Создать заказ"},
                component: addZakazForm
            },
            
            {
                path: '/edit_zak/:number?',
                name: 'editzak',
                meta: {title: "Редактировать заказ"},
                component: editZakazForm
            },
            
            {
                path: '/edit_roadlist/:listid?',
                name: 'editroadlist',
                meta: {title: "Редактировать маршрутный лист"},
                component: editRoadList
            },
            
            {
                path: '/add_tov_to_base',
                name: 'addtovtobase',
                meta: {title: "Добавление товаров в базу"},
                component: tovarToBase
            },
            
            {
                path: '/add_sclad_to_base',
                name: 'addscladtobase',
                meta: {title: "Управление складами"},
                component: scladToBase
            },

            {
                path: '/sale_report',
                name: 'salereport',
                meta: {title: "Отчет о продажах"},
                component: finalReport
            },

            {
                path: '/roat_lists',
                name: 'roatlists',
                meta: {title: "Маршрутные листы"},
                component: roatLists
            },

            {
                path: '/login',
                name: 'login',
                meta: {title: "Авторизация в LS CRM"},
                component: autoriseComponent
            },

            {
                path: '/kp/:number?',
                name: 'kp',
                meta: {title: "Коммерческое предложение"},
                component: kp
            }


            
        ]
    }
);

router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
       
    let autorise = allLibs.getCookie("servautorise"); 
    if (autorise != undefined) 
    {
        store.dispatch('chengeAutorise',  true);
        store.dispatch('chengeUserName',   localStorage.getItem('fio'));
        store.dispatch('chengeUserStatus',   localStorage.getItem('status'));
        store.dispatch('chengeUserEmail',   localStorage.getItem('mail'));
        store.dispatch('showedPanel',  true);
    }
    else {
        store.dispatch('chengeAutorise',  false);
        if (to.name !== "login") 
           allLibs.reloginUser();
        
        store.dispatch('showedPanel',  false);
    } 

    if ((!store.getters.AUTORISE) && (to.name !== "login")) {
        router.push({ name: 'login' })
    }   
    
    next();
});

export default router;