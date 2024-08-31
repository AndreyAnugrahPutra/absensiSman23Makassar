import api from "./index"

export default {
    fetchAllJadwal()
    {
        return api().get('/jadwal')
    },
    fetchJadwal(nama_kelas)
    {
        return api().post('/jadwal/kelas', nama_kelas)
    },
    fetchJadwalByHari(Hari, nama_kelas)
    {
        return api().post(`/jadwal/kelas/${Hari}`,nama_kelas)
    },
    fetchDaftarAbsen(idJadwal, emailSiswa)
    {
        return api().post('/absen/daftar_absen/'+idJadwal, emailSiswa)
    },
    submitAbsensi(id_form, formData)
    {
        return api().post(`/absen/submit/${id_form}`, formData)
    },
    fetchDataAbsen(email, id_jadwal)
    {
        return api().get(`/absen/data/${email}/${id_jadwal}`)
    },
    fetchTahunAjar()
    {
        return api().get(`/tahun_ajar`);
    },
}