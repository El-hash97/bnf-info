export interface BNFData {
  tanggal: string
  area: string
  line: string
  dph: string
  sh: string

  kategoriSafety: boolean
  kategoriKualitas: boolean
  kategoriMesin: boolean
  kategoriLainLain: boolean

  namaProblem: string
  lokasiKejadian: string
  namaPartMesin: string
  tanggalWaktu: string
  penanggungJawab: string

  namaPart: string
  supplier: string

  kronologisKejadian: string
  ilustrasi: string
  penyebab: string
  dampak: string
  penangananSementara: string
  followUp: string
  kondisiStock: string

  koordinasiPAD: boolean
  koordinasiPBOD: boolean
  koordinasiPCD: boolean
  koordinasiPUD: boolean
  koordinasiOthers: boolean
  koordinasiOthersText: string

  c1: boolean
  c2: boolean
  c3: boolean
  c4: boolean
  c5: boolean
  c6: boolean
  c7: boolean
  c7Text: string
}

export const emptyBNFData = (): BNFData => ({
  tanggal: '',
  area: '',
  line: '',
  dph: '',
  sh: '',
  kategoriSafety: false,
  kategoriKualitas: false,
  kategoriMesin: false,
  kategoriLainLain: false,
  namaProblem: '',
  lokasiKejadian: '',
  namaPartMesin: '',
  tanggalWaktu: '',
  penanggungJawab: '',
  namaPart: '',
  supplier: '',
  kronologisKejadian: '',
  ilustrasi: '',
  penyebab: '',
  dampak: '',
  penangananSementara: '',
  followUp: '',
  kondisiStock: '',
  koordinasiPAD: false,
  koordinasiPBOD: false,
  koordinasiPCD: false,
  koordinasiPUD: false,
  koordinasiOthers: false,
  koordinasiOthersText: '',
  c1: false,
  c2: false,
  c3: false,
  c4: false,
  c5: false,
  c6: false,
  c7: false,
  c7Text: '',
})
