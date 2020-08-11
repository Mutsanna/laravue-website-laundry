<template>
    <div class="col-md-12">
        <div class="panel">
            <div class="panel-heading">
                <router-link :to="{ name: 'expenses.create' }" class="btn btn-primary btn-sm btn-flat">Tambah</router-link>
                <div class="pull-right">
                    <input type="text" class="form-control" placeholder="Cari..." v-model="search">
                </div>
            </div>
            <div class="panel-body">
              
              	<!-- TABLE INI AKAN MENAMPILKAN DATA EXPENSES -->
                <b-table striped hover bordered :items="expenses.data" :fields="fields" show-empty>
                    <template v-slot:cell(status)="row">
                        <span class="label label-success" v-if="row.item.status == 1">Diterima</span>
                        <span class="label label-warning" v-else-if="row.item.status == 0">Diproses</span>
                        <span class="label label-default" v-else>Ditolak</span>
                    </template>
                    <template v-slot:cell(user)="row">
                        {{ row.item.user.name }}
                    </template>
                    <template v-slot:cell(reason)="row">
                        {{ row.item.reason == '' ? '-':row.item.reason }}
                    </template>
                    <template v-slot:cell(actions)="row">
                        <router-link :to="{ name: 'expenses.edit', params: {id: row.item.id} }" class="btn btn-warning btn-sm" v-if="row.item.status == 0"><i class="fa fa-pencil"></i></router-link>
                        <router-link :to="{ name: 'expenses.view', params: {id: row.item.id} }" class="btn btn-info btn-sm"><i class="fa fa-eye"></i></router-link>
                        <button class="btn btn-danger btn-sm" @click="deleteExpenses(row.item.id)" v-if="row.item.status == 0"><i class="fa fa-trash"></i></button>
                    </template>
                </b-table>
                <!-- TABLE INI AKAN MENAMPILKAN DATA EXPENSES -->

                <div class="row">
                  	<!-- BAGIAN INI AKAN MENAMPILKAN INFORMASI DATA DAN PAGINATION -->
                    <div class="col-md-6">
                        <p v-if="expenses.data"><i class="fa fa-bars"></i> {{ expenses.data.length }} item dari {{ expenses.meta.total }} total data</p>
                    </div>
                    <div class="col-md-6">
                        <div class="pull-right">
                            <b-pagination
                                v-model="page"
                                :total-rows="expenses.meta.total"
                                :per-page="expenses.meta.per_page"
                                aria-controls="expenses"
                                v-if="expenses.data && expenses.data.length > 0"
                                ></b-pagination>
                        </div>
                    </div>
                    <!-- BAGIAN INI AKAN MENAMPILKAN INFORMASI DATA DAN PAGINATION -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
    name: 'DataExpenses',
    created() {
        this.getExpenses() //KETIKA HALAMAN DI-LOAD MAKA FUNGSI INI AKAN DIJALANKAN
    },
    data() {
        return {
            //UNTUK FIELD TABLE DIATAS YANG AKAN DITAMPILKAN
            fields: [
                { key: 'description', label: 'Permintaan' },
                { key: 'price', label: 'Biaya' },
                { key: 'note', label: 'Catatan' },
                { key: 'user', label: 'Kurir/Admin' },
                { key: 'status', label: 'Status' },
                { key: 'reason', label: 'Alasan' },
                { key: 'actions', label: 'Aksi' }
            ],
            search: '' //VARIABLE UNTUK SEARCH
        }
    },
    computed: {
        ...mapState('expenses', {
            expenses: state => state.expenses //AMBIL STATE DARI MODULE EXPENSES YANG AKAN DIBUAT KEMUDIAN
        }),
        //AMBIL DAN MODIFIKASI STATE PAGE JIKA TERJADI PERUBAHAN
        page: {
            get() {
                return this.$store.state.expenses.page
            },
            set(val) {
                this.$store.commit('expenses/SET_PAGE', val)
            }
        }
    },
    watch: {
        //KETIKA TERJADI PERUBAHAN VALUE STATE PAGE 
        page() {
            this.getExpenses() //MAKA JALANKAN FUNGSI INI
        },
        //KETIKA TERJADI PERUBAHAN VALUE VARIABLE SEARCH 
        search() {
            this.getExpenses(this.search) //MAKA JALANKAN FUNGSI INI DGN MENGIRIMKAN VALUE DARI SEARCH
        }
    },
    methods: {
        ...mapActions('expenses', ['getExpenses', 'removeExpenses']), //DEFINISIKAN ACTIONS DARI MODULE EXPENSES
        //FUNGSI INI SAMA DENGAN MODULE SEBELUMNYA UNTUK MENAMPILKAN ALERT KETIKA MENGHAPUS DATA
        deleteExpenses(id) {
            this.$swal({
                title: 'Kamu Yakin?',
                text: "Tindakan ini akan menghapus secara permanent!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Iya, Lanjutkan!'
            }).then((result) => {
                if (result.value) {
                    //JIKA DISETUJUI MAKA FUNGSI INI DIJALANKAN
                    this.removeExpenses(id)
                }
            })
        }
    }
}
</script>