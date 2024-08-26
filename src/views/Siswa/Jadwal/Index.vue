<script setup>
import {ref, onMounted, watch} from 'vue'
import router from '@/router'



import siswaAPI from '@/api/siswaAPI'

// import layout
import SiswaLayout from '@/Layouts/SiswaLayout.vue'

import Button from 'primevue/button'


import Select from 'primevue/select'

import Message from 'primevue/message'
import Card from 'primevue/card'

onMounted(()=>
{
    isFetching.value = true
    getDayName(newDate)
    // setWaktu(newDate)

    setTimeout(()=>
    {
        fetchJadwal()
    }, 2000)
})


const isFetching = ref(false)

const newDate = new Date()

// let hariIni = ''
const hariIni = ref('Senin')
// const waktu = ref(null)
// let waktu = null
const waktu = '08:30:00'

const waktuAbsenSelesai = ref(false)


const dataJadwalFix = ref([])

const dataHari = ref([
    { hari : 'Senin'},
    { hari : 'Selasa'},
    { hari : 'Rabu'},
    { hari : 'Kamis'},
    { hari : 'Jumat'},
]);

const selectedHari = ref()

const getDayName = (newDate) =>
{
    // let date = hariIni
    hariIni.value = newDate.toLocaleDateString("id-ID", { weekday: 'long' })

    console.log(hariIni.value.toUpperCase())
}

const setWaktu = (newDate) =>
{
    waktu = newDate.getHours()+':'+newDate.getMinutes()+':'+newDate.getSeconds()

    console.log(waktu)
}

const request = {
    nama_kelas : localStorage.kelas
}

const filterJadwal = async () =>
{
    isFetching.value = true
    localStorage.removeItem('id_jadwal')

    try
    {
        const response = await siswaAPI.fetchJadwalByHari(selectedHari.value,request)

        const data = response.data.data

        const absenValid = ref(false)
        
        if(data.api_data.some(jadwal => waktu >= jadwal.waktu_mulai && waktu <= jadwal.waktu_selesai))
        {
            absenValid.value = true
        }
        else
        {
            absenValid.value = false
            waktuAbsenSelesai.value = true
        }
        dataJadwalFix.value = data.api_data.map((p, i) => ({ 
            index : i+1,
            valid : absenValid.value, ...p}))

    }
    catch(err) {
      console.error(err)
    }
    finally
    {
        isFetching.value = false
    }
}

const setIdJadwal = (idJadwal) =>
{
    localStorage.setItem('id_jadwal', idJadwal)

    setTimeout(() =>
    {
        router.push({name : 'FormList'})
    },1000)
    console.log(localStorage.id_jadwal)
}

const setIdHistory = (idJadwal) =>
{
    localStorage.setItem('id_jadwal', idJadwal)

    setTimeout(() =>
    {
        router.push({name : 'HistoryList'})
    },1000)
    console.log(localStorage.id_jadwal)
}

const fetchJadwal = async () =>
{
    isFetching.value = true
    localStorage.removeItem('id_jadwal')

    try
    {
        const response = await siswaAPI.fetchJadwal(request)

        const data = response.data.data

        const absenValid = ref(false)
        
        if(data.api_data.some(jadwal => waktu >= jadwal.waktu_mulai && waktu <= jadwal.waktu_selesai))
        {
            absenValid.value = true
        }
        else
        {
            absenValid.value = false
            waktuAbsenSelesai.value = true
        }
        dataJadwalFix.value = data.api_data.map((p, i) => ({ 
            index : i+1, 
            label : `${p.mulai}/${p.selesai}`,
            valid : absenValid.value, ...p}))

    }
    catch(err) {
        if(err.response?.status == 401)
        {
            // localStorage.clear()
            // showDrawer.value = false
            // toastMessage.value = 'Berhasil Logout!'
            // toastType.value = 'success'
            // notif()
            // setTimeout(() => {
            //     router.push({name : 'login'})
            // }, 2500)
        //    API.userLogout()
        }
    }
    finally
    {
        isFetching.value = false

        console.log(dataJadwalFix.value)
        console.log('Waktu Selesai : '+waktuAbsenSelesai.value)
    }
}

watch(selectedHari, () =>
{
    console.log('Hari dipilih : '+selectedHari.value)
    filterJadwal()
})
</script>

<template>
    <SiswaLayout :isLoading="isFetching">
        <template #pageContent>
            <section class="min-h-screen">
                <Select v-model="selectedHari" :options="dataHari" optionLabel="hari" optionValue="hari"placeholder="Filter Hari" class="w-full md:w-56" />
                <div class="p-2 flex flex-wrap" v-for="jadwal in dataJadwalFix" :key="jadwal" v-if="dataJadwalFix.length > 0">
                    <Card class="border border-gray-200 w-full">
                        <template #title>
                            <span class="text-bold uppercase">
                                {{ jadwal.hari }}
                            </span>
                        </template>
                        <template #content>
                            <div class="flex flex-col gap-y-2">
                                <p class="text-base font-semibold">
                                    {{ jadwal.waktu_mulai+` - `+jadwal.waktu_selesai }}
                                </p>
                                <span>Mata Pelajaran : {{ jadwal.nama_mapel }}</span>
                                <span>Guru : {{ jadwal.nama_guru }}</span>
                                
                                <Button :disabled="!jadwal.valid" size="small" severity="info" label="FORM ABSEN" icon="pi pi-file-check" iconPos="right" @click="setIdJadwal(jadwal.id_jadwal)" />
                                
                                <!-- <Button :disabled="!jadwal.valid" size="small" severity="info" label="FORM ABSEN" icon="pi pi-file-check" iconPos="right" @click="setIdJadwal(jadwal.id_jadwal)" /> -->

                                <Button size="small" severity="primary" label="RIWAYAT ABSEN" icon="pi pi-history" @click="setIdHistory(jadwal.id_jadwal)" />
                            </div>
                        </template>
                    </Card>
                </div>
                <Message severity="secondary" class="mt-8" v-else>Jadwal Belum di upload</Message>    

            </section>   
        </template>
    </SiswaLayout>
</template>

<style scoped>
</style>