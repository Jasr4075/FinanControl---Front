import { useState, useEffect } from 'react'
import api from '@/src/utils/api'
import { Alert } from 'react-native'

interface TotaisMes {
  atual: number
  anterior: number
}

export function useTotaisReceitas(userId: string) : TotaisMes {
  const [state, setState] = useState<TotaisMes>({ atual: 0, anterior: 0 })
  useEffect(() => {
    if (!userId) return
    const now = new Date()
    const anoAtual = now.getFullYear()
    const mesAtual = now.getMonth() + 1 // 1-12
    const mesAnterior = mesAtual === 1 ? 12 : mesAtual - 1
    const anoAnterior = mesAtual === 1 ? anoAtual - 1 : anoAtual

    let cancel = false
    const load = async () => {
      try {
        const [atualResp, anteriorResp] = await Promise.all([
          api.get(`/receitas/total-mes/${userId}`),
          api.get(`/receitas/total-mes/${userId}?ano=${anoAnterior}&mes=${mesAnterior}`)
        ])
        if (!cancel) setState({
          atual: atualResp.data?.total || 0,
            anterior: anteriorResp.data?.total || 0,
        })
      } catch (e) {
        console.error(e)
        if (!cancel) Alert.alert('Erro', 'Falha ao carregar totais de receitas.')
      }
    }
    load()
    return () => { cancel = true }
  }, [userId])
  return state
}

export function useTotaisDespesas(userId: string) : TotaisMes {
  const [state, setState] = useState<TotaisMes>({ atual: 0, anterior: 0 })
  useEffect(() => {
    if (!userId) return
    const now = new Date()
    const anoAtual = now.getFullYear()
    const mesAtual = now.getMonth() + 1
    const mesAnterior = mesAtual === 1 ? 12 : mesAtual - 1
    const anoAnterior = mesAtual === 1 ? anoAtual - 1 : anoAtual
    let cancel = false
    const load = async () => {
      try {
        const [atualResp, anteriorResp] = await Promise.all([
          api.get(`/despesas/total-mes/${userId}`),
          api.get(`/despesas/total-mes/${userId}?ano=${anoAnterior}&mes=${mesAnterior}`)
        ])
        if (!cancel) setState({
          atual: atualResp.data?.total || 0,
          anterior: anteriorResp.data?.total || 0,
        })
      } catch (e) {
        console.error(e)
        if (!cancel) Alert.alert('Erro', 'Falha ao carregar totais de despesas.')
      }
    }
    load()
    return () => { cancel = true }
  }, [userId])
  return state
}
