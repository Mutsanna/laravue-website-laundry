import $axios from '../api.js'

const state = () => ({
    users: [], //MENAMPUNG LIST USER
    roles: [], //MENAMPUNG LIST ROLES
    permissions: [], //MENAMPUNG LIST PERMISSION
    role_permission: [], //MENAMPUNG PERMISSION YANG DIMILIKI OLEH ROLE
    authenticated: [] //MENAMPUNG USER YANG SEDANG LOGIN
})

const mutations = {
    ASSIGN_USER(state, payload) {
        state.users = payload
    },
    ASSIGN_ROLES(state, payload) {
        state.roles = payload
    },
    ASSIGN_PERMISSION(state, payload) {
        state.permissions = payload
    },
    ASSIGN_ROLE_PERMISSION(state, payload) {
        state.role_permission = payload
    },
    CLEAR_ROLE_PERMISSION(state, payload) {
        state.role_permission = []
    },
    ASSIGN_USER_AUTH(state, payload) {
        state.authenticated = payload
    }
}

const actions = {
    //FUNGSI INI UNTUK MENGAMBIL DATA USER
    getUserLists({ commit }) {
        return new Promise((resolve, reject) => {
            //KIRIM PERMINTAAN KE BACKEND
            $axios.get(`/user-lists`)
            .then((response) => {
                //SIMPAN DATANYA KE STATE USERS MENGGUNAKAN MUTATIONS
                commit('ASSIGN_USER', response.data.data)
                resolve(response.data)
            })
        })
    },
    //FUNGSI INI UNTUK MENGATUR ROLE TIAP USER
    setRoleUser({commit}, payload) {
        return new Promise((resolve, reject) => {
            commit('CLEAR_ERRORS', '', {root: true}) //STATE ERROR DIBERSIHKAN
            //KIRIM PERMINTAAN KE BACKEND
            $axios.post(`/set-role-user`, payload)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                //APABILA TERJADI ERROR VALIDASI, SET ERRONYA AGAR DAPAT DITAMPILKAN
                if (error.response.status == 422) {
                    commit('SET_ERRORS', error.response.data.errors, { root: true })
                }
            })
        })
    },
    //UNTUK MENGAMBIL LIST ROLES
    getRoles({ commit }) {
        return new Promise((resolve, reject) => {
            //KIRIM PERMINTAAN KE BACKEND
            $axios.get(`/roles`)
            .then((response) => {
                //SIMPAN DATANYA KE DALAM STATE ROLES
                commit('ASSIGN_ROLES', response.data.data)
                resolve(response.data)
            })
        })
    },
    //MENGAMBIL LIST PERMISSIONS
    getAllPermission({ commit }) {
        return new Promise((resolve, reject) => {
            //KIRIM PERMINTAAN KE BACKEND
            $axios.get(`/permissions`)
            .then((response) => {
                //SIMPAN DATA YANG DITERIMA KE DALAM STATE PERMISSIONS
                commit('ASSIGN_PERMISSION', response.data.data)
                resolve(response.data)
            })
        })
    },
    //MENGAMBIL PERMISSION YANG TELAH DIMILIKI OLEH ROLE TERTENTU
    getRolePermission({ commit }, payload) {
        return new Promise((resolve, reject) => {
            commit('CLEAR_ERRORS', '', {root: true}) //BERSIHKAN STATE ERRORS
            //KIRIM PERMINTAAN KE BACKEND BERDASARKAN ROLE_ID
            $axios.post(`/role-permission`, {role_id: payload})
            .then((response) => {
                //SIMPAN DATANYA DENGAN MUTATIONS
                commit('ASSIGN_ROLE_PERMISSION', response.data.data)
                resolve(response.data)
            })
        })
    },
    //BERFUNGSI UNTUK MENGATUR PERMISSION SETIAP ROLEH YANG DIPILIH
    setRolePermission({ commit }, payload) {
        return new Promise((resolve, reject) => {
            commit('CLEAR_ERRORS', '', {root: true})
            //KIRIM PERMINTAAN KE BACKEND
            $axios.post(`/set-role-permission`, payload)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                //APABILA TERJADI ERROR VALIDASI
                if (error.response.status == 422) {
                    //SET ERRORNYA AGAR DAPAT DITAMPILKAN
                    commit('SET_ERRORS', error.response.data.errors, { root: true })
                }
            })
        })
    },
    //MENGAMBIL DATA USER YANG SEDANG LOGIN
    getUserLogin({ commit }) {
        return new Promise((resolve, reject) => {
            $axios.get(`user-authenticated`)
            .then((response) => {
                //SIMPAN DATA USER TERSEBUT
                commit('ASSIGN_USER_AUTH', response.data.data)
                resolve(response.data)
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