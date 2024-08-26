<script setup>
import {ref, onMounted} from 'vue'
import API from '@/api/API';

// import layout
import OrtuLayout from '@/Layouts/OrtuLayout.vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Message from 'primevue/message'

import router from '@/router';

onMounted(()=>
{
    isLoading.value = true
    setTimeout(() => fetchAnak() ,500)
    localStorage.removeItem('id_anak')
    localStorage.removeItem('id_kelas')
    localStorage.removeItem('id_jadwal')
})

const isLoading = ref(false)
const dataAnak = ref()

const fetchAnak = async () =>
{
    isLoading.value = true

    try 
    {
        const response = await API.fecthAnak(localStorage.email)

        const data = response.data.data

        if(data.api_data)
        {
            dataAnak.value = data.api_data.map((p,i) =>
            ({
                index : i+1,
                ...p
            }))
        }
        else
        {
            fetchAnak()
        }
    }
    catch(err) { 
        console.error(err)
    }
    finally
    {
        isLoading.value = false
    }

}

const setIdKelas = (id_kelas,id_anak) =>
{
    localStorage.setItem('id_kelas', id_kelas)
    localStorage.setItem('id_anak', id_anak)

    setTimeout(()=>
    {
        router.push({name : 'ortuJadwalAnak'})

    },1500)
}

</script>

<template>
    <OrtuLayout :isLoading="isLoading">
        <template #pageContent>
            <section class="min-h-screen">
                <div class="p-2 flex flex-wrap" v-for="anak in dataAnak" :key="anak" v-if="dataAnak">
                    <Card class="border border-gray-200 w-full h-fit">
                        <template #title>
                            <span class="text-bold uppercase">
                                {{ anak.nama }}
                            </span>
                        </template>
                        <template #content>
                            <div class="flex flex-col gap-y-2">
                                <p class="text-base font-semibold">
                                    {{ 'Induk : '+anak.induk+` - NISN : `+anak.nisn }}
                                </p>
                                <span>Kelas : {{ anak.nama_kelas }}</span>
                                <span>Wali Kelas : {{ anak.nama_wali_kelas }}</span>
                                
                                <Button size="small" severity="info" label="JADWAL KELAS" icon="pi pi-book" @click="setIdKelas(anak.id_kelas,anak.user_id)" />
                            </div>
                        </template>
                    </Card>
                </div>
                <Message class="p-2" severity="secondary" v-else>
                    <span>Anda tidak terdaftar sebagai orangtua siswa</span>
                </Message>
                
            </section>   
        </template>
    </OrtuLayout>
</template>

<style scoped>
</style>