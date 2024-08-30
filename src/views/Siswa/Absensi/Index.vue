<script setup>
import {ref, onMounted} from 'vue'
import siswaAPI from '@/api/siswaAPI';

// import layout
import SiswaLayout from '@/Layouts/SiswaLayout.vue'
import Message from 'primevue/message'
import Toast from 'primevue/toast'

import { useToast } from 'primevue/usetoast'

onMounted(()=>
{
    fetchDataAbsen()
})

const toast = useToast()

const isFetching = ref(false)

const dataAbsen = ref([])

const notif = (severity,message) =>
{
    toast.add({ severity: severity, summary: 'Info', detail: message, life: 2000, group : 'tc' });
}

const fetchDataAbsen = async () =>
{
    isFetching.value = true

    try
    {
        const response = await siswaAPI.fetchDataAbsen(localStorage.email)

        const data = response.data.data

        if(data.api_data !== null)
        {
            dataAbsen.value = data.api_data.map((p, i) => ({ 
            waktuAbsenFix : formatTime(p.created_at),
            ...p}))

            notif('success','Menampilkan Data')
        }
        
    }
    catch(err) {
        notif('error','Terjadi Kesalahan')
    }
    finally
    {
        isFetching.value = false
    }
}

const formatTime = (timestamp) =>
{
      const now = new Date();
      const then = new Date(timestamp);
      const diff = now - then;

    // Konversi ke satuan yang lebih besar
    const minutes = Math.abs(diff).toFixed(0) / 60;
    const hours = minutes / 60;
    const days = hours / 24;

    // Format output
    if (diff < 60) {
        return `${Math.abs(diff).toFixed(0)} detik yang lalu`;
    } else if (minutes < 60) {
        return `${Math.round(minutes).toFixed(0)} menit yang lalu`;
    } else if (hours < 24) {
        return `${Math.round(hours).toFixed(0)} jam yang lalu`;
    } else {
        return `${Math.round(days).toFixed(0)} hari yang lalu`;
    }
}
</script>

<template>
    <SiswaLayout :isRefresh="isFetching">
        <template #pageContent>
            <Toast class="w-[100%]" position="top-center" group="tc"/>
            <section class="min-h-screen p-2">
                <div v-for="absen in dataAbsen" :key="absen.index">
                    <Message class="mt-4">
                        <span>{{ `${absen.waktuAbsenFix} | ${absen.mapel} | ${absen.status}` }}</span>
                    </Message>
                </div>

            </section>   
        </template>
    </SiswaLayout>
</template>

<style scoped>
</style>