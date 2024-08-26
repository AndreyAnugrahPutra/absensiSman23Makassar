import api from "./index"

export default {
    tokenValidation(userToken)
    {
        return api().get('/tokenValidation/'+userToken)
    },
    loginPage()
    {

        return api().get('/sanctum/csrf-cookie').then(api().get('/fetchLevel'))
    },
    userLogin(form)
    {
        return api().post('/clientLogin', form)
    },
    userLogout(form)
    {
        return api().post('/logout', form)
    },
    fecthAnak(email)
    {
        return api().get(`/orangtua/data_anak/${email}`)
    },
    fecthJadwalAnak(id_kelas)
    {
        return api().get(`/orangtua/jadwal_anak/${id_kelas}`)
    },
    fecthAbsenAnak(id_jadwal,id_anak)
    {
        return api().get(`/orangtua/absen_anak/${id_jadwal}/${id_anak}`)
    },
    getUserProfile(data)
    {
        return api().get('/profile/'+data)
    },
}