
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i);
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default));

Vue.component('example-component', require('./components/ExampleComponent.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

import Vue from 'vue'
import router from './router.js'
import store from './store.js'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import VueSweetalert2 from 'vue-sweetalert2'
import Permissions from './mixins/Permission.js'

Vue.use(VueSweetalert2)
Vue.use(BootstrapVue)
Vue.mixin(Permissions)

import 'bootstrap-vue/dist/bootstrap-vue.css'

import { mapActions, mapGetters, mapState } from 'vuex'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

new Vue({
    el: '#dw',
    router,
    store,
    components: {
        App
    },
    //[.. CODE SEBELUMNYA ..]
    computed: {
        ...mapGetters(['isAuth']),
        ...mapState(['token']), //GET TOKEN
        ...mapState('user', {
            user_authenticated: state => state.authenticated //MENGAMBIL STATE USER YANG SEDANG LOGIN
        })
    },
    methods: {
        ...mapActions('user', ['getUserLogin']),
        ...mapActions('notification', ['getNotifications']), //DEFINISIKAN FUNGSI UNTUK MENGAMBIL 
                                                             //NOTIFIKASI DARI TABLE NOTIFICATIONS
        ...mapActions('expenses', ['getExpenses']), //FUNGSI UNTUK MENGAMBIL EXPENSES YANG BARU
        //METHOD INI UNTUK MENGISIASI LISTER MENGGUNAKAN LARAVEL ECHO
        initialLister() {
            //JIKA USER SUDAH LOGIN
            if (this.isAuth) {
                //MAKA INISIASI FUNGSI BROADCASTER DENGAN KONFIGURASI BERIKUT
                window.Echo = new Echo({
                    broadcaster: 'pusher',
                    key: process.env.MIX_PUSHER_APP_KEY, //VALUENYA DI AMBIL DARI FILE .ENV
                    cluster: process.env.MIX_PUSHER_APP_CLUSTER,
                    encrypted: false,
                    auth: {
                        headers: {
                            Authorization: 'Bearer ' + this.token
                        },
                    },
                });

                if (typeof this.user_authenticated.id != 'undefined') {
                    //KEMUDIAN KITA MENGAKSES CHANNEL BROADCAST SECARA PRIVATE
                    window.Echo.private(`App.User.${this.user_authenticated.id}`)
                    .notification(() => {
                        //APABILA DITEMUKAN, MAKA KITA MENJALANKAN KEDUA FUNGSI INI
                        //UNTUK MENGAMBIL DATA TERBARU
                        this.getNotifications()
                        this.getExpenses()
                    })
                }
            }
        }
    },

    watch: {
        //KITA WATCH KETIKA VALUE TOKEN BERUBAH, MAKA 
        token() {
            this.initialLister() //KITA JALANKAN FUNGSI UNTUK MENGINISIASI LAGI
        },
        //KETIKA VALUE USER YANG SEDANG LOGIN BERUBAH
        user_authenticated() {
            this.initialLister() //KITA JALANKAN LAGI
        }
    },
    created() {
        if (this.isAuth) {
            this.getUserLogin() //REQUEST DATA YANG SEDANG LOGIN
             //TAMBAHKAN BAGIAN INI KETIKA COMPONENT DILOAD
            this.initialLister()
            this.getNotifications()
        }
    }
    
})
