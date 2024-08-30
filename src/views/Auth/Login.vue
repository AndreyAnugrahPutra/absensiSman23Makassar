<script setup>
import {ref, onMounted} from 'vue'
import router from '@/router'
import API from '@/api/API'

import AppLogo from '@/components/AppLogo.vue'

import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Select from 'primevue/select'
import Button from 'primevue/button'
import Toast from 'primevue/toast'

import { useToast } from 'primevue/usetoast'

onMounted( () =>
{
    setTimeout(() => {
    isLoading.value = true
    fetchLevel()
    },500)
    redirectPage()
})

const toast = useToast();

const toastMessage = ref(null)
const toastType = ref(false)

let loginLevel = ref()

const isLoading = ref(false)


const notif = () =>
{
    toast.add({ severity: toastType.value, summary: 'Info', detail: toastMessage.value , life: 2000, styleClass : 'max-w-[22rem]', group : 'tc' });
}

let form = ref({
    email : null,
    password : null,
    level : null,
})

const login = async () =>
{
    isLoading.value = true

    if(form.value.email && form.value.level && form.value.password)
    {
        try
        {
            const response = await API.userLogin(form.value)

            const data = response.data.data

            console.log(data)

            if(data.api_data)
            {     
                localStorage.setItem('token', data.api_data.token)
                localStorage.setItem('nama', data.api_data.nama)
                localStorage.setItem('email', data.api_data.email)
                localStorage.setItem('level', data.api_data.level)
                localStorage.setItem('kelas', data.api_data.kelas)
                localStorage.setItem('isLoggedin', true)
                localStorage.setItem('firstLogin', true)
                toast.add({ severity: 'success', summary: 'Info', detail: data.api_message , life: 2000, styleClass : 'max-w-[22rem]', group : 'tc' });
                
            }
            else
            {
                toast.add({ severity: 'error', summary: 'Info', detail: data.api_message , life: 2000, styleClass : 'max-w-[22rem]', group : 'tc' });
            }

        }
        catch(err) 
        { 
            if(err)
            {
                toast.add({ severity: 'error', summary: 'Info', detail: 'Gagal Login! Silahkan coba lagi beberapa saat', life: 2000, styleClass : 'max-w-[22rem]', group : 'tc' });
            }

            console.error(err)
        }
        finally
        {
            isLoading.value = false
            setTimeout(() => {
                redirectPage()
            }, 2000)
        }
    }
    else
    {
        toastType.value = 'error'
        toastMessage.value = "Silahkan Isi Nama/Password/Level"
        notif()
        isLoading.value = false
    }
}

const  fetchLevel = async () =>
{
    isLoading.value = true

    try
    {
        const response = await API.loginPage()

        const data = response.data.data

        if(!data.api_data)
        {
            fetchLevel()
        }
        loginLevel = data.api_data
    }
    catch(err) { 
        // toast.add({ severity: 'error', summary: 'Info', detail: err , life: 5000, styleClass : 'max-w-[22rem]', group : 'tc' });
        console.error(err) 
    }
    finally
    {
        isLoading.value = false
    }
}

const redirectPage = () =>
{
    if(localStorage.getItem('isLoggedin'))
    {
        isLoading.value = true

        if(localStorage.getItem('level') === 'siswa')
        {
            setTimeout(()=>
            {
                isLoading.value = true
                router.push({ name : 'siswaDashboard'})
            },1000)
        }
        else if(localStorage.getItem('level') === 'orangtua')
        {
            setTimeout(()=>
            {
                isLoading.value = true
                router.push({ name : 'ortuDashboard'})
            },1000)
        }
    }
}
</script>

<template>
    <section class="min-h-screen w-full p-[4rem] flex flex-col gap-8 place-items-center">
        <AppLogo class="size-20" />
        <Toast class="w-[100%] ml-6 md:ml-0" position="top-center" group="tc"/>
        <h1>SILAHKAN LOGIN</h1>
       <form @submit.prevent="login" class="p-8 flex flex-col gap-4 border border-gray-300 rounded-xl">
            <div class="flex flex-col gap-2">
                <label for="email">EMAIL</label>
                <InputText required id="email" v-model="form.email" placeholder="email akun anda"/>
            </div>
            <div class="flex flex-col gap-2">
                <label for="password">PASSWORD</label>
                <Password required id="password" v-model="form.password" toggle-mask placeholder="password akun anda"/>
            </div>
            <div class="flex flex-col gap-2">
                <label for="level">LEVEL</label>
                <Select :disabled="isLoading" id="level" v-model="form.level" :options="loginLevel" option-value="id_level" option-label="nama_level" placeholder="Pilih Level Akses"   />
            </div>
            <Button label="LOGIN" @click="login" :disabled="isLoading" icon="pi pi-sign-in" :loading="isLoading" icon-pos="right"/>
       </form>
    </section>
</template>

<style scoped>
</style>