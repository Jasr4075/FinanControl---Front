// src/molecules/CartaoCreditoCard.tsx
import { useEffect, useState, useCallback, useRef } from "react";
import {
  Text,
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Card from "../atoms/Card";
import api from "../../utils/api";

// ================= Tipos =================
type CartaoResumo = {
  id: string;
  nome: string;
  type: string;
  creditLimit: number;
  creditUsed: number;
  available: number;
  percentUsed: number;
  conta?: { conta: string; bancoNome: string; agencia: string };
};

type ParcelaApi = {
  id: string;
  numeroParcela: number;
  valor: number | string;
  dataVencimento: string;
  paga: boolean;
  dataPagamento: string | null;
  despesa: {
    id: string;
    descricao: string;
    valor: number | string;
    metodoPagamento: string;
    data: string;
  };
};

type FaturaDetalhe = {
  fatura: {
    id: string;
    cartaoId: string;
    mes: number;
    ano: number;
    valorTotal: number | string;
    valorPago: number | string;
    paga: boolean;
    parcelas: ParcelaApi[];
  };
  resumo: { restante: number; percentPago: number };
};

// ================= Helpers =================
const currency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const pct = (n: number) => `${n.toFixed(1)}%`;
const key = (m: number, a: number) => `${a}-${m}`;

const colorPorPercent = (percent: number) => {
  // Limitar entre 0 y 100
  const p = Math.min(100, Math.max(0, percent));

  if (p < 50) {
    // De verde a amarillo
    const r = Math.round((p / 50) * 255); // 0 → 255
    const g = 196; // verde base
    const b = 80; // azul bajo
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // De amarillo a rojo
    const r = 255;
    const g = Math.round(196 - ((p - 50) / 50) * 196); // 196 → 0
    const b = Math.round(80 - ((p - 50) / 50) * 80); // 80 → 0
    return `rgb(${r}, ${g}, ${b})`;
  }
};


export default function CartaoCreditoCard({ cartaoId }: { cartaoId: string }) {
  const [resumo, setResumo] = useState<CartaoResumo | null>(null);
  const [detalhe, setDetalhe] = useState<FaturaDetalhe | null>(null);
  const [mes, setMes] = useState<number | null>(null);
  const [ano, setAno] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingResumo, setLoadingResumo] = useState(false);
  const [loadingFatura, setLoadingFatura] = useState(false);
  const cache = useRef<Map<string, FaturaDetalhe>>(new Map());

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingResumo(true);
      try {
        const r = await api.get(`/cartoes/${cartaoId}/resumo`);
        if (mounted) setResumo(normalizeResumo(r.data.data));
      } catch (e) {
        console.error("Resumo cartão erro", e);
      } finally {
        mounted = false;
        setLoadingResumo(false);
      }
    })();
  }, [cartaoId]);

  const normalizeResumo = (d: any): CartaoResumo => ({
    ...d,
    creditLimit: Number(d.creditLimit),
    creditUsed: Number(d.creditUsed),
    available: Number(d.available),
    percentUsed: Number(d.percentUsed),
  });

  const normalizeDetalhe = (det: FaturaDetalhe): FaturaDetalhe => ({
    fatura: {
      ...det.fatura,
      valorTotal: Number(det.fatura.valorTotal),
      valorPago: Number(det.fatura.valorPago),
      parcelas: det.fatura.parcelas.map((p) => ({
        ...p,
        valor: Number(p.valor),
        despesa: { ...p.despesa, valor: Number(p.despesa.valor) },
      })),
    },
    resumo: {
      restante: Number(det.resumo.restante),
      percentPago: Number(det.resumo.percentPago),
    },
  });

  const fetchFaturaAtual = useCallback(async () => {
    setLoadingFatura(true);
    try {
      const r = await api.get(`/faturas/cartao/${cartaoId}/atual`);
      const det = normalizeDetalhe(r.data.data);
      cache.current.set(key(det.fatura.mes, det.fatura.ano), det);
      setDetalhe(det);
      setMes(det.fatura.mes);
      setAno(det.fatura.ano);
    } catch (e) {
      console.error("Fatura atual erro", e);
    } finally {
      setLoadingFatura(false);
    }
  }, [cartaoId]);

  const fetchFaturaMes = useCallback(
    async (m: number, a: number) => {
      if (m < 1) {
        m = 12;
        a -= 1;
      }
      if (m > 12) {
        m = 1;
        a += 1;
      }
      const k = key(m, a);
      if (cache.current.has(k)) {
        const det = cache.current.get(k)!;
        setDetalhe(det);
        setMes(m);
        setAno(a);
        return;
      }
      setLoadingFatura(true);
      try {
        const r = await api.get(
          `/faturas/cartao/${cartaoId}/mes?mes=${m}&ano=${a}`
        );
        const det = normalizeDetalhe(r.data.data);
        cache.current.set(k, det);
        setDetalhe(det);
        setMes(m);
        setAno(a);
      } catch (e) {
        console.error("Fatura mês erro", e);
      } finally {
        setLoadingFatura(false);
      }
    },
    [cartaoId]
  );

  const abrirModal = () => {
    setModalVisible(true);
    if (!detalhe) fetchFaturaAtual();
  };

  const navegar = (dir: -1 | 1) => {
    if (mes == null || ano == null) return;
    fetchFaturaMes(mes + dir, ano);
  };

  if (loadingResumo && !resumo) {
    return (
      <Card style={styles.card}>
        <ActivityIndicator />
      </Card>
    );
  }
  if (!resumo) return null;

  const percentUsed = resumo.percentUsed || 0;
  const progressFraction = Math.min(100, percentUsed) / 100;

  return (
    <>
      <Card style={styles.card}>
        <Text style={styles.title}>{resumo.nome}</Text>
        {resumo.conta && (
          <Text style={styles.sub}>
            {resumo.conta.conta} - {resumo.conta.bancoNome}
          </Text>
        )}

        <View style={styles.progressOuter}>
          <View
            style={[
              styles.progressInner,
              {
                flex: progressFraction,
                backgroundColor: colorPorPercent(percentUsed),
              },
            ]}
          >
            <Text style={styles.progressLabel}>{pct(percentUsed)}</Text>
          </View>
          <View style={{ flex: 1 - progressFraction }} />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.disponivel}>
            Disponível: {currency(resumo.available)}
          </Text>
          <Text style={styles.usado}>Usado: {currency(resumo.creditUsed)}</Text>
        </View>
        <Text style={styles.limite}>
          Limite: {currency(resumo.creditLimit)}
        </Text>

        <TouchableOpacity onPress={abrirModal} style={styles.detalhesBtn}>
          <Text style={styles.detalhesText}>Ver fatura atual</Text>
        </TouchableOpacity>
      </Card>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {loadingFatura && !detalhe && (
              <ActivityIndicator size="large" color="#4a90e2" />
            )}
            {detalhe && (
              <>
                <Text style={styles.modalTitle}>
                  Fatura {mes}/{ano}
                </Text>
                <Text style={styles.resumo}>
                  Total: {currency(Number(detalhe.fatura.valorTotal))} | Pago:{" "}
                  {currency(Number(detalhe.fatura.valorPago))} | Restante:{" "}
                  {currency(detalhe.resumo.restante)} (
                  {pct(detalhe.resumo.percentPago)})
                </Text>

                <FlatList
                  data={detalhe.fatura.parcelas}
                  keyExtractor={(p) => p.id}
                  style={{ maxHeight: 300, marginBottom: 12 }}
                  ListEmptyComponent={
                    <Text style={{ textAlign: "center", color: "#666" }}>
                      Sem parcelas
                    </Text>
                  }
                  renderItem={({ item }) => (
                    <View style={styles.detalheItem}>
                      <Text style={styles.detalheDescricao}>
                        {item.numeroParcela}. {item.despesa.descricao}
                      </Text>
                      <Text style={styles.detalheValor}>
                        {currency(Number(item.valor))}
                      </Text>
                    </View>
                  )}
                />

                <View style={styles.navBtns}>
                  <TouchableOpacity
                    style={styles.navBtn}
                    onPress={() => navegar(-1)}
                  >
                    <Text style={styles.navText}>{"<"} Anterior</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.navBtn}
                    onPress={() => navegar(1)}
                  >
                    <Text style={styles.navText}>Próxima {">"}</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.fecharBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Fechar
                  </Text>
                </TouchableOpacity>
              </>
            )}
            {!loadingFatura && !detalhe && (
              <Text style={{ textAlign: "center", color: "#555" }}>
                Nenhuma fatura disponível
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: "48%",
    margin: "1%",
    minWidth: 160,
    flexGrow: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  title: { fontSize: 16, fontWeight: "600", color: "#222", marginBottom: 4 },
  sub: { fontSize: 12, color: "#888", marginBottom: 12 },
  progressOuter: {
    flexDirection: "row",
    height: 24,
    backgroundColor: "#eee",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressInner: {
    backgroundColor: "#4a90e2",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  progressLabel: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
    paddingHorizontal: 6,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  limite: { fontSize: 14, color: "#555" },
  usado: { fontSize: 14, color: "#ff6b6b" },
  disponivel: { fontSize: 14, color: "#4caf50" },
  detalhesBtn: {
    marginTop: 10,
    borderRadius: 12,
    paddingVertical: 10,
    backgroundColor: "#4a90e2",
    alignItems: "center",
  },
  detalhesText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    maxHeight: "85%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  resumo: {
    fontSize: 14,
    marginBottom: 12,
    color: "#555",
    textAlign: "center",
  },
  detalheItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 0.3,
    borderBottomColor: "#ddd",
  },
  detalheDescricao: { fontSize: 14, color: "#333" },
  detalheValor: { fontSize: 14, fontWeight: "600", color: "#222" },
  navBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  navBtn: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 12,
    alignItems: "center",
  },
  navText: { fontWeight: "600", color: "#4a90e2" },
  fecharBtn: {
    marginTop: 16,
    backgroundColor: "#4a90e2",
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
  },
});
