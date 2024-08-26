<script setup>
import {ref, onMounted} from 'vue'
import API from '@/api/API';

// import layout
import OrtuLayout from '@/Layouts/OrtuLayout.vue'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Message from 'primevue/message'
import router from '@/router'

onMounted(()=>
{
    isLoading.value = true
    setTimeout(()=>
    {
        absenAnak()
    },1000)
})

const isLoading = ref(false)
const dataJadwal = ref([])

const namaMapel = ref()
const namaGuru = ref()
const jumlahHadir = ref()

const absenAnak = async () =>
{
    isLoading.value = true

    try 
    {
        const response = await API.fecthAbsenAnak(
            localStorage.id_jadwal,
            localStorage.id_anak,
        )

        const data = response.data.data

        if(data.api_data)
        {
            dataJadwal.value = data.api_data[0]?.map((p,i) =>
            ({
                index : i+1,
                ...p
            }))

            jumlahHadir.value = data.api_data[2]
            namaMapel.value = data.api_data[1][0].nama_mapel
            namaGuru.value = data.api_data[1][0].nama_guru
        }
    }
    catch(err) { console.error(err)}
    finally
    {
        isLoading.value = false
    }

}

</script>

<template>
    <OrtuLayout :isLoading="isLoading">
        <template #pageContent>
            <section class="min-h-screen">
                <DataTable paginator :rows="10" :value="dataJadwal" removableSort scrollable rowGroupMode="subheader" groupRowsBy="dataJadwal.hari" 
                size="small" stripedRows tableStyle="min-width: 24rem" class="mt-4 text-sm">
                    <template #header>
                        <div class="flex flex-col gap-y-2">
                            <Button icon="pi pi-arrow-left" size="small" @click="router.back()" />
                            <span class="font-semibold">Mata Pelajaran : {{ namaMapel }}</span>
                            <span class="font-semibold">Guru : {{ namaGuru }}</span>
                            <div class="flex flex-col gap-y-2 font-semibold" v-for="statusAbsen in jumlahHadir" :key="statusAbsen.index">
                            <span>{{ statusAbsen.status+' : '+statusAbsen.jumlah }}</span>
                        </div>
                        </div>
                    </template>
                    <template #empty>
                        <Message severity="secondary">Tidak ada data absen</Message> 
                    </template>
                    <Column header="No" field="index" class="w-[20px]"/>
                    <Column header="Nama" field="nama_siswa" class="w-fit"/>
                    <Column header="Status" field="status" class="w-fit"/>
                    <Column header="Waktu Absen" field="waktu_absen"/>
                </DataTable>
            </section>   
        </template>
    </OrtuLayout>
</template>

<style scoped>
</style>