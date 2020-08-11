import $axios from '../api.js'

const state = () => ({
    products: [], //STATE YANG AKAN MENYIMPAN DATA PRODUCT
    page: 1,
    laundry_types: []

})

const mutations = {
    //MUTATION UNTUK MEMASUKKAN DATA KE DALAM STATE PRODUCTS
    ASSIGN_DATA(state, payload) {
        state.products = payload
    },
    //MUTATION UNTUK MENGUBAH VALUE DARI STATE PAGE
    SET_PAGE(state, payload) {
        state.page = payload
    },
    
    ASSIGN_LAUNDRY_TYPE(state, payload) {
        state.laundry_types = payload
    }
}

const actions = {
    //FUNGSI UNTUK MENGAMBIL DATA KE SERVER
    getProducts({ commit, state }, payload) {
        let search = typeof payload != 'undefined' ? payload:''
        return new Promise((resolve, reject) => {
            //MENGGUNAKAN AXIOS PADA URL /PRODUCT
            $axios.get(`/product?page=${state.page}&q=${search}`)
            .then((response) => {
                //APABILA MENDAPATKAN RESPONSE, DATA AKAN DICOMMIT KE MUTATION ASSIGN_DATA
                commit('ASSIGN_DATA', response.data)
                resolve(response.data)
            })
        })
    },
    getLaundryType({ commit }) {
        return new Promise((resolve, reject) => {
            //MENGIRIM REQUEST UNTUK MENGAMBIL DATA LAUNDRY TYPE
            $axios.get(`/product/laundry-type`)
            .then((response) => {
                commit('ASSIGN_LAUNDRY_TYPE', response.data.data) 
                //COMMIT DATA KE MUTATIONS ASSIGN_LAUNDRY_TYPE
                resolve(response.data)
            })
        })
    },
    addLaundryType({ commit }, payload) {
        return new Promise((resolve, reject) => {
            //MENGIRIM REQUEST UNTUK MENYIMPAN LAUNDRY_TYPE YANG BARU
            $axios.post(`/product/laundry-type`, payload)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                //JIKA TERJADI ERROR VALIDASI, MAKA ERRORNYA DISIMPAN KE DALAM VARIABLE ERRORS
                if (error.response.status == 422) {
                    commit('SET_ERRORS', error.response.data.errors, { root: true })
                }
            })
        })
    },
    addProductLaundry({ commit }, payload) {
        return new Promise((resolve, reject) => {
            //MENGIRIM REQUEST UNTUK MENAMBAHKAN DATA PRODUCT BARU
            $axios.post(`/product`, payload)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                //SET ERROR VALIDASI
                if (error.response.status == 422) {
                    commit('SET_ERRORS', error.response.data.errors, { root: true })
                }
            })
        })
    },
    editProduct({ commit }, payload) {
        return new Promise((resolve, reject) => {
            //MENGIRIM REQUEST UNTUK MENGAMBIL DATA PRODUCT BERDASARKAN ID
            $axios.get(`/product/${payload}/edit`)
            .then((response) => {
                resolve(response.data)
            })
        })
    },
    updateCourier({ commit }, payload) {
        return new Promise((resolve, reject) => {
            //MENGIRIM REQUEST UNTUK MENGUBAH DATA PRODUCT BERDASARKAN ID
            $axios.put(`/product/${payload.id}`, payload)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                //SET ERROR VALIDASI
                if (error.response.status == 422) {
                    commit('SET_ERRORS', error.response.data.errors, { root: true })
                }
            })
        })
    },
    removeProduct({ dispatch }, payload) {
        return new Promise((resolve, reject) => {
            //MENGIRIM PERMINTAAN UNTUK MENGHAPUS DATA PRODUCT BERDASARKAN ID
            $axios.delete(`/product/${payload}`)
            .then((response) => {
                dispatch('getProducts').then(() => resolve(response.data))
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