# BNF Form App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js mobile-friendly web app for inputting Informasi "BNF" forms, storing data in localStorage, and printing them as PDF matching the original paper form layout.

**Architecture:** Single Next.js app with two pages — a mobile form input page and a print-preview page that replicates the exact BNF paper form layout. Data flows through localStorage. Print CSS hides UI chrome and renders only the form layout.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, localStorage

---

## File Structure

| File | Responsibility |
|------|---------------|
| `app/layout.tsx` | Root layout, fonts |
| `app/globals.css` | Global styles + print CSS |
| `app/page.tsx` | Mobile form input page |
| `app/preview/page.tsx` | Print-preview page (renders BNF layout) |
| `lib/types.ts` | BNFData TypeScript interface |
| `lib/storage.ts` | localStorage read/write helpers |
| `components/BNFForm.tsx` | All form fields, mobile-optimized |
| `components/BNFPreview.tsx` | Paper-replica BNF layout for print |

---

## Task 1: Bootstrap Next.js Project

**Files:**
- Create: project root (via `npx create-next-app`)

- [ ] **Step 1: Scaffold project**

```bash
cd C:\Users\El\Documents\BNF
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
```
When prompted, accept all defaults.

- [ ] **Step 2: Verify it runs**

```bash
npm run dev
```
Open http://localhost:3000 — should show Next.js default page.

- [ ] **Step 3: Clean default content**

Replace `app/page.tsx` with:
```tsx
export default function Home() {
  return <div>BNF App</div>
}
```

- [ ] **Step 4: Commit**

```bash
git init
git add -A
git commit -m "chore: scaffold Next.js project"
```

---

## Task 2: Define Types and Storage

**Files:**
- Create: `lib/types.ts`
- Create: `lib/storage.ts`

- [ ] **Step 1: Create `lib/types.ts`**

```typescript
export interface BNFData {
  // Header
  tanggal: string
  area: string
  line: string
  dph: string
  sh: string

  // Kategori checkboxes
  kategoriSafety: boolean
  kategoriKualitas: boolean
  kategoriMesin: boolean
  kategoriLainLain: boolean

  // Identifikasi masalah
  namaProblem: string
  lokasiKejadian: string
  namaPartMesin: string
  tanggalWaktu: string
  penanggungJawab: string

  // Khusus Problem Outsource
  namaPart: string
  supplier: string

  // Isi form
  kronologisKejadian: string
  ilustrasi: string
  penyebab: string
  dampak: string
  penangananSementara: string
  followUp: string
  kondisiStock: string

  // Koordinasi
  koordinasiPAD: boolean
  koordinasiPBOD: boolean
  koordinasiPCD: boolean
  koordinasiPUD: boolean
  koordinasiOthers: boolean
  koordinasiOthersText: string

  // Informasi Tambahan
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
```

- [ ] **Step 2: Create `lib/storage.ts`**

```typescript
import { BNFData, emptyBNFData } from './types'

const KEY = 'bnf_form_data'

export function loadBNF(): BNFData {
  if (typeof window === 'undefined') return emptyBNFData()
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptyBNFData()
    return { ...emptyBNFData(), ...JSON.parse(raw) }
  } catch {
    return emptyBNFData()
  }
}

export function saveBNF(data: BNFData): void {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function clearBNF(): void {
  localStorage.removeItem(KEY)
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/
git commit -m "feat: add BNF types and localStorage helpers"
```

---

## Task 3: Mobile Form Page

**Files:**
- Create: `components/BNFForm.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create `components/BNFForm.tsx`**

```tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BNFData, emptyBNFData } from '@/lib/types'
import { loadBNF, saveBNF, clearBNF } from '@/lib/storage'

const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
const labelClass = 'block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide'
const sectionClass = 'bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3'
const sectionTitle = 'text-sm font-bold text-gray-800 border-b border-gray-200 pb-2 mb-3'

export default function BNFForm() {
  const router = useRouter()
  const [data, setData] = useState<BNFData>(emptyBNFData())

  useEffect(() => {
    setData(loadBNF())
  }, [])

  const set = (field: keyof BNFData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    saveBNF(data)
    alert('Data tersimpan!')
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
      <div className="bg-blue-600 text-white px-4 py-4 sticky top-0 z-10 shadow">
        <h1 className="text-lg font-bold">Informasi &quot;BNF&quot;</h1>
        <p className="text-xs text-blue-200">Engine Production Sunter Division</p>
      </div>

      <div className="px-4 py-4 space-y-4 max-w-lg mx-auto">

        {/* Kategori */}
        <div className={sectionClass}>
          <p className={sectionTitle}>Kategori</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              ['kategoriSafety', 'Problem Safety'],
              ['kategoriKualitas', 'Problem Kualitas'],
              ['kategoriMesin', 'Problem Mesin'],
              ['kategoriLainLain', 'Lain-Lain'],
            ].map(([field, label]) => (
              <label key={field} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data[field as keyof BNFData] as boolean}
                  onChange={set(field as keyof BNFData)}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Info Dasar */}
        <div className={sectionClass}>
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
            <div>
              <label className={labelClass}>Line</label>
              <input type="text" className={inputClass} value={data.line} onChange={set('line')} placeholder="Line..." />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelClass}>DpH</label>
                <input type="text" className={inputClass} value={data.dph} onChange={set('dph')} />
              </div>
              <div>
                <label className={labelClass}>SH</label>
                <input type="text" className={inputClass} value={data.sh} onChange={set('sh')} />
              </div>
            </div>
          </div>
        </div>

        {/* Identifikasi */}
        <div className={sectionClass}>
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
        <div className={sectionClass}>
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
        <div className={sectionClass}>
          <p className={sectionTitle}>Kronologis Kejadian</p>
          <textarea className={inputClass} rows={4} value={data.kronologisKejadian} onChange={set('kronologisKejadian')} placeholder="Ceritakan kronologis kejadian..." />
        </div>

        {/* Ilustrasi */}
        <div className={sectionClass}>
          <p className={sectionTitle}>Ilustrasi</p>
          <textarea className={inputClass} rows={3} value={data.ilustrasi} onChange={set('ilustrasi')} placeholder="Deskripsi ilustrasi..." />
        </div>

        {/* Penyebab */}
        <div className={sectionClass}>
          <p className={sectionTitle}>Penyebab</p>
          <textarea className={inputClass} rows={4} value={data.penyebab} onChange={set('penyebab')} placeholder="Penyebab masalah..." />
        </div>

        {/* Dampak */}
        <div className={sectionClass}>
          <p className={sectionTitle}>Dampak</p>
          <textarea className={inputClass} rows={3} value={data.dampak} onChange={set('dampak')} placeholder="Dampak yang terjadi..." />
        </div>

        {/* Penanganan Sementara */}
        <div className={sectionClass}>
          <p className={sectionTitle}>Penanganan Sementara</p>
          <textarea className={inputClass} rows={3} value={data.penangananSementara} onChange={set('penangananSementara')} placeholder="Penanganan sementara..." />
        </div>

        {/* Follow Up */}
        <div className={sectionClass}>
          <p className={sectionTitle}>Follow Up</p>
          <textarea className={inputClass} rows={3} value={data.followUp} onChange={set('followUp')} placeholder="Rencana follow up..." />
        </div>

        {/* Kondisi Stock */}
        <div className={sectionClass}>
          <p className={sectionTitle}>Kondisi Stock</p>
          <textarea className={inputClass} rows={3} value={data.kondisiStock} onChange={set('kondisiStock')} placeholder="Kondisi stock saat ini..." />
        </div>

        {/* Koordinasi */}
        <div className={sectionClass}>
          <p className={sectionTitle}>Koordinasi dengan Divisi Lain</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              ['koordinasiPAD', 'PAD'],
              ['koordinasiPBOD', 'PBOD'],
              ['koordinasiPCD', 'PCD'],
              ['koordinasiPUD', 'PUD'],
              ['koordinasiOthers', 'Others'],
            ].map(([field, label]) => (
              <label key={field} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data[field as keyof BNFData] as boolean}
                  onChange={set(field as keyof BNFData)}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
          {data.koordinasiOthers && (
            <input type="text" className={inputClass} value={data.koordinasiOthersText} onChange={set('koordinasiOthersText')} placeholder="Keterangan Others..." />
          )}
        </div>

        {/* Informasi Tambahan */}
        <div className={sectionClass}>
          <p className={sectionTitle}>Informasi Tambahan</p>
          <div className="space-y-2">
            {[
              ['c1', 'C1', 'Ada rekam jejak di masa lalu (tidak ada komplain)'],
              ['c2', 'C2', 'Terbukti dalam durability test dan pengujian lainnya'],
              ['c3', 'C3', 'Hasil pembongkaran: Tidak ada perubahan'],
              ['c4', 'C4', 'Operasi T/T ± 2/3 putaran: Tidak masalah'],
              ['c5', 'C5', 'Tidak ada masalah dalam hal fungsi dan struktur'],
              ['c6', 'C6', 'Tidak ada dampak pada kendaraan / mobil'],
            ].map(([field, code, label]) => (
              <label key={field} className="flex items-start gap-2 bg-gray-50 rounded-lg px-3 py-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data[field as keyof BNFData] as boolean}
                  onChange={set(field as keyof BNFData)}
                  className="w-4 h-4 mt-0.5 accent-blue-600 flex-shrink-0"
                />
                <span className="text-sm"><span className="font-semibold">{code}</span> {label}</span>
              </label>
            ))}
            <label className="flex items-start gap-2 bg-gray-50 rounded-lg px-3 py-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.c7}
                onChange={set('c7')}
                className="w-4 h-4 mt-0.5 accent-blue-600 flex-shrink-0"
              />
              <span className="text-sm font-semibold">C7 Lain-lain</span>
            </label>
            {data.c7 && (
              <input type="text" className={inputClass} value={data.c7Text} onChange={set('c7Text')} placeholder="Keterangan lain-lain..." />
            )}
          </div>
        </div>
      </div>

      {/* Floating action buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-3 max-w-lg mx-auto">
        <button onClick={handleReset} className="flex-none px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50">
          Reset
        </button>
        <button onClick={handleSave} className="flex-1 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200">
          Simpan
        </button>
        <button onClick={handlePreview} className="flex-1 py-2 text-sm bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
          Preview &amp; Print
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update `app/page.tsx`**

```tsx
import BNFForm from '@/components/BNFForm'

export default function Home() {
  return <BNFForm />
}
```

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx components/BNFForm.tsx
git commit -m "feat: add mobile BNF input form"
```

---

## Task 4: Print Preview Component

**Files:**
- Create: `components/BNFPreview.tsx`
- Create: `app/preview/page.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Create `components/BNFPreview.tsx`**

```tsx
'use client'

import { BNFData } from '@/lib/types'

interface Props {
  data: BNFData
}

function CheckBox({ checked, label }: { checked: boolean; label: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 mr-2 text-[8px]">
      <span className={`inline-block w-2.5 h-2.5 border border-black text-center leading-none text-[8px] ${checked ? 'bg-gray-800 text-white' : ''}`}>
        {checked ? '✓' : ''}
      </span>
      {label}
    </span>
  )
}

export default function BNFPreview({ data }: Props) {
  const formatDatetime = (v: string) => {
    if (!v) return ''
    try {
      return new Date(v).toLocaleString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    } catch { return v }
  }

  const formatDate = (v: string) => {
    if (!v) return ''
    try {
      return new Date(v).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
    } catch { return v }
  }

  return (
    <div className="bnf-paper font-sans text-black bg-white" style={{ width: '210mm', minHeight: '297mm', padding: '8mm', boxSizing: 'border-box', fontSize: '9px' }}>

      {/* Top header row */}
      <div className="flex justify-between items-start mb-1">
        <div className="border border-black" style={{ width: '120mm' }}>
          <div className="flex">
            <div className="border-r border-black px-1 py-0.5 text-[8px] font-semibold whitespace-nowrap">Kategori</div>
            <div className="flex-1 flex">
              {[
                ['kategoriSafety', 'Problem Safety'],
                ['kategoriKualitas', 'Problem Kualitas'],
                ['kategoriMesin', 'Problem Mesin'],
                ['kategoriLainLain', 'Lain-Lain'],
              ].map(([field, label], i) => (
                <div key={field} className={`flex-1 px-1 py-0.5 text-center ${i < 3 ? 'border-r border-black' : ''} ${data[field as keyof BNFData] ? 'bg-yellow-200' : ''}`}>
                  <div className="text-[7px]">{label}</div>
                  <div className="text-[8px]">{data[field as keyof BNFData] ? '✓' : ''}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="text-right text-[8px]">
          <div>Tanggal : <span className="font-semibold">{formatDate(data.tanggal)}</span></div>
          <div className="font-semibold">Engine Production Sunter Division</div>
          <div>Production / Quality / Maintenance / Engineering Department</div>
        </div>
      </div>

      {/* Title row */}
      <div className="flex gap-1 mb-1 items-stretch">
        <div className="border border-black" style={{ width: '20mm' }}>
          <div className="border-b border-black px-1 py-1">
            <div className="text-[7px] text-gray-500">Area</div>
            <div className="text-[9px] font-semibold">{data.area}</div>
          </div>
          <div className="px-1 py-1">
            <div className="text-[7px] text-gray-500">Line</div>
            <div className="text-[9px] font-semibold">{data.line}</div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center border border-black">
          <div style={{ fontSize: '22px', fontWeight: 'bold', fontStyle: 'italic' }}>Informasi &quot;BNF&quot;</div>
        </div>
        <div className="border border-black px-2 py-1 text-[8px]">
          <div className="font-semibold mb-0.5">Rule :</div>
          <div>- 15 menit : GL → SH</div>
          <div>- 30 menit : SH → DpH</div>
          <div>- 60 menit : DpH → DH/DD</div>
        </div>
        <div className="border border-black text-center" style={{ width: '20mm' }}>
          <div className="flex border-b border-black">
            <div className="flex-1 border-r border-black text-[7px] font-semibold py-0.5">DpH</div>
            <div className="flex-1 text-[7px] font-semibold py-0.5">SH</div>
          </div>
          <div className="flex" style={{ minHeight: '10mm' }}>
            <div className="flex-1 border-r border-black text-[9px] py-1">{data.dph}</div>
            <div className="flex-1 text-[9px] py-1">{data.sh}</div>
          </div>
        </div>
      </div>

      {/* Nama Problem */}
      <div className="flex gap-0 mb-0">
        <div className="border border-black flex-1">
          <div className="flex items-center min-h-[10px]">
            <span className="text-[7px] font-semibold px-1 border-r border-black whitespace-nowrap py-0.5">Nama Problem</span>
            <span className="text-[9px] px-2 font-semibold">{data.namaProblem}</span>
          </div>
        </div>
        <div className="border border-black border-l-0" style={{ width: '50mm' }}>
          <div className="text-[7px] px-1 pt-0.5 italic">* Khusus Problem Outsource</div>
        </div>
      </div>

      {/* Lokasi / Part / Mesin */}
      <div className="flex gap-0">
        <div className="border border-black border-t-0 flex-none" style={{ width: '50mm' }}>
          <span className="text-[7px] px-1">Lokasi Kejadian</span>
          <span className="text-[9px] px-1 font-semibold"> {data.lokasiKejadian}</span>
        </div>
        <div className="border border-black border-t-0 border-l-0 flex-1">
          <span className="text-[7px] px-1">Nama Part / Mesin</span>
          <span className="text-[9px] px-1 font-semibold"> {data.namaPartMesin}</span>
        </div>
        <div className="border border-black border-t-0 border-l-0 flex-none" style={{ width: '50mm' }}>
          <div className="text-[7px] px-1">Nama Part</div>
          <div className="text-[9px] px-1 font-semibold">{data.namaPart}</div>
        </div>
      </div>

      {/* Tanggal Waktu / PJ / Supplier */}
      <div className="flex gap-0 mb-1">
        <div className="border border-black border-t-0 flex-none" style={{ width: '50mm' }}>
          <span className="text-[7px] px-1">Tanggal &amp; Waktu</span>
          <span className="text-[9px] px-1 font-semibold"> {formatDatetime(data.tanggalWaktu)}</span>
        </div>
        <div className="border border-black border-t-0 border-l-0 flex-1">
          <span className="text-[7px] px-1">Penanggung Jawab</span>
          <span className="text-[9px] px-1 font-semibold"> {data.penanggungJawab}</span>
        </div>
        <div className="border border-black border-t-0 border-l-0 flex-none" style={{ width: '50mm' }}>
          <div className="text-[7px] px-1">Supplier</div>
          <div className="text-[9px] px-1 font-semibold">{data.supplier}</div>
        </div>
      </div>

      {/* Kronologis + Ilustrasi */}
      <div className="flex gap-0 mb-1">
        <div className="border border-black flex-1" style={{ minHeight: '35mm' }}>
          <div className="text-[8px] font-semibold px-1 pt-0.5 border-b border-black">Kronologis Kejadian</div>
          <div className="text-[9px] px-1 pt-1 whitespace-pre-wrap">{data.kronologisKejadian}</div>
        </div>
        <div className="border border-black border-l-0 flex-1" style={{ minHeight: '35mm' }}>
          <div className="text-[8px] font-semibold px-1 pt-0.5 border-b border-black">Ilustrasi</div>
          <div className="text-[9px] px-1 pt-1 whitespace-pre-wrap">{data.ilustrasi}</div>
        </div>
      </div>

      {/* Penyebab */}
      <div className="border border-black mb-1" style={{ minHeight: '25mm' }}>
        <div className="flex items-center border-b border-black px-1 py-0.5">
          <span className="text-[8px] font-semibold">● Penyebab</span>
        </div>
        <div className="text-[9px] px-2 pt-1 whitespace-pre-wrap">{data.penyebab}</div>
      </div>

      {/* Dampak */}
      <div className="border border-black mb-1" style={{ minHeight: '20mm' }}>
        <div className="text-[8px] font-semibold px-1 pt-0.5 border-b border-black">Dampak</div>
        <div className="text-[9px] px-2 pt-1 whitespace-pre-wrap">{data.dampak}</div>
      </div>

      {/* Penanganan Sementara */}
      <div className="border border-black mb-1" style={{ minHeight: '20mm' }}>
        <div className="text-[8px] font-semibold px-1 pt-0.5 border-b border-black">Penanganan Sementara</div>
        <div className="text-[9px] px-2 pt-1 whitespace-pre-wrap">{data.penangananSementara}</div>
      </div>

      {/* Follow Up */}
      <div className="border border-black mb-1" style={{ minHeight: '18mm' }}>
        <div className="text-[8px] font-semibold px-1 pt-0.5 border-b border-black">Follow Up</div>
        <div className="text-[9px] px-2 pt-1 whitespace-pre-wrap">{data.followUp}</div>
      </div>

      {/* Kondisi Stock */}
      <div className="border border-black mb-1" style={{ minHeight: '18mm' }}>
        <div className="text-[8px] font-semibold px-1 pt-0.5 border-b border-black">Kondisi Stock</div>
        <div className="text-[9px] px-2 pt-1 whitespace-pre-wrap">{data.kondisiStock}</div>
      </div>

      {/* Koordinasi */}
      <div className="border border-black mb-1 px-2 py-1">
        <div className="text-[8px] font-semibold mb-1">Koordinasi dengan divisi lain :</div>
        <div className="flex flex-wrap gap-3">
          <CheckBox checked={data.koordinasiPAD} label="PAD" />
          <CheckBox checked={data.koordinasiPBOD} label="PBOD" />
          <CheckBox checked={data.koordinasiPCD} label="PCD" />
          <CheckBox checked={data.koordinasiPUD} label="PUD" />
          <CheckBox checked={data.koordinasiOthers} label={`Others${data.koordinasiOthers && data.koordinasiOthersText ? ' : ' + data.koordinasiOthersText : ''}`} />
        </div>
      </div>

      {/* Informasi Tambahan */}
      <div className="border border-black px-2 py-1">
        <div className="text-[8px] font-semibold mb-1">Informasi Tambahan :</div>
        <div className="space-y-0.5">
          {[
            ['c1', 'C1', 'Ada rekam jejak di masa lalu (tidak ada komplain)'],
            ['c2', 'C2', 'Terbukti dalam durability test dan pengujian lainnya'],
            ['c3', 'C3', 'Hasil pembongkaran: Tidak ada perubahan'],
            ['c4', 'C4', 'Operasi T/T ± 2/3 putaran: Tidak masalah'],
            ['c5', 'C5', 'Tidak ada masalah dalam hal fungsi dan struktur'],
            ['c6', 'C6', 'Tidak ada dampak pada kendaraan / mobil'],
          ].map(([field, code, label]) => (
            <div key={field} className="flex items-center gap-1 text-[8px]">
              <span className={`inline-block w-2.5 h-2.5 border border-black text-center leading-none text-[7px] flex-shrink-0 ${data[field as keyof BNFData] ? 'bg-gray-700 text-white' : ''}`}>
                {data[field as keyof BNFData] ? '✓' : ''}
              </span>
              <span><span className="font-semibold">{code}</span> {label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1 text-[8px]">
            <span className={`inline-block w-2.5 h-2.5 border border-black text-center leading-none text-[7px] flex-shrink-0 ${data.c7 ? 'bg-gray-700 text-white' : ''}`}>
              {data.c7 ? '✓' : ''}
            </span>
            <span><span className="font-semibold">C7</span> Lain-lain {data.c7 && data.c7Text ? `(${data.c7Text})` : '(...)'}</span>
          </div>
        </div>
      </div>

    </div>
  )
}
```

- [ ] **Step 2: Create `app/preview/page.tsx`**

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BNFData, emptyBNFData } from '@/lib/types'
import { loadBNF } from '@/lib/storage'
import BNFPreview from '@/components/BNFPreview'

export default function PreviewPage() {
  const router = useRouter()
  const [data, setData] = useState<BNFData>(emptyBNFData())

  useEffect(() => {
    setData(loadBNF())
  }, [])

  return (
    <>
      <div className="no-print fixed top-0 left-0 right-0 bg-gray-800 text-white px-4 py-2 flex items-center justify-between z-50">
        <button onClick={() => router.push('/')} className="text-sm text-gray-300 hover:text-white">
          ← Kembali Edit
        </button>
        <span className="text-sm font-semibold">Preview BNF</span>
        <button onClick={() => window.print()} className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600">
          Print / PDF
        </button>
      </div>

      <div className="no-print pt-10 bg-gray-200 min-h-screen flex justify-center py-4">
        <div className="shadow-xl">
          <BNFPreview data={data} />
        </div>
      </div>

      <div className="print-only">
        <BNFPreview data={data} />
      </div>
    </>
  )
}
```

- [ ] **Step 3: Add print CSS to `app/globals.css`**

Append to the end of the existing file:

```css
@media print {
  .no-print {
    display: none !important;
  }
  .print-only {
    display: block !important;
  }
  body {
    margin: 0;
    padding: 0;
  }
  @page {
    size: A4 portrait;
    margin: 0;
  }
}

@media screen {
  .print-only {
    display: none !important;
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add components/BNFPreview.tsx app/preview/ app/globals.css
git commit -m "feat: add BNF print preview with A4 paper layout"
```

---

## Task 5: Final Test

- [ ] **Step 1: Run and test**

```bash
npm run dev
```

Open http://localhost:3000. Fill all fields. Click "Preview & Print". Verify layout matches original BNF paper form. Then print to PDF.

- [ ] **Step 2: Fix layout issues if any**

If text overflows, reduce font sizes in BNFPreview (e.g. change `text-[9px]` to `text-[8px]`). If page overflows 1 A4 page, reduce `minHeight` values on section blocks.

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: BNF form app complete"
```
