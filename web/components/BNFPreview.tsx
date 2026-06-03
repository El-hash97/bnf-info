'use client'

import { BNFData } from '@/lib/types'

interface Props {
  data: BNFData
}

function Checkbox({ checked, label }: { checked: boolean; label: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 mr-3">
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '9px',
          height: '9px',
          border: '1px solid black',
          fontSize: '7px',
          lineHeight: 1,
          backgroundColor: checked ? '#222' : 'transparent',
          color: 'white',
          flexShrink: 0,
        }}
      >
        {checked ? '✓' : ''}
      </span>
      <span style={{ fontSize: '8px' }}>{label}</span>
    </span>
  )
}

export default function BNFPreview({ data }: Props) {
  const formatDate = (v: string) => {
    if (!v) return ''
    try {
      return new Date(v).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
    } catch {
      return v
    }
  }

  const formatDatetime = (v: string) => {
    if (!v) return ''
    try {
      return new Date(v).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return v
    }
  }

  const border = '1px solid black'

  const section = (title: string, value: string, minHeight: string) => (
    <div style={{ border, marginBottom: '3px' }}>
      <div style={{ borderBottom: border, padding: '1px 4px', fontSize: '8px', fontWeight: 700 }}>{title}</div>
      <div style={{ padding: '3px 6px', fontSize: '9px', whiteSpace: 'pre-wrap', minHeight }}>{value}</div>
    </div>
  )

  return (
    <div
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '8mm 8mm 6mm 8mm',
        boxSizing: 'border-box',
        fontFamily: 'Arial, sans-serif',
        fontSize: '9px',
        color: 'black',
        backgroundColor: 'white',
      }}
    >
      {/* ROW 1: Kategori + Tanggal/Division */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
        <div style={{ border, display: 'flex', width: '125mm' }}>
          <div style={{ borderRight: border, padding: '2px 4px', fontSize: '8px', fontWeight: 700, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
            Kategori
          </div>
          {([
            ['kategoriSafety', 'Problem Safety'],
            ['kategoriKualitas', 'Problem Kualitas'],
            ['kategoriMesin', 'Problem Mesin'],
            ['kategoriLainLain', 'Lain-Lain'],
          ] as const).map(([field, label], i) => (
            <div
              key={field}
              style={{
                flex: 1,
                borderRight: i < 3 ? border : undefined,
                padding: '2px 3px',
                textAlign: 'center',
                backgroundColor: data[field] ? '#fef08a' : 'transparent',
              }}
            >
              <div style={{ fontSize: '7px' }}>{label}</div>
              <div style={{ fontSize: '9px', fontWeight: 700 }}>{data[field] ? '✓' : ''}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'right', fontSize: '8px' }}>
          <div>Tanggal : <strong>{formatDate(data.tanggal)}</strong></div>
          <div style={{ fontWeight: 700 }}>Engine Production Sunter Division</div>
          <div>Production / Quality / Maintenance / Engineering Department</div>
        </div>
      </div>

      {/* ROW 2: Area/Line | Title | Rules | DpH/SH */}
      <div style={{ display: 'flex', gap: '3px', marginBottom: '3px', alignItems: 'stretch' }}>
        <div style={{ border, width: '22mm', flexShrink: 0 }}>
          <div style={{ borderBottom: border, padding: '2px 4px' }}>
            <div style={{ fontSize: '7px', color: '#555' }}>Area</div>
            <div style={{ fontSize: '9px', fontWeight: 700 }}>{data.area}</div>
          </div>
          <div style={{ padding: '2px 4px' }}>
            <div style={{ fontSize: '7px', color: '#555' }}>Line</div>
            <div style={{ fontSize: '9px', fontWeight: 700 }}>{data.line}</div>
          </div>
        </div>

        <div style={{ flex: 1, border, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 900, fontStyle: 'italic', textAlign: 'center' }}>
            Informasi &quot;BNF&quot;
          </div>
        </div>

        <div style={{ border, padding: '4px 6px', flexShrink: 0, fontSize: '8px' }}>
          <div style={{ fontWeight: 700, marginBottom: '2px' }}>Rule :</div>
          <div>- 15 menit &nbsp;: GL → SH</div>
          <div>- 30 menit &nbsp;: SH → DpH</div>
          <div>- 60 menit &nbsp;: DpH → DH/DD</div>
        </div>

        <div style={{ border, width: '18mm', flexShrink: 0, textAlign: 'center' }}>
          <div style={{ display: 'flex', borderBottom: border }}>
            <div style={{ flex: 1, borderRight: border, fontSize: '7px', fontWeight: 700, padding: '1px' }}>DpH</div>
            <div style={{ flex: 1, fontSize: '7px', fontWeight: 700, padding: '1px' }}>SH</div>
          </div>
          <div style={{ display: 'flex', minHeight: '12mm' }}>
            <div style={{ flex: 1, borderRight: border, padding: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {data.dph && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.dph} alt="DpH" style={{ maxWidth: '100%', maxHeight: '12mm', objectFit: 'contain' }} />
              )}
            </div>
            <div style={{ flex: 1, padding: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {data.sh && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.sh} alt="SH" style={{ maxWidth: '100%', maxHeight: '12mm', objectFit: 'contain' }} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3: Nama Problem | Khusus Outsource label */}
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, border, display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '7px', fontWeight: 700, padding: '2px 4px', borderRight: border, whiteSpace: 'nowrap' }}>Nama Problem</span>
          <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 6px' }}>{data.namaProblem}</span>
        </div>
        <div style={{ width: '50mm', border, borderLeft: 'none', padding: '1px 4px' }}>
          <div style={{ fontSize: '7px', fontStyle: 'italic', color: '#555' }}>* Khusus Problem Outsource</div>
        </div>
      </div>

      {/* ROW 4: Lokasi | Part/Mesin | Nama Part */}
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50mm', border, borderTop: 'none', padding: '1px 4px' }}>
          <div style={{ fontSize: '7px', color: '#555' }}>Lokasi Kejadian</div>
          <div style={{ fontSize: '9px', fontWeight: 600 }}>{data.lokasiKejadian}</div>
        </div>
        <div style={{ flex: 1, border, borderTop: 'none', borderLeft: 'none', padding: '1px 4px' }}>
          <div style={{ fontSize: '7px', color: '#555' }}>Nama Part / Mesin</div>
          <div style={{ fontSize: '9px', fontWeight: 600 }}>{data.namaPartMesin}</div>
        </div>
        <div style={{ width: '50mm', border, borderTop: 'none', borderLeft: 'none', padding: '1px 4px' }}>
          <div style={{ fontSize: '7px', color: '#555' }}>Nama Part</div>
          <div style={{ fontSize: '9px', fontWeight: 600 }}>{data.namaPart}</div>
        </div>
      </div>

      {/* ROW 5: Tanggal Waktu | PJ | Supplier */}
      <div style={{ display: 'flex', marginBottom: '3px' }}>
        <div style={{ width: '50mm', border, borderTop: 'none', padding: '1px 4px' }}>
          <div style={{ fontSize: '7px', color: '#555' }}>Tanggal &amp; Waktu</div>
          <div style={{ fontSize: '9px', fontWeight: 600 }}>{formatDatetime(data.tanggalWaktu)}</div>
        </div>
        <div style={{ flex: 1, border, borderTop: 'none', borderLeft: 'none', padding: '1px 4px' }}>
          <div style={{ fontSize: '7px', color: '#555' }}>Penanggung Jawab</div>
          <div style={{ fontSize: '9px', fontWeight: 600 }}>{data.penanggungJawab}</div>
        </div>
        <div style={{ width: '50mm', border, borderTop: 'none', borderLeft: 'none', padding: '1px 4px' }}>
          <div style={{ fontSize: '7px', color: '#555' }}>Supplier</div>
          <div style={{ fontSize: '9px', fontWeight: 600 }}>{data.supplier}</div>
        </div>
      </div>

      {/* ROW 6: Kronologis | Ilustrasi */}
      <div style={{ display: 'flex', marginBottom: '3px' }}>
        <div style={{ flex: 1, border, minHeight: '32mm' }}>
          <div style={{ borderBottom: border, padding: '1px 4px', fontSize: '8px', fontWeight: 700 }}>Kronologis Kejadian</div>
          <div style={{ padding: '3px 6px', fontSize: '9px', whiteSpace: 'pre-wrap' }}>{data.kronologisKejadian}</div>
        </div>
        <div style={{ flex: 1, border, borderLeft: 'none', minHeight: '32mm' }}>
          <div style={{ borderBottom: border, padding: '1px 4px', fontSize: '8px', fontWeight: 700 }}>Ilustrasi</div>
          <div style={{ padding: '3px 6px', fontSize: '9px', whiteSpace: 'pre-wrap' }}>{data.ilustrasi}</div>
        </div>
      </div>

      {/* Penyebab */}
      <div style={{ border, marginBottom: '3px', minHeight: '22mm' }}>
        <div style={{ borderBottom: border, padding: '1px 4px', fontSize: '8px', fontWeight: 700 }}>Penyebab</div>
        <div style={{ padding: '3px 8px', fontSize: '9px', whiteSpace: 'pre-wrap' }}>{data.penyebab}</div>
      </div>

      {section('Dampak', data.dampak, '16mm')}
      {section('Penanganan Sementara', data.penangananSementara, '16mm')}
      {section('Follow Up', data.followUp, '14mm')}
      {section('Kondisi Stock', data.kondisiStock, '14mm')}

      {/* Koordinasi */}
      <div style={{ border, marginBottom: '3px', padding: '3px 6px' }}>
        <div style={{ fontSize: '8px', fontWeight: 700, marginBottom: '3px' }}>Koordinasi dengan divisi lain :</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          <Checkbox checked={data.koordinasiPAD} label="PAD" />
          <Checkbox checked={data.koordinasiPBOD} label="PBOD" />
          <Checkbox checked={data.koordinasiPCD} label="PCD" />
          <Checkbox checked={data.koordinasiPUD} label="PUD" />
          <Checkbox
            checked={data.koordinasiOthers}
            label={`Others${data.koordinasiOthers && data.koordinasiOthersText ? ' : ' + data.koordinasiOthersText : ''}`}
          />
        </div>
      </div>

      {/* Informasi Tambahan */}
      <div style={{ border, padding: '3px 6px' }}>
        <div style={{ fontSize: '8px', fontWeight: 700, marginBottom: '3px' }}>Informasi Tambahan :</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {([
            ['c1', 'Ada rekam jejak di masa lalu (tidak ada komplain)'],
            ['c2', 'Terbukti dalam durability test dan pengujian lainnya'],
            ['c3', 'Hasil pembongkaran: Tidak ada perubahan'],
            ['c4', 'Operasi T/T ± 2/3 putaran: Tidak masalah'],
            ['c5', 'Tidak ada masalah dalam hal fungsi dan struktur'],
            ['c6', 'Tidak ada dampak pada kendaraan / mobil'],
          ] as const).map(([field, label], i) => (
            <div key={field} style={{ display: 'flex', alignItems: 'flex-start', gap: '3px', fontSize: '8px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '9px',
                  height: '9px',
                  border: '1px solid black',
                  fontSize: '7px',
                  backgroundColor: data[field] ? '#222' : 'transparent',
                  color: 'white',
                  flexShrink: 0,
                  marginTop: '1px',
                }}
              >
                {data[field] ? '✓' : ''}
              </span>
              <span>{i + 1}. {label}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '3px', fontSize: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '9px',
                height: '9px',
                border: '1px solid black',
                fontSize: '7px',
                backgroundColor: data.c7 ? '#222' : 'transparent',
                color: 'white',
                flexShrink: 0,
                marginTop: '1px',
              }}
            >
              {data.c7 ? '✓' : ''}
            </span>
            <span>7. Lain-lain {data.c7 && data.c7Text ? `(${data.c7Text})` : '(...)'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
