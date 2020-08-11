<template>
    <div class="col-md-12">
        <div class="panel">
            <div class="panel-heading">
                <h3 class="panel-title">Detail Expenses</h3>
            </div>
            <div class="panel-body">
                <template>
                  	<!-- INFORMASI DETAIL EXPENSES -->
                    <dt>Permintaan Karyawan</dt>
                    <dd>- {{ description }}</dd>

                    <hr>
                    <dt>Biaya Yang Diperlukan</dt>
                    <dd>- Rp {{ price }}</dd>
                    <hr>

                    <dt>Catatan</dt>
                    <dd>- {{ note }}</dd>
                    <hr>

                    <dt>User/Kurir</dt>
                    <dd>- {{ user.name }}</dd>
                    <hr>

                    <dt>Status</dt>
                    <dd>
                        <span class="label label-success" v-if="status == 1">Diterima</span>
                        <span class="label label-warning" v-else-if="status == 0">Diproses</span>
                        <span class="label label-default" v-else>Ditolak</span>
                    </dd>
                    <hr>
                    <!-- INFORMASI DETAIL EXPENSES -->

                    <!-- JIKA STATUSNYA 2 = CANCEL, MAKA ALASANNYA DITAMPILKAN -->
                    <div v-if="status == 2">
                        <dt>Alasan Penolakan</dt>
                        <dd>- {{ reason }}</dd>
                        <hr>
                    </div>
                  
                    <!-- JIKA STATUS 0 = BARU ATAU BARU DAN formReason = false MAKA TOMBOL TOLAK DAN TERIMA DITAMPILKAN -->
                    <div class="pull-right" v-if="status == 0 || (status == 0 && !formReason)">
                        <!-- KETIKA TOMBOL INI DITEKAN MAKA AKAN MENGUBAH VALUE formReason JADI TRUE -->
                        <button class="btn btn-danger btn-sm" @click="formReason = true">Tolak</button>
                        <button class="btn btn-primary btn-sm" @click="accept">Terima</button>
                    </div>
                </template>

                <!-- JIKA formReason NILAINYA TRUE, MAKA FORM INI DITAMPILAKN UNTUK MENGISI ALASAN PENOLAKAN -->
                <div v-if="formReason">
                    <div class="form-group">
                        <label for="">Alasan Penolakan</label>
                        <input type="text" v-model="inputReason" class="form-control">
                    </div>
                    <div class="form-group">
                        <button class="btn btn-primary btn-sm pull-right" @click="cancelRequest">Respon Penolakan</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex';
    export default {
        name: 'ViewEpenses',
        created() {
            //KETIKA COMPONENT INI DI-LOAD MAKA KITA MENGAMBIL SINGLE DATA YANG AKAN DI TAMPILKAN BERDASARKAN ID PADA URL
            this.editExpenses(this.$route.params.id).then((res) => {
                let row = res.data
                //ASSIGN SEMUA DATANYA KE DALAM VARIABLE YANG TELAH DIDEFINISIKAN
                this.description =  row.description
                this.price =  row.price
                this.note =  row.note
                this.status =  row.status
                this.reason =  row.reason
                this.user = row.user
            })
        },
        data() {
            return {
                description: '',
                price: '',
                note: '',
                status: '',
                reason: '',
                user: '',
                formReason: false,
                inputReason: ''
            }
        },
        methods: {
            ...mapActions('expenses', ['editExpenses', 'acceptExpenses', 'cancelExpenses']),
            //KETIKA TOMBOL TERIMA DITEKAN, MAKA AKAN MENJALANKAN FUNGSI accpet
            accept() {
                this.$swal({
                    title: 'Kamu Yakin?',
                    text: "Permintaan yang disetujui tidak dapat dikembalikan!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Iya, Lanjutkan!'
                }).then((result) => {
                    if (result.value) {
                        //JIKA YES, MAKA KITA AKAN MENGIRIMKAN PERMINTAAN KE SERVER UNTUK MENYETUJUI PERMINTAAN TERSEBUT DAN REDIRECT KE HALAMAN LIST EXPENSES
                        this.acceptExpenses(this.$route.params.id).then(() => this.$router.push({ name: 'expenses.data' }))
                    }
                })
            },
          
            //KETIKA TOMBOL RESPON PENOLAK DITEKAN, MAKA FUNGSI INI AKAN DIJALANKAN
            cancelRequest() {
                this.$swal({
                    title: 'Kamu Yakin?',
                    text: "Permintaan yang ditolak tidak dapat dikembalikan!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Iya, Lanjutkan!'
                }).then((result) => {
                    if (result.value) {
                        //JIKA IYA, MAKA KITA AKAN MENGIRIMKAN PERMINTAAN KE BACKEND UNTUK MENGUBAH STATUS EXPENSES MENJADI DITOLAK
                        this.cancelExpenses({id: this.$route.params.id, reason: this.inputReason}).then(() => {
                            this.formReason = false //FORMREASON DI SET KEMBALI JADI FALSE
                            this.$router.push({ name: 'expenses.data' }) //DAN REDIRECT KEMBALI KE HALAMAN LIST EXPENSES
                        })
                    }
                })
            }
        }
    }
</script>
