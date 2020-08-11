<template>
    <div class="col-md-12">
        <div class="panel">
            <div class="panel-heading">
                <h3 class="panel-title">Add New Outlet</h3>
            </div>
            <div class="panel-body">
                <outlet-form></outlet-form>
                <div class="form-group">
                    <button class="btn btn-primary btn-sm btn-flat" @click.prevent="submit">
                        <i class="fa fa-save"></i> Add New
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapActions, mapState } from 'vuex'
    import FormOutlets from './Form.vue'
    export default {
        name: 'AddOutlet',
        data() {
            return {
                
            }
        },
        methods: {
            ...mapActions('outlet', ['submitOutlet']), //PANGGIL ACTIONS submitOutlet
            submit() {
                //KETIKA TOMBOL DITEKAN MAKA FUNGSI INI AKAN DIJALANKAN
                //DIMANA FUNGSI INI TELAH DIBUAT PADA SESI SEBELUMNYA
                this.submitOutlet().then(() => {
                    //APABILA BERHASIL MAKA AKAN DI-DIRECT KE HALAMAN /outlets
                    this.$router.push({ name: 'outlets.data' })
                })
            }
        },
        components: {
            'outlet-form': FormOutlets
        }
    }
</script>