<script setup>
import {ref, onMounted} from 'vue'
import router from '@/router'

import SiswaLayout from '@/Layouts/SiswaLayout.vue'
import siswaAPI from '@/api/siswaAPI'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

onMounted(()=>
{
    fetchHistoryAbsen()
})

const toast = useToast()

const isLoading = ref(false)

const dataAbsensi = ref([])

const mapel = ref()
const guru = ref()

const fetchHistoryAbsen = async () =>
{
    isLoading.value = true 

    try
    {
        const email = localStorage.email
        const id_jadwal = localStorage.id_jadwal
        const response = await siswaAPI.fetchDataAbsen(email,id_jadwal)

        const data = response.data.data

        if(!data.api_data)
        {
            toast.add({ severity: 'error', summary: 'Info', detail: 'Tidak ada riwayat absen' , life: 2000, styleClass : 'max-w-[22rem]', group : 'tc'})
        }
        else 
        {
            dataAbsensi.value = data?.api_data?.map((p, i) => ({ 
                index : i+1, 
                tanggal_absen : `${formatDate(p.created_at)}`,
                ...p}))
            mapel.value = dataAbsensi?.value[0]?.nama_mapel
            guru.value = dataAbsensi?.value[0]?.nama_guru
        }
    }
    catch(err) { console.error(err) }
    finally
    {
        isLoading.value = false
    }
}

const formatDate = (date) =>
{
    const newDate = new Date(date)
    return `${newDate.getDate()}-${newDate.getMonth()}-${newDate.getFullYear()}`
}

</script>

<template>
    <SiswaLayout :isLoading="isLoading">
        <template #pageContent>
            <Toast class="w-[100%] ml-6 md:ml-0" position="top-center" group="tc" />
            <section class="min-h-[75vh] p-2 flex flex-col gap-y-2">
                <Button icon="pi pi-arrow-left" @click="router.back()" size="small"/>
                <h1>Riwayat Absen Anda</h1>
                <DataTable rowGroupMode="subheader" groupRowsBy="dataAbsensi.created_at" paginator :rows="10" :value="dataAbsensi" removableSort scrollable  size="small" stripedRows tableStyle="min-width: 100%" class="mt-4 text-sm">
                    <template #header>
                        <div class="flex flex-col gap-y-2">
                            <span>Mata Pelajaran : {{ mapel }}</span>
                            <span>Guru : {{ guru }}</span>
                        </div>
                    </template>
                    <template #empty>
                        <Message severity="secondary">Tidak ada data absensi</Message> 
                    </template>
                    <Column header="No" field="index" class="w-[40px]"/>
                    <Column header="Tanggal Absen" field="created_at" class="w-[120px]"/>
                    <Column header="Waktu Absen" field="waktu_absen" class="w-[120px]"/>
                    <Column header="Status" field="status"/>
                    <Column header="Deskripsi">
                        <template #body="{data}">
                        <span class="text-gray-400" v-if="data.deskripsi">{{ data.deskripsi }}</span>
                        <span class="text-gray-400" v-else>{{ data.status }}</span>
                        </template>
                    </Column>
                    <Column header="Lampiran">
                        <template #body="{data}">
                        <Button label="Lihat Lampiran" severity="help" size="small" icon="pi pi-eye" iconPos="right" target="_blank" v-if="data.lampiran_path" as="a" :href="data.lampiran_path"/>
                        <span class="text-gray-400" v-else>Tidak ada lampiran</span>
                        </template>
                    </Column>
                </DataTable>
            </section>
        </template>
    </SiswaLayout>
</template>

<style scoped>
</style>