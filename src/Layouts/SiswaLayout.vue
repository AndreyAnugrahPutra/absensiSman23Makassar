<script setup>
import { onMounted, ref } from 'vue'

import Navbar from '@/components/Siswa/Navbar.vue'

import Button from 'primevue/button'

import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

import Skeleton from 'primevue/skeleton'
import router from '@/router'

const pageProps = defineProps({ isLoading : Boolean })

onMounted(()=>
{
    setInterval(hariTanggal, 1000)

    setTimeout(()=>
    {
        firstLogin()
    },1600)
})


const toast = useToast();

const isRefresh = ref(false)

const nama = localStorage.nama

const firstLogin = () =>
{
    if(localStorage.firstLogin == 'true')
    {
        toast.add({ severity: 'info', summary: 'Info', detail: `Selamat Datang, ${nama}!` , life: 2000, styleClass : 'max-w-[22rem]', group : 'tc1'})

        setTimeout(() =>
        {
            localStorage.removeItem('firstLogin')
            refreshPage()
        },500)
    }
}

const refreshPage = () => 
{
    isRefresh.value = true
    router.go()
    setTimeout(() => isRefresh.value = false, 1000)
}

let timestamp = ref('')

let hariTanggal = () =>
{
    const today = new Date();
    const date = 'Hari/Tanggal : '+today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear()
    const time = 'Jam : '+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date +' '+ time;
    timestamp.value = dateTime;
}

</script>

<template>
    <!-- <div> -->
        <div class=" bg-gray-300 p-1">
            <Toast class="w-[100%] ml-6 md:ml-0" position="top-center" group="tc1"/>
            <!--navbar-->
            <Navbar />
            <!--navbar end-->

            <!--page content-->
            <div class="flex flex-col gap-y-1 max-w-full">
                <!--content header  -->
                <div class="min-h-[4rem] h-[4rem] text-sm bg-white p-4 rounded-lg w-full flex flex-col justify-center text-gray-700">
                    <span>{{ $route.meta.title }}</span>
                    <span>{{ timestamp }}</span>
                </div>
                <!--content header end-->
                <div class="fixed top-[85%] left-[85%] z-[100] w-fit">
                    <Button size="large" icon="pi pi-refresh" severity="contrast" rounded class="shadow-xl" :loading="isRefresh" @click="refreshPage" />
                </div>
                <!--content body-->
                <Skeleton width="100%" height="100vh" v-if="pageProps.isLoading" />
                <div class="w-full h-full bg-white rounded-lg p-2" v-else>
                    <slot name="pageContent"/>
                </div>
                <!--content body end-->

            </div>
            <!--page content-->
        </div>
    <!-- </div> -->

</template>

<style scoped>
</style>