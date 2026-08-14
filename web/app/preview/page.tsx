'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BNFData, emptyBNFData } from '@/lib/types'
import { loadBNF } from '@/lib/storage'
import BNFPreview from '@/components/BNFPreview'

function PreviewContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [data, setData] = useState<BNFData>(emptyBNFData())

  useEffect(() => {
    const loaded = loadBNF()
    setData(loaded)
    if (searchParams.get('autoprint') === '1') {
      // Wait for render before triggering print
      setTimeout(() => window.print(), 600)
    }
  }, [searchParams])

  return (
    <>
      {/* Toolbar - hidden on print */}
      <div className="no-print fixed top-0 left-0 right-0 bg-gray-800 text-white px-4 py-2 z-50 shadow">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-gray-300 hover:text-white transition-colors whitespace-nowrap"
          >
            ← Kembali Edit
          </button>
          <span className="text-sm font-semibold truncate">Preview BNF</span>
          <button
            onClick={() => window.print()}
            className="bg-blue-500 text-white text-sm px-4 py-1.5 rounded hover:bg-blue-600 transition-colors font-semibold whitespace-nowrap"
          >
            Print / PDF
          </button>
        </div>
      </div>

      {/* Screen preview */}
      <div className="no-print pt-12 bg-gray-300 min-h-screen flex justify-center py-6 px-2 sm:px-4">
        <div className="shadow-2xl max-w-full overflow-x-auto">
          <BNFPreview data={data} />
        </div>
      </div>

      {/* Print-only output */}
      <div className="print-only">
        <BNFPreview data={data} />
      </div>
    </>
  )
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading preview...</div>}>
      <PreviewContent />
    </Suspense>
  )
}
