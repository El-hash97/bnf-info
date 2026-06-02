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
