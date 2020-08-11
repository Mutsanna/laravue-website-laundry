<template>
    <div>
        <div class="form-group" :class="{ 'has-error': errors.name }">
            <label for="">Nama Lengkap</label>
            <input type="text" class="form-control" v-model="courier.name" 
            :readonly="$route.name == 'outlets.edit'">
            <p class="text-danger" v-if="errors.name">{{ errors.name[0] }}</p>
        </div>
        <div class="form-group" :class="{ 'has-error': errors.email }">
            <label for="">Email</label>
            <input type="text" class="form-control" v-model="courier.email">
            <p class="text-danger" v-if="errors.email">{{ errors.email[0] }}</p>
        </div>
        <div class="form-group" :class="{ 'has-error': errors.password }">
            <label for="">Password</label>
            <input type="password" class="form-control" v-model="courier.password">
            <p class="text-warning">Leave blank if you don't want to change password</p>
            <p class="text-danger" v-if="errors.password">{{ errors.password[0] }}</p>
        </div>
        <div class="form-group" :class="{ 'has-error': errors.outlet_id }">
            <label for="">Outlet</label>
            <select name="outlet_id" class="form-control" v-model="courier.outlet_id">
                <option value="">Pilih</option>
                <option v-for="(row, index) in outlets.data" :value="row.id" 
                :key="index">{{ row.name }}</option>
            </select>
            <p class="text-danger" v-if="errors.outlet_id">{{ errors.outlet_id[0] }}</p>
        </div>
        <div class="form-group" :class="{ 'has-error': errors.photo }">
            <label for="">Foto</label>
            <input type="file" class="form-control" accept="image/*" @change="uploadImage($event)" id="file-input">
            <p class="text-warning">Leave blank if you don't want to change photo</p>
            <p class="text-danger" v-if="errors.photo">{{ errors.photo[0] }}</p>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
    name: 'FormCourier',
    created() {
        this.getOutlets() //KETIKA HALAMAN DI-LOAD, FUNGSI UNTUK MENGAMBIL DATA OUTLETS DIJALANKAN
      
        //KETIKA PAGE YANG SEDANG BERJALAN ADALAH PAGE EDIT
        if (this.$route.name == 'couriers.edit') {
            //MAKA FUNGSI UNTUK MENGAMBIL DATA YANG AKAN DIEDIT DIJALANKAN BERDASARKAN PARAMETER ID YANG ADA DI URL
            this.editCourier(this.$route.params.id).then((res) => {
                //RESPON YANG DITERIMA AKAN DIMASUKKAN KEDALAM ATTRIBTUE KURIR 
                this.courier = {
                    name: res.data.name,
                    email: res.data.email,
                    password: '',
                    photo: '',
                    outlet_id: res.data.outlet_id
                }
            })
        }
    },
    data() {
        return {
            courier: {
                name: '',
                email: '',
                password: '',
                photo: '',
                outlet_id: ''
            }
        }
    },
    computed: {
        ...mapState(['errors']),
        ...mapState('outlet', {
            outlets: state => state.outlets //MENGAMBIL DATA OUTLETS
        })
    },
    methods: {
        ...mapActions('outlet', ['getOutlets']), //MENDEFINISIKAN FUNGSI getOutlets
        ...mapActions('courier', ['submitCourier', 'editCourier', 'updateCourier']), //MENDEFINISIKAN FUNGSI submitCourier, editCourier, dan updateCourier
        ...mapMutations('courier', ['SET_ID_UPDATE']), //MEMANGGIL MUTATIONS
        //KETIKA TERJADI PENGINPUTAN GAMBAR, MAKA FILE TERSEBUT AKAN DI ASSIGN KE DALAM courier.photo
        uploadImage(event) {
            this.courier.photo = event.target.files[0]
        },
        //KETIKA TOMBOL ADD NEW DITEKAN MAKA AKAN MENJALAN FUNGSI DIBAWAH
        submit() {
            //DIMANA UNTUK MENGUPLOAD GAMBAR HARUS MENGGUNAKAN FORMDATA
            let form = new FormData()
            form.append('name', this.courier.name)
            form.append('email', this.courier.email)
            form.append('password', this.courier.password)
            form.append('outlet_id', this.courier.outlet_id)
            form.append('photo', this.courier.photo)

            //KETIKA HALAMAN ADD KURIR YANG DI AKSES
            if (this.$route.name == 'couriers.add') {
                //MAKA AKAN MENJALANKAN FUNGSI submitCourier
                this.submitCourier(form).then(() => {
                    //KEMUDIAN FORM DI KOSONGKAN
                    this.courier = {
                        name: '',
                        email: '',
                        password: '',
                        photo: '',
                        outlet_id: ''
                    }
                    //DI DIRECT KE HALAMAN LIST DATA KURIR
                    this.$router.push({ name: 'couriers.data' })
                })
            //JIKA YANG DIAKSES HALAMAN EDIT KURIR
            } else if (this.$route.name == 'couriers.edit') {
                //MAKA ID NYA DI ASSING KE STATE ID
                this.SET_ID_UPDATE(this.$route.params.id)
                //DAN FUNGSI updateCourier DIJALANKAN
                this.updateCourier(form).then(() => {
                    //KEMUDIAN FORM DI KOSONGKAN
                    this.courier = {
                        name: '',
                        email: '',
                        password: '',
                        photo: '',
                        outlet_id: ''
                    }
                    //DI DIRECT KE HALAMAN LIST DATA KURIR
                    this.$router.push({ name: 'couriers.data' })
                })
            }
        }
    }
}
</script>
