<script setup>
import {ref, onMounted} from 'vue'
import siswaAPI from '@/api/siswaAPI'

// import layout
import SiswaLayout from '@/Layouts/SiswaLayout.vue'
import Card from 'primevue/card'

onMounted(() => 
{
    fetchTahunAjar()
})

const isLoading = ref(false)
const dataTahunAjar = ref([])

const fetchTahunAjar = async () =>
{
    isLoading.value = true 

    try 
    {
        const response = await siswaAPI.fetchTahunAjar()
        const data = response.data.data

        if(data.api_data)
        {
            dataTahunAjar.value = data.api_data 
        }

    }
    catch(err) { console.error(err) }
    finally
    {
        isLoading.value = false
    }
}

</script>

<template>
    <SiswaLayout :isLoading="isLoading">
        <template #pageContent>
            <section class="min-h-screen flex flex-col gap-y-8 p-2">
                <Card class="rounded-lg p-4 text-sm border overflow-hidden shadow" unstyled v-if="dataTahunAjar">
                    <template #content>
                        <div class="flex items-center justify-between">
                            <span>
                                Semester : {{ dataTahunAjar['semester'] }}
                            </span>
                            <span>
                                Tahun Ajaran : {{ dataTahunAjar['mulai'] +'/'+dataTahunAjar['selesai'] }}
                            </span>
                        </div>
                    </template> 
                </Card>
                <span class="text-lg">Menu Utama</span>

                <router-link :to="{name : 'siswaJadwalIndex'}" class="w-fit">
                    <div class="size-28 border rounded-lg shadow-md bg-yellow-400 flex justify-center items-center">
                        <i class="pi pi-book text-white" style="font-size: 2rem;"></i>
                    </div>
                </router-link>
            </section>   
        </template>
    </SiswaLayout>
</template>

<style scoped>
</style>