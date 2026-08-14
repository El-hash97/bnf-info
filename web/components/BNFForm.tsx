'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BNFData, emptyBNFData } from '@/lib/types'
import { loadBNF, saveBNF, clearBNF } from '@/lib/storage'

const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
const labelClass = 'block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide'
const sectionClassFull = 'bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3 sm:p-5 flex flex-col h-full'
const sectionTitle = 'text-sm font-bold text-gray-800 border-b border-gray-200 pb-2 mb-3'

function CheckCard({ label, checked, onChange }: {
  label: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <label className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-100">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 accent-blue-600"
      />
      <span className="text-sm text-gray-900">{label}</span>
    </label>
  )
}

export default function BNFForm() {
  const router = useRouter()
  const [data, setData] = useState<BNFData>(emptyBNFData())
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setData(loadBNF())
  }, [])

  const set = (field: keyof BNFData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    saveBNF(data)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    router.push('/preview?autoprint=1')
  }

  const handlePreview = () => {
    saveBNF(data)
    router.push('/preview')
  }

  const handleReset = () => {
    if (confirm('Hapus semua data form?')) {
      clearBNF()
      setData(emptyBNFData())
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-blue-700 text-white px-4 py-4 sm:px-6 lg:px-8 sticky top-0 z-10 shadow-md">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-lg font-bold">Informasi &quot;BNF&quot;</h1>
          <p className="text-xs text-blue-200">Engine Production Sunter Division</p>
        </div>
      </div>

      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-4 lg:grid lg:grid-cols-2 lg:gap-5 lg:space-y-0">

          {/* Kategori */}
          <div className={sectionClassFull}>
            <p className={sectionTitle}>Kategori</p>
            <div className="grid grid-cols-2 gap-2">
              {([
                ['kategoriSafety', 'Problem Safety'],
                ['kategoriKualitas', 'Problem Kualitas'],
                ['kategoriMesin', 'Problem Mesin'],
                ['kategoriLainLain', 'Lain-Lain'],
              ] as const).map(([field, label]) => (
                <CheckCard
                  key={field}
                  label={label}
                  checked={data[field]}
                  onChange={set(field) as (e: React.ChangeEvent<HTMLInputElement>) => void}
                />
              ))}
            </div>
          </div>

          {/* Info Dasar */}
          <div className={sectionClassFull}>
            <p className={sectionTitle}>Informasi Dasar</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Tanggal</label>
                <input type="date" className={inputClass} value={data.tanggal} onChange={set('tanggal')} />
              </div>
              <div>
                <label className={labelClass}>Area</label>
                <input type="text" className={inputClass} value={data.area} onChange={set('area')} placeholder="Area..." />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Line</label>
                <input type="text" className={inputClass} value={data.line} onChange={set('line')} placeholder="Line..." />
              </div>
            </div>
          </div>

          {/* Identifikasi */}
          <div className={sectionClassFull}>
            <p className={sectionTitle}>Identifikasi Masalah</p>
            <div>
              <label className={labelClass}>Nama Problem</label>
              <input type="text" className={inputClass} value={data.namaProblem} onChange={set('namaProblem')} placeholder="Nama problem..." />
            </div>
            <div>
              <label className={labelClass}>Lokasi Kejadian</label>
              <input type="text" className={inputClass} value={data.lokasiKejadian} onChange={set('lokasiKejadian')} placeholder="Lokasi..." />
            </div>
            <div>
              <label className={labelClass}>Nama Part / Mesin</label>
              <input type="text" className={inputClass} value={data.namaPartMesin} onChange={set('namaPartMesin')} placeholder="Part / Mesin..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Tanggal &amp; Waktu</label>
                <input type="datetime-local" className={inputClass} value={data.tanggalWaktu} onChange={set('tanggalWaktu')} />
              </div>
              <div>
                <label className={labelClass}>Penanggung Jawab</label>
                <input type="text" className={inputClass} value={data.penanggungJawab} onChange={set('penanggungJawab')} placeholder="Nama PJ..." />
              </div>
            </div>
          </div>

          {/* Khusus Outsource */}
          <div className={sectionClassFull}>
            <p className={sectionTitle}>Khusus Problem Outsource</p>
            <div>
              <label className={labelClass}>Nama Part</label>
              <input type="text" className={inputClass} value={data.namaPart} onChange={set('namaPart')} placeholder="Nama part..." />
            </div>
            <div>
              <label className={labelClass}>Supplier</label>
              <input type="text" className={inputClass} value={data.supplier} onChange={set('supplier')} placeholder="Nama supplier..." />
            </div>
          </div>

          {/* Kronologis */}
          <div className={sectionClassFull}>
            <p className={sectionTitle}>Kronologis Kejadian</p>
            <textarea className={`${inputClass} flex-1`} rows={4} value={data.kronologisKejadian} onChange={set('kronologisKejadian')} placeholder="Ceritakan kronologis kejadian..." />
          </div>

          {/* Ilustrasi */}
          <div className={sectionClassFull}>
            <p className={sectionTitle}>Ilustrasi</p>
            <textarea className={`${inputClass} flex-1`} rows={3} value={data.ilustrasi} onChange={set('ilustrasi')} placeholder="Deskripsi ilustrasi / gambar..." />
          </div>

          {/* Penyebab */}
          <div className={sectionClassFull}>
            <p className={sectionTitle}>Penyebab</p>
            <textarea className={`${inputClass} flex-1`} rows={4} value={data.penyebab} onChange={set('penyebab')} placeholder="Penyebab masalah..." />
          </div>

          {/* Dampak */}
          <div className={sectionClassFull}>
            <p className={sectionTitle}>Dampak</p>
            <textarea className={`${inputClass} flex-1`} rows={3} value={data.dampak} onChange={set('dampak')} placeholder="Dampak yang terjadi..." />
          </div>

          {/* Penanganan Sementara */}
          <div className={sectionClassFull}>
            <p className={sectionTitle}>Penanganan Sementara</p>
            <textarea className={`${inputClass} flex-1`} rows={3} value={data.penangananSementara} onChange={set('penangananSementara')} placeholder="Penanganan sementara..." />
          </div>

          {/* Follow Up */}
          <div className={sectionClassFull}>
            <p className={sectionTitle}>Follow Up</p>
            <textarea className={`${inputClass} flex-1`} rows={3} value={data.followUp} onChange={set('followUp')} placeholder="Rencana follow up..." />
          </div>

          {/* Kondisi Stock */}
          <div className={sectionClassFull}>
            <p className={sectionTitle}>Kondisi Stock</p>
            <textarea className={`${inputClass} flex-1`} rows={3} value={data.kondisiStock} onChange={set('kondisiStock')} placeholder="Kondisi stock saat ini..." />
          </div>

          {/* Koordinasi */}
          <div className={sectionClassFull}>
            <p className={sectionTitle}>Koordinasi dengan Divisi Lain</p>
            <div className="grid grid-cols-2 gap-2">
              {([
                ['koordinasiPAD', 'PAD'],
                ['koordinasiPBOD', 'PBOD'],
                ['koordinasiPCD', 'PCD'],
                ['koordinasiPUD', 'PUD'],
                ['koordinasiOthers', 'Others'],
              ] as const).map(([field, label]) => (
                <CheckCard
                  key={field}
                  label={label}
                  checked={data[field]}
                  onChange={set(field) as (e: React.ChangeEvent<HTMLInputElement>) => void}
                />
              ))}
            </div>
            {data.koordinasiOthers && (
              <input type="text" className={inputClass} value={data.koordinasiOthersText} onChange={set('koordinasiOthersText')} placeholder="Keterangan Others..." />
            )}
          </div>

          {/* Informasi Tambahan */}
          <div className={sectionClassFull}>
            <p className={sectionTitle}>Informasi Tambahan</p>
            <div className="space-y-2 flex-1">
              {([
                ['c1', 'Ada rekam jejak di masa lalu (tidak ada komplain)'],
                ['c2', 'Terbukti dalam durability test dan pengujian lainnya'],
                ['c3', 'Hasil pembongkaran: Tidak ada perubahan'],
                ['c4', 'Operasi T/T ± 2/3 putaran: Tidak masalah'],
                ['c5', 'Tidak ada masalah dalam hal fungsi dan struktur'],
                ['c6', 'Tidak ada dampak pada kendaraan / mobil'],
              ] as const).map(([field, label], i) => (
                <label key={field} className="flex items-start gap-2 bg-gray-50 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={data[field]}
                    onChange={set(field)}
                    className="w-4 h-4 mt-0.5 accent-blue-600 flex-shrink-0"
                  />
                  <span className="text-sm text-gray-900">{i + 1}. {label}</span>
                </label>
              ))}
              <label className="flex items-start gap-2 bg-gray-50 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={data.c7}
                  onChange={set('c7')}
                  className="w-4 h-4 mt-0.5 accent-blue-600 flex-shrink-0"
                />
                <span className="text-sm text-gray-900">7. Lain-lain</span>
              </label>
              {data.c7 && (
                <input type="text" className={inputClass} value={data.c7Text} onChange={set('c7Text')} placeholder="Keterangan lain-lain..." />
              )}
            </div>
          </div>

          {/* Tanda Tangan */}
          <div className={sectionClassFull}>
            <p className={sectionTitle}>Tanda Tangan</p>
            <div className="grid grid-cols-2 gap-4 flex-1">
              {/* DpH — fixed Aldino */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">DpH</p>
                <div className="border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center justify-center p-2" style={{ minHeight: '90px' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/signature/sig-aldino.jpeg" alt="Tanda tangan Aldino" className="max-h-16 object-contain" />
                </div>
                <p className="text-xs text-center text-gray-500 mt-1">Aldino</p>
              </div>

              {/* SH — pilihan */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">SH</p>
                <div className="space-y-2">
                  {([
                    ['joko', 'Joko Kistanto', '/signature/sig-joko.jpeg'],
                    ['widodo', 'Widodo Purnomo', '/signature/sig-widodo.jpeg'],
                  ] as const).map(([key, nama, src]) => (
                    <label
                      key={key}
                      className={`flex flex-col items-center border rounded-lg p-2 cursor-pointer transition-colors ${
                        data.sh === key
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="sh-selection"
                        value={key}
                        checked={data.sh === key}
                        onChange={() => setData(prev => ({ ...prev, sh: key }))}
                        className="accent-blue-600 mb-1"
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={nama} className="max-h-12 object-contain mb-1" />
                      <span className="text-xs text-gray-900 text-center font-medium">{nama}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating action buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        <div className="max-w-5xl mx-auto flex gap-3">
          <button onClick={handleReset} className="flex-none px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
            Reset
          </button>
          <button onClick={handleSave} className={`flex-1 py-2 text-sm rounded-lg font-semibold transition-colors ${saved ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            {saved ? 'Tersimpan!' : 'Simpan'}
          </button>
          <button onClick={handlePreview} className="flex-1 py-2 text-sm bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Preview &amp; Print
          </button>
        </div>
      </div>
    </div>
  )
}
