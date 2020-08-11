import $axios from '../api.js'

const state = () => ({
    outlets: [], //UNTUK MENAMPUNG DATA OUTLETS YANG DIDAPATKAN DARI DATABASE
    
    //UNTUK MENAMPUNG VALUE DARI FORM INPUTAN NANTINYA
    //STATE INI AKAN DIGUNAKAN PADA FORM ADD OUTLET YANG AKAN DIBAHAS KEMUDIAN
    outlet: {
        code: '',
        name: '',
        status: false,
        address: '',
        phone: ''
    },
    page: 1 //UNTUK MENCATAT PAGE PAGINATE YANG SEDANG DIAKSES
})

const mutations = {
    //MEMASUKKAN DATA KE STATE OUTLETS
    ASSIGN_DATA(state, payload) {
        state.outlets = payload
    },
    //MENGUBAH DATA STATE PAGE
    SET_PAGE(state, payload) {
        state.page = payload
    },
    //MENGUBAH DATA STATE OUTLET
    ASSIGN_FORM(state, payload) {
        state.outlet = {
            code: payload.code,
            name: payload.name,
            status: payload.status,
            address: payload.address,
            phone: payload.phone
        }
    },
    //ME-RESET STATE OUTLET MENJADI KOSONG
    CLEAR_FORM(state) {
        state.outlet = {
            code: '',
            name: '',
            status: false,
            address: '',
            phone: ''
        }
    }
}

const actions = {
    //FUNGSI INI UNTUK MELAKUKAN REQUEST DATA OUTLET DARI SERVER
    getOutlets({ commit, state }, payload) {
        //MENGECEK PAYLOAD ADA ATAU TIDAK
        let search = typeof payload != 'undefined' ? payload:''
        return new Promise((resolve, reject) => {
            //REQUEST DATA DENGAN ENDPOINT /OUTLETS
            $axios.get(`/outlets?page=${state.page}&q=${search}`)
            .then((response) => {
                //SIMPAN DATA KE STATE MELALUI MUTATIONS
                commit('ASSIGN_DATA', response.data)
                resolve(response.data)
            })
        })
    },
    //FUNGSI UNTUK MENAMBAHKAN DATA BARU
    submitOutlet({ dispatch, commit, state }) {
        return new Promise((resolve, reject) => {
            //MENGIRIMKAN PERMINTAAN KE SERVER DAN MELAMPIRKAN DATA YANG AKAN DISIMPAN
            //DARI STATE OUTLET
            $axios.post(`/outlets`, state.outlet)
            .then((response) => {
                //APABILA BERHASIL KITA MELAKUKAN REQUEST LAGI
                //UNTUK MENGAMBIL DATA TERBARU
                dispatch('getOutlets').then(() => {
                    resolve(response.data)
                })
            })
            .catch((error) => {
                //APABILA TERJADI ERROR VALIDASI
                //DIMANA LARAVEL MENGGUNAKAN CODE 422
                if (error.response.status == 422) {
                    //MAKA LIST ERROR AKAN DIASSIGN KE STATE ERRORS
                    commit('SET_ERRORS', error.response.data.errors, { root: true })
                }
            })
        })
    },
    //UNTUK MENGAMBIL SINGLE DATA DARI SERVER BERDASARKAN CODE OUTLET
    editOutlet({ commit }, payload) {
        return new Promise((resolve, reject) => {
            //MELAKUKAN REQUEST DENGAN MENGIRIMKAN CODE OUTLET DI URL
            $axios.get(`/outlets/${payload}/edit`)
            .then((response) => {
                //APABIL BERHASIL, DI ASSIGN KE FORM
                commit('ASSIGN_FORM', response.data.data)
                resolve(response.data)
            })
        })
    },
    //UNTUK MENGUPDATE DATA BERDASARKAN CODE YANG SEDANG DIEDIT
    updateOutlet({ state, commit }, payload) {
        return new Promise((resolve, reject) => {
            //MELAKUKAN REQUEST DENGAN MENGIRIMKAN CODE DIURL
            //DAN MENGIRIMKAN DATA TERBARU YANG TELAH DIEDIT
            //MELALUI STATE OUTLET
            $axios.put(`/outlets/${payload}`, state.outlet)
            .then((response) => {
                //FORM DIBERSIHKAN
                commit('CLEAR_FORM')
                resolve(response.data)
            })
        })
    } ,
    //MENGHAPUS DATA 
    removeOutlet({ dispatch }, payload) {
        return new Promise((resolve, reject) => {
            //MENGIRIM PERMINTAAN KE SERVER UNTUK MENGHAPUS DATA
            //DENGAN METHOD DELETE DAN ID OUTLET DI URL
            $axios.delete(`/outlets/${payload}`)
            .then((response) => {
                //APABILA BERHASIL, FETCH DATA TERBARU DARI SERVER
                dispatch('getOutlets').then(() => resolve())
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