import { useState, useEffect } from 'react'
import api from '@/src/utils/api'
import { useAlert } from '@/src/context/AlertContext'

interface TotaisMes {
  atual: number
  anterior: number
}

export function useTotaisReceitas(userId: string) : TotaisMes {
  const [state, setState] = useState<TotaisMes>({ atual: 0, anterior: 0 })
  const alert = useAlert();
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
        let message = 'Falha ao carregar totais de receitas.';
        if (e instanceof Error) message += `\n${e.message}`;
  if (!cancel) alert.showAlert('Erro', message);
      }
    }
    load()
    return () => { cancel = true }
  }, [userId])
  return state
}

export function useTotaisDespesas(userId: string) : TotaisMes {
  const [state, setState] = useState<TotaisMes>({ atual: 0, anterior: 0 })
  const alert = useAlert();
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
        let message = 'Falha ao carregar totais de despesas.';
        if (e instanceof Error) message += `\n${e.message}`;
  if (!cancel) alert.showAlert('Erro', message);
      }
    }
    load()
    return () => { cancel = true }
  }, [userId])
  return state
}
