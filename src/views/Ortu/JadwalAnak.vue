<script setup>
import {ref, onMounted} from 'vue'
import API from '@/api/API';

// import layout
import OrtuLayout from '@/Layouts/OrtuLayout.vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Message from 'primevue/message'
import router from '@/router';

onMounted(()=>
{
    isLoading.value = true
    setTimeout(()=>
    {
        fetchAnak()
    },1000)
})

const isLoading = ref(false)
const dataJadwal = ref([])

const fetchAnak = async () =>
{
    isLoading.value = true

    try 
    {
        const response = await API.fecthJadwalAnak(localStorage.id_kelas,localStorage.id_anak)

        const data = response.data.data

        if(data.api_data)
        {
            dataJadwal.value = data.api_data.map((p,i) =>
            ({
                index : i+1,
                ...p
            }))

            // console.log(dataJadwal.value)
        }
    }
    catch(err) { console.error(err)}
    finally
    {
        isLoading.value = false
        console.log(localStorage.id_anak)
    }
}

const getAbsen = (id_jadwal) =>
{
    localStorage.id_jadwal = id_jadwal

    setTimeout(()=>
    {
        router.push({name : 'ortuAbsenAnak'})
    }, 1000)

    console.log(localStorage.id_jadwal)
}

</script>

<template>
    <OrtuLayout :isLoading="isLoading">
        <template #pageContent>
            <section class="min-h-screen">
                <DataTable paginator :rows="10" :value="dataJadwal" removableSort scrollable rowGroupMode="subheader" groupRowsBy="dataJadwal.hari" 
                size="small" stripedRows tableStyle="min-width: 50rem" class="mt-4 text-sm">
                    <template #header>
                        <Button icon="pi pi-arrow-left" size="small" @click="router.push({name : 'ortuDashboard'})" />
                    </template>
                    <template #groupheader="{data}">
                        <span class="font-semibold">Hari : {{ data.hari }}</span>
                    </template>
                    <template #empty>
                        <Message severity="secondary">Tidak ada data jadwal</Message> 
                    </template>
                    <Column header="No" field="index"/>
                    <Column header="Hari" field="hari" frozen/>
                    <Column header="Waktu Mulai" field="waktu_mulai"/>
                    <Column header="Waktu Selesai" field="waktu_selesai"/>
                    <Column header="Mapel" field="nama_mapel"/>
                    <Column header="Guru" field="nama_guru"/>
                    <Column header="Action" frozen align-frozen="right">
                        <template #body="{data}">
                            <Button size="small" label="Absensi" severity="info" @click="getAbsen(data.id_jadwal)"/>
                        </template>
                    </Column>
                </DataTable>
            </section>   
        </template>
    </OrtuLayout>
</template>

<style scoped>
</style>