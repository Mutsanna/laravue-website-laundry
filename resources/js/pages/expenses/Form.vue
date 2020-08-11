<template>
    <div>
        <div class="form-group" :class="{ 'has-error': errors.description }">
            <label for="">Permintaan</label>
            <input type="text" class="form-control" v-model="expenses.description">
            <p class="text-danger" v-if="errors.description">{{ errors.description[0] }}</p>
        </div>
        <div class="form-group" :class="{ 'has-error': errors.price }">
            <label for="">Biaya</label>
            <input type="number" class="form-control" v-model="expenses.price">
            <p class="text-danger" v-if="errors.price">{{ errors.price[0] }}</p>
        </div>
        <div class="form-group" :class="{ 'has-error': errors.note }">
            <label for="">Catatan</label>
            <textarea cols="5" rows="5" class="form-control" v-model="expenses.note"></textarea>
            <p class="text-danger" v-if="errors.note">{{ errors.note[0] }}</p>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
    name: 'FormExpenses',
    created() {
        //KARENA FILE INI KITA BUAT REUSABLE, BISA DIGUNAKAN UNTUK ADD DAN EDIT
        //MAKA KETIKA COMPONENT INI DI-LOAD DARI HALAMAN EDIT EXPANSES
        if (this.$route.name == 'expenses.edit') {
            //FUNGSI UNTUK MENGAMBIL SINGLE DATA YANG AKAN DIEDIT DIJALANKAN
            //ADAPUN FUNGSINYA AKAN KITA BUAT SAAT MEMBAHAS FITUR EDIT
            this.editExpenses(this.$route.params.id).then((res) => {
                //RESPONSENYA KITA MASUKKAN KE DALAM VARIABLE YANG TELAH DIDEFINISIKAN
                this.expenses = {
                    description: res.data.description,
                    price: res.data.price,
                    note: res.data.note
                }
            })
        }
    },
    data() {
        return {
            expenses: {
                description: '',
                price: '',
                note: ''
            }
        }
    },
    computed: {
        ...mapState(['errors']) //MENGAMBIL STATE ERROR
    },
    methods: {
        //MENDEFINISIKAN ACTION DARI MODULE EXPENSES VUEX
        ...mapActions('expenses', ['submitExpense', 'editExpenses', 'updateExpenses']),
        submit() {
            //KETIKA FUNGSI INI BERJALAN (NOTE: DI PICU DARI FILE ADD TADI)
            //DI CEK DARI HALAMAN MANA
            if (this.$route.name == 'expenses.edit') {
                //JIKA DARI EDIT, MAKA KITA ASSIGN ID YANG AKAN DI EDIT KE DALAM 
                //OBJECT VARIABLE EXPENSES
                let data = Object.assign({id: this.$route.params.id}, this.expenses)
                //KEMUDIAN KIRIM PERMINTAAN UPDATE DATA KE BACKEND
                this.updateExpenses(data).then(() => this.$router.push({name: 'expenses.data'}))
            } else {
                //JIKA DARI HALAMAN ADD NEW EXPENSES
                //MAKA LANGSUNG MENGIRIMKAN PERMINTAAN UNTUK MENAMBAHKAN DATA
                this.submitExpense(this.expenses).then(() => this.$router.push({ name: 'expenses.data' }))
            }
        }
    },
    destroyed() {
        //KETIKA COMPONENT DITINGGALKAN, MAKA VARIABLENYA DI KOSONGKAN
        this.expenses = {
            description: '',
            price: '',
            note: ''
        }
    }
}
</script>
