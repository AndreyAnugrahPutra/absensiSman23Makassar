<script setup>
import { ref, onMounted } from 'vue'

import NavbarLink from '../NavbarLink.vue'

import API from '@/api/API'

import Drawer from 'primevue/drawer'
import Button from 'primevue/button'
import Toast from 'primevue/toast'

import ConfirmDialog from 'primevue/confirmdialog'
import {useConfirm} from 'primevue/useconfirm'

import { useToast } from 'primevue/usetoast'
import router from '@/router'

const toast = useToast()

const confirm = useConfirm()

const showDrawer = ref(false)

const isLoading = ref(false)

const toastMessage = ref()
const toastType = ref()

const currentRoute = router.currentRoute.value.name

const notif = () =>
{
    toast.add({ severity: toastType, summary: 'Info', detail: toastMessage , life: 2000, styleClass : 'max-w-[22rem]', group : 'tc10' });
}

const form = {
    nama : localStorage.getItem('nama'),
    email : localStorage.getItem('email'),
    level : localStorage.getItem('level'),
    token : localStorage.getItem('token'),
    isLoggedin : localStorage.getItem('isLoggedin'),
}

const logoutConfirm = () =>
{
    confirm.require({
        group : 'headless',
        message: 'Ingin logout dari aplikasi ?',
        header: 'Peringatan',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'Batal',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Logout',
            severity: 'danger',
            outlined: false
        },
        accept: () => {
            logout()
        },

    });
}
const logout = async () =>
{
    isLoading.value = true
    try
    {
        await API.userLogout(form)
    }
    catch(err) { console.error(err) }
    finally
    {   
        localStorage.clear()
        showDrawer.value = false
        toastMessage.value = 'Berhasil Logout!'
        toastType.value = 'success'
        isLoading.value = false
        notif()
        setTimeout(() => {
            router.push({name : 'login'})
        }, 2500)
    }
}

// console.log(currentRoute)

</script>

<template>
    <div class="max-h-[4rem] h-[4rem] justify-between text-sm bg-sky-500 p-4 w-full flex items-center text-gray-700 mb-2 rounded-lg">
        <Toast class="w-[100%] ml-6 md:ml-0" position="top-center" group="tc10"/>
        <!-- <ConfirmDialog class="w-[24rem]" /> -->
        <ConfirmDialog group="headless" class="w-[24rem] p-4">
            <template #container="{message,acceptCallback, rejectCallback}">
                <div class="flex flex-col items-center gap-y-4">
                    <h1 class="uppercase text-1xl font-semibold">{{ message.header }}</h1>
                    <i :class="message.icon" style="font-size: 3rem"></i>
                    <p>{{ message.message }}</p>
                    <div class="w-full flex justify-end gap-x-5">
                        <Button @click="rejectCallback" size="small" :severity="message.rejectProps.severity" :label="message.rejectProps.label" :outlined="message.rejectProps.outlined"/>
                        <Button @click="acceptCallback" size="small" :severity="message.acceptProps.severity" :label="message.acceptProps.label" :outlined="message.acceptProps.outlined"/>
                    </div>
                </div>
            </template>
        </ConfirmDialog>
      
        <Drawer v-model:visible="showDrawer" header="Menu" class="!w-[50%]" close-icon>
            <div class="flex flex-col justify-center gap-y-8">
                <NavbarLink :to="{name : 'ortuDashboard'}" :active=" currentRoute == 'ortuDashboard'">
                    Dashboard
                </NavbarLink>
            </div>
        </Drawer>
        <Button size="small" icon="pi pi-bars" severity="secondary" @click="showDrawer = true" />
        <Button @click="logoutConfirm" :loading="isLoading" :disabled="isLoading" size="small" severity="danger" icon="pi pi-power-off" icon-pos="right"/>
    </div>
</template>

<style scoped>
</style>