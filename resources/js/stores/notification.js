import $axios from '../api.js'

const state = () => ({
    notifications: [] //MENAMPUNG DATA NOTIFIKASI
})

const mutations = {
    //ASSIGN DATA NOTIFIKASI KE DALAM STATE NOTIFICATIONS
    ASSIGN_DATA(state, payload) {
        state.notifications = payload
    }
}

const actions = {
    getNotifications({ commit }) {
        return new Promise((resolve, reject) => {
            //REQUEST KE SERVER UNTUK MENGAMBIL NOTIFIKASI
            $axios.get(`/notification`)
            .then((response) => {
                //DATA YANG DITERIMA DI COMMIT KE MUTATIONS ASSING_DATA
                commit('ASSIGN_DATA', response.data.data)
                resolve(response.data)
            })
        })
    },
    readNotification({ dispatch }, payload) {
        return new Promise((resolve, reject) => {
            //UNTUK MENGUPDATE DATA NOTIFIKASI BAHWA NOTIF TERSEBUT SUDAH DIBACA
            $axios.post(`/notification`, payload)
            .then((response) => {
                //AMBIL DATA NOTIFIKASI TERBARU
                dispatch('getNotifications').then(() => resolve(response.data))
            })
        })   
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}