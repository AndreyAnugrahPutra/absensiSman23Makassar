<script setup>
import {ref, onMounted, shallowRef} from 'vue'
import router from '@/router'

import siswaAPI from '@/api/siswaAPI'

// import leaflet js
import "leaflet/dist/leaflet.css"
import * as L from 'leaflet'
// import layout
import SiswaLayout from '@/Layouts/SiswaLayout.vue'

import Button from 'primevue/button'
import Card from 'primevue/card'
import Message from 'primevue/message'
import RadioButton from 'primevue/radiobutton'
import Textarea from 'primevue/textarea'
import FileUpload from 'primevue/fileupload'

import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'


onMounted(() =>
{
    fetchFormList()
})

const toast = useToast()

const initialMap = shallowRef(null)

const dataFormAbsen = ref([])

const waktu = new Date()
const waktuFix = waktu.getHours()+':'+waktu.getMinutes()+':'+waktu.getSeconds()

const waktuAbsenSelesai = ref(false)
const bisaHadir = ref(false)
const lokasiValid = ref(false)


const formData = new FormData()

const form = ref({
    email : localStorage.getItem('email'),
    status : null,
    deskripsi : null,
    waktu_absen : waktuFix
})

const lat = ref(0)
const long = ref(0)
const accuracy = ref(0)
let marker,radius,zoomed

const jarakLokasi = ref()

const isLoading = ref(false)

const uploadLampiran = (event) =>
{
    formData.append('lampiran', event.files[0])

    toast.add({ severity: 'success', summary: 'Info', detail: 'Lampiran terupload!', life: 1000, group : 'tc1' });
}


const uploadAbsensi = async () =>
{
    // isLoading.value = true

    const idForm = dataFormAbsen.value[0].id_form

    formData.append('email', form.value.email)
    formData.append('status', form.value.status)
    formData.append('deskripsi', form.value.deskripsi)
    formData.append('waktu_absen', form.value.waktu_absen)

    try
    {
        const response = await siswaAPI.submitAbsensi(idForm,formData)

        const data = response.data.data

        if(response.status === 200)
        {
            toast.add({ severity: 'success', summary: 'Info', detail: 'Berhasil Absen!', life: 2000, group : 'tc1' });
        }


    }
    catch(err) { 
        toast.add({ severity: 'error', summary: 'Info', detail: 'Gagal Absen :(', life: 2000, group : 'tc1' });

        console.error(err) 
    }
    finally
    {
        isLoading.value = false

        setTimeout(() => {
                router.push({name : 'siswaJadwalIndex'})
            }, 2500)
    }
}
const fetchFormList = async () =>
{
    isLoading.value = true 

    try 
    {
        const response = await siswaAPI.fetchDaftarAbsen(localStorage.id_jadwal)

        const data = response.data.data

        if(data?.api_data !== null)
        {
            dataFormAbsen.value = data.api_data
            
            setTimeout(()=>
            {
                getLocation()
            }, 2500)
        }

        if(waktuFix >= dataFormAbsen?.value[0]?.waktu_mulai && waktuFix <= dataFormAbsen?.value[0]?.waktu_selesai)
        {
            bisaHadir.value = true
            waktuAbsenSelesai.value = false
        }
        else
        {
            bisaHadir.value = false
            waktuAbsenSelesai.value = true
        }

    }
    catch(err) { console.error(err) }
    finally
    {
        isLoading.value = false
    }
}

const fetchMap = () =>
{
 
    if(dataFormAbsen.value)
    {     
        marker = L.marker([dataFormAbsen.value[0].latitude, dataFormAbsen.value[0].longitude]).addTo(initialMap.value).bindPopup(dataFormAbsen.value[0].nama_lokasi).openPopup()
        radius = L.circle([dataFormAbsen.value[0].latitude,dataFormAbsen.value[0].longitude], {radius : dataFormAbsen.value[0].radius}).addTo(initialMap.value)
    
        validasiLokasi(dataFormAbsen.value[0].latitude, dataFormAbsen.value[0].longitude,lat.value,long.value)
    }
}

const validasiLokasi = (latSekolah,longSekolah,latUser,longUser) =>
{
    const toRad = (value) => {
        return value * Math.PI / 180;
    };

    const radiusSekolah = dataFormAbsen.value[0].radius / 1000 //radius sekolah dalam Meter
    const R = 6371; // Radius bumi dalam kilometer

    const dLat = toRad(latUser - latSekolah);
    const dLon = toRad(longUser - longSekolah);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(latSekolah))   
    * Math.cos(toRad(latUser)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    if(distance*1000 / 1000 < radiusSekolah)
    {
        bisaHadir.value = true
        lokasiValid.value = true
        jarakLokasi.value = 'Silahkan Absen'
    }
    else
    {
        lokasiValid.value = false 
        bisaHadir.value = false
        jarakLokasi.value = 'Lokasi anda : '+Math.round(distance*1000)+' M dari sekolah'
    }
} 

