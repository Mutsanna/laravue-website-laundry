import $axios from '../api.js'

const state = () => ({
    expenses: [], //UNTUK MENAMPUNG DATA EXPENSES
    page: 1 //STATE UNTUK HALAMAN YANG SEDANG AKTIF
})

const mutations = {
    //ASSIGN DATA EXPENSES YANG DIDAPATKAN KE DALAM STATE
    ASSIGN_DATA(state, payload) {
        state.expenses = payload
    },
    //SET PAGE YANG AKTIF KE DALAM STATE PAGE
    SET_PAGE(state, payload) {
        state.page = payload
    }
}

const actions = {
    //FUNGSI UNTUK MENG-HANDLE REQUEST KE BACKEND
    getExpenses({ commit, state }, payload) {
        let search = typeof payload != 'undefined' ? payload:''
        return new Promise((resolve, reject) => {
            //KIRIM PERMINTAAN KE BACKEND 
            $axios.get(`/expenses?page=${state.page}&q=${search}`)
            .then((response) => {
                //KETIKA RESPONSE NYA DIDAPATKAN, MAKA ASSIGN DATA TERSEBUT KE STATE
                commit('ASSIGN_DATA', response.data)
                resolve(response.data)
            })
        })
    },
    //FUNGSI INI UNTUK MENGIRIM DATA
    submitExpense({ dispatch, commit }, payload) {
        return new Promise((resolve, reject) => {
            //KIRIM PERMINTAAN UNTUK MENAMBAHKAN DATA DENGAN METHOD POST
            $axios.post(`/expenses`, payload)
            .then((response) => {
                //AMBIL DATA YANG BARU
                dispatch('getExpenses').then(() => {
                    resolve(response.data)
                })
            })
            .catch((error) => {
                //JIKA VALIDASI ERROR
                if (error.response.status == 422) {
                    //MAKA ERRORNYA DI ASSIGN KE STATE ERRORS
                    commit('SET_ERRORS', error.response.data.errors, { root: true })
                }
            })
        })
    },
    //FUNGSI INI UNTUK MENGAMBIL SINGLE DATA
    editExpenses({ commit }, payload) {
        return new Promise((resolve, reject) => {
            //MENGIRIMKAN PERMINTAAN KE BACKEND UNTUK MENGAMBIL DATA BERDASARKAN ID
            $axios.get(`/expenses/${payload}/edit`)
            .then((response) => {
                resolve(response.data)
            })
        })
    },
    //FUNGSI INI UNTUK MENGUPDATE DATA
    updateExpenses({ commit }, payload) {
        return new Promise((resolve, reject) => {
            //MENGIRIMKAN PERMINTAAN KE SERVER UNTUK MENGUBAH DATA BERDASARKAN ID
            $axios.put(`/expenses/${payload.id}`, payload)
            .then((response) => {
                resolve(response.data)
            })
        })
    },

    acceptExpenses({ commit }, payload) {
        return new Promise((resolve, reject) => {
            //KIRIM PERMINTAAN KE SERVER UNTUK MENGUBAH VALUE JADI ACCEPT
            $axios.post(`/expenses/accept`, { id: payload })
            .then((response) => {
                resolve(response.data)
            })
        })
    },
    cancelExpenses({ commit }, payload) {
        return new Promise((resolve, reject) => {
            //KIRIM PERMINTAAN KE SERVER UNTUK MENGUBAH VALUE JADI CANCEL
            $axios.post(`/expenses/cancel`, payload)
            .then((response) => {
                resolve(response.data)
            })
        })
    },
    
    removeExpenses({ dispatch }, payload) {
        return new Promise((resolve, reject) => {
            //KIRIM PERMINTAAN UNTUK MENGHAPUS BERDASARKAN ID
            $axios.delete(`/expenses/${payload}`)
            .then((response) => {
                //AMBIL DATA TERBARU
                dispatch('getExpenses').then(() => resolve())
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