import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/Auth/Login.vue'

// siswa page 
import siswaDashboard from '@/views/Siswa/Index.vue'
import siswaAbsensiIndex from '@/views/Siswa/Absensi/Index.vue'
import siswaJadwalIndex from '@/views/Siswa/Jadwal/Index.vue'
import FormList from '@/views/Siswa/Absensi/FormList.vue'
import HistoryList from '@/views/Siswa/Absensi/HistoryList.vue'

// ortu page
import ortuDashboard from '@/views/Ortu/Index.vue'
import ortuJadwalAnak from '@/views/Ortu/JadwalAnak.vue'
import ortuAbsenAnak from '@/views/Ortu/AbsenAnak.vue'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
      props : true,
    },
    {
      path: '/dashboard',
      name: 'siswaDashboard',
      component: siswaDashboard,
      meta : { requiresAuth : true, title : 'Dashboard' },
      props : true
    },
    {
      path: '/Absensi',
      name: 'siswaAbsensiIndex',
      component: siswaAbsensiIndex,
      meta : { requiresAuth : true , title : 'Absensi' },
      props : true
    },
    {
      path: '/RiwayatAbsensi',
      name: 'HistoryList',
      component: HistoryList,
      meta : { requiresAuth : true , title : 'Riwayat Absensi' },
      props : true
    },
    {
      path: '/Jadwal',
      name: 'siswaJadwalIndex',
      component: siswaJadwalIndex,
      meta : { requiresAuth : true, title : 'Jadwal Pelajaran' },
      props : true
    },
    {
      path: '/DaftarAbsensi',
      name: 'FormList',
      component: FormList,
      meta : { requiresAuth : true, title : 'Daftar Absensi' },
      props : true
    },

    {
      path: '/orangtua/dashboard',
      name: 'ortuDashboard',
      component: ortuDashboard,
      meta : { requiresAuth : true, title : 'Dashboard' },
      props : true
    },

    {
      path: '/orangtua/jadwal_anak',
      name: 'ortuJadwalAnak',
      component: ortuJadwalAnak,
      meta : { requiresAuth : true, title : 'Jadwal Kelas' },
      props : true
    },
    {
      path: '/orangtua/absen_anak',
      name: 'ortuAbsenAnak',
      component: ortuAbsenAnak,
      meta : { requiresAuth : true, title : 'Absen Anak' },
      props : true
    },
  ]
})

const redirectPage = () =>
  {
      if(localStorage.getItem('isLoggedin'))
      {
          if(localStorage.getItem('level') === 'siswa')
          {
              setTimeout(()=>
              {
                 
                  router.push({ name : 'siswaDashboard'})
              },1000)
          }
          else if(localStorage.getItem('level') === 'orangtua')
          {
              setTimeout(()=>
              {
                 
                  router.push({ name : 'ortuDashboard'})
              },1000)
          }
      }
  }

router.beforeEach((to, from) => {

  document.title = to.meta?.title ?? 'Absensi Siswa SMAN 23 Makassar'
  
  if (to.matched.some(record => record.meta.requiresAuth)) 
  {
    if (!localStorage.isLoggedin) {
      router.push({name : 'login'});
    }
  } 
})


export default router