const getLocation = () =>
{   
    if(dataFormAbsen.value)
    {     
        initialMap.value = L.map('map').setView([0, 0], 11);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19, 
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(initialMap.value)

        if(navigator.geolocation)
        {
            
            navigator.geolocation.getCurrentPosition((position) =>
            {
                
                lat.value = position.coords.latitude
                long.value = position.coords.longitude
                accuracy.value = position.coords.accuracy
                
                initialMap.value.setView([lat.value, long.value], 11)
                
                marker = L.marker([lat.value, long.value]).addTo(initialMap.value).bindPopup('Lokasi Anda').openPopup()
            
                fetchMap()

                if(!zoomed)
                {
                    zoomed = initialMap.value.fitBounds(radius.getBounds())
                }
            })
        }
    }

}

</script>

<template>
    <SiswaLayout :isLoading="isLoading">
        <template #pageContent>
            <section class="min-h-screen flex flex-col gap-y-8 p-2">
                <Toast class="w-[100%] ml-6 md:ml-0" position="top-center" group="tc1" />
                <Button size="small" icon="pi pi-arrow-left" @click="router.back()"/>
                <div id="map" style="height:50vh;" v-if="dataFormAbsen.length > 0"></div>

                <span>{{ jarakLokasi }}</span>

                <div class="p-2 flex flex-wrap" v-for="absen in dataFormAbsen" :key="absen.index" v-if="dataFormAbsen.length > 0">
                    <form submit.prevent enctype="multipart/form-data" class="w-full">
                        <Card class="w-full border-0">
                            <template #title>
                                <span class="text-bold uppercase">
                                    {{ absen.hari }}
                                </span>
                            </template>
                            <template #content>
                                <div class="flex flex-col gap-y-2">
                                    <p class="text-base font-semibold">
                                        Tanggal Dibuat :
                                        {{ absen.tanggal_dibuat }}
                                    </p>
                                    <p class="text-base font-semibold">
                                        {{ absen.waktu_mulai+` - `+absen.waktu_selesai }}
                                    </p>
                                    <span>Mata Pelajaran : {{ absen.mapel }}</span>
                                    <span>Guru : {{ absen.nama_guru }}</span>
    
                                    <div class="flex items-center gap-x-4">
                                        <div class="flex items-center">
                                            <RadioButton inputId="Hadir" v-model="form.status" value="Hadir" :disabled="!bisaHadir && !lokasiValid || waktuAbsenSelesai"/>
                                            <label for="Hadir" class="ml-2">Hadir</label>
                                        </div>
                                        <div class="flex items-center">
                                            <RadioButton inputId="Izin" v-model="form.status" value="Izin" :disabled="bisaHadir && lokasiValid || waktuAbsenSelesai"/>
                                            <label for="Izin" class="ml-2">Izin</label>
                                        </div>
                                        <div class="flex items-center">
                                            <RadioButton inputId="Sakit" v-model="form.status" value="Sakit" :disabled="bisaHadir && lokasiValid || waktuAbsenSelesai"/>
                                            <label for="Sakit" class="ml-2">Sakit</label>
                                        </div>
                                        <div class="flex items-center">
                                            <RadioButton inputId="Alpha" v-model="form.status" value="Alpha" :disabled="bisaHadir || lokasiValid ||!waktuAbsenSelesai"/>
                                            <label for="Alpha" class="ml-2">Alpha</label>
                                        </div>
                                    </div>
                                    
                                    
                                    <Textarea rows="4" cols="30" :disabled="bisaHadir && lokasiValid || waktuAbsenSelesai" v-model="form.deskripsi" />
    
                                    <Button v-if="bisaHadir && lokasiValid" size="small" severity="info" label="SUBMIT KEHADIRAN" icon="pi pi-file-check" iconPos="right" as="router-link" :to="{name : 'FormList'}" @click="uploadAbsensi"/>
    
                                    <Button severity="warn" size="small" label="SUBMIT" v-if="!bisaHadir && !lokasiValid" @click="uploadAbsensi"/>
    
                                    <FileUpload accept="image/*, .pdf" :multiple="false" customUpload @uploader="uploadLampiran($event)" chooseLabel="Upload Lampiran Sakit/Izin" :maxFileSize="1000000" v-if="!bisaHadir && !lokasiValid" />
                                </div>
                            </template>
                        </Card>
                    </form>
                </div>
                <Message severity="secondary" class="mt-2" v-else>Form Absen Belum dibuat</Message>    
            </section>   
        </template>
    </SiswaLayout>
</template>

<style scoped>
</style>