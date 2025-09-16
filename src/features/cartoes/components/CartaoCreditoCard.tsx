import { useEffect, useState, useCallback, useRef } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Card from "../../../components/atoms/Card";
import api from "../../../utils/api";
import FaturaModal from "../../faturas/components/FaturaModal";
import { CartaoResumo } from "../types";
import { FaturaDetalhe } from "../../faturas/types";

const currency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const pct = (n: number) => `${n.toFixed(1)}%`;
const key = (m: number, a: number) => `${a}-${m}`;

const colorPorPercent = (percent: number) => {
  const p = Math.min(100, Math.max(0, percent));

  if (p < 50) {
    const r = Math.round((p / 50) * 255);
    const g = 196;
    const b = 80;
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    const r = 255;
    const g = Math.round(196 - ((p - 50) / 50) * 196);
    const b = Math.round(80 - ((p - 50) / 50) * 80);
    return `rgb(${r}, ${g}, ${b})`;
  }
};

export default function CartaoCreditoCard({
  cartaoId,
  showInlineDetails = false,
}: {
  cartaoId: string;
  showInlineDetails?: boolean;
}) {
  const [resumo, setResumo] = useState<CartaoResumo | null>(null);
  const [detalhe, setDetalhe] = useState<FaturaDetalhe | null>(null);
  const [valorFaturaAtual, setValorFaturaAtual] = useState<number | null>(null);
  const [mes, setMes] = useState<number | null>(null);
  const [ano, setAno] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingResumo, setLoadingResumo] = useState(false);
  const [loadingFatura, setLoadingFatura] = useState(false);
  const cache = useRef<Map<string, FaturaDetalhe>>(new Map());
  const fetchFaturaAtual = useCallback(async () => {
    if (cache.current.has("current")) {
      const det = cache.current.get("current")!;
      setDetalhe(det);
      setMes(det.fatura.mes);
      setAno(det.fatura.ano);
      setValorFaturaAtual(Number(det.fatura.valorTotal));
      return det;
    }
    setLoadingFatura(true);
    try {
      const r = await api.get(`/faturas/cartao/${cartaoId}/atual`);
      const det = normalizeDetalhe(r.data.data);
      cache.current.set(key(det.fatura.mes, det.fatura.ano), det);
      cache.current.set("current", det);
      setDetalhe(det);
      setMes(det.fatura.mes);
      setAno(det.fatura.ano);
      setValorFaturaAtual(Number(det.fatura.valorTotal));
      return det;
    } catch (e) {
      setValorFaturaAtual(0);
      return null;
    } finally {
      setLoadingFatura(false);
    }
  }, [cartaoId]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingResumo(true);
      try {
        const r = await api.get(`/cartoes/${cartaoId}/resumo`);
        if (mounted) setResumo(normalizeResumo(r.data.data));
      } catch (e) {
      } finally {
        mounted = false;
        setLoadingResumo(false);
      }
    })();
    (async () => {
      await fetchFaturaAtual();
    })();
  }, [cartaoId, fetchFaturaAtual]);

  const normalizeResumo = (d: any): CartaoResumo => ({
    ...d,
    creditLimit: Number(d.creditLimit),
    creditUsed: Number(d.creditUsed),
    available: Number(d.available),
    percentUsed: Number(d.percentUsed),
    conta: {
      ...d.conta,
      saldo: Number(d.conta?.saldo) || 0,
    }
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

  useEffect(() => {
    if (showInlineDetails && !detalhe) {
      fetchFaturaAtual();
    }
  }, [showInlineDetails, detalhe, fetchFaturaAtual]);

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
        {/* Badge con fatura atual */}
        {resumo.type !== "DEBITO" && valorFaturaAtual != null && (
          <View style={styles.smallBadge}>
            <Text style={styles.smallBadgeText}>
              {currency(valorFaturaAtual)}
            </Text>
          </View>
        )}

        {/* Cabecera */}
        <View style={styles.header}>
          <Text style={styles.title}>{resumo.nome}</Text>
          {resumo.conta && (
            <Text style={styles.sub}>
              {resumo.conta.conta} - {resumo.conta.bancoNome}
            </Text>
          )}
        </View>

        {/* Tarjeta de crédito: progreso visual */}
        {resumo.type !== "DEBITO" ? (
          <View>
            <View style={styles.progressOuter}>
              <View
                style={[
                  styles.progressInner,
                  {
                    flex: Math.min(100, resumo.percentUsed) / 100,
                    backgroundColor: colorPorPercent(resumo.percentUsed),
                  },
                ]}
              >
                <Text style={styles.progressLabel}>{pct(resumo.percentUsed)}</Text>
              </View>
              <View
                style={{ flex: 1 - Math.min(100, resumo.percentUsed) / 100 }}
              />
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.disponivel}>
                Disponível: {currency(resumo.available)}
              </Text>
              <Text style={styles.usado}>
                Usado: {currency(resumo.creditUsed)}
              </Text>
            </View>
            <Text style={styles.limite}>
              Limite Total: {currency(resumo.creditLimit)}
            </Text>

            <TouchableOpacity onPress={abrirModal} style={styles.detalhesBtn}>
              <Text style={styles.detalhesText}>Ver fatura atual</Text>
            </TouchableOpacity>

            {showInlineDetails && (
              <View style={styles.inlineBox}>
                {loadingFatura && !detalhe ? (
                  <ActivityIndicator size="small" color="#4a90e2" />
                ) : detalhe ? (
                  <>
                    <Text style={styles.inlineTitle}>
                      Fatura {detalhe.fatura.mes}/{detalhe.fatura.ano}
                    </Text>
                    <Text style={styles.inlineText}>
                      Total: {currency(Number(detalhe.fatura.valorTotal))}
                    </Text>
                    <Text style={styles.inlineText}>
                      Restante: {currency(detalhe.resumo.restante)}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.inlineText}>Nenhuma fatura</Text>
                )}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.infoRow}>
            <Text style={styles.disponivel}>
              Saldo: {currency(resumo.conta?.saldo ?? 0)}
            </Text>
          </View>
        )}
      </Card>


      <FaturaModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        detalhe={detalhe}
        loading={loadingFatura}
        mes={mes}
        ano={ano}
        navegar={navegar}
      />
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
  header: {
    marginBottom: 12,
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
    flexWrap: "wrap",
  },
  limite: { fontSize: 14, color: "#4a90e2" },
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

  smallBadge: {
    position: "absolute",
    top: 10,
    right: 12,
    backgroundColor: "#0066cc",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 5,
  },
  smallBadgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  thinProgressContainer: {
    height: 6,
    backgroundColor: "#eef5ff",
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 8,
  },
  thinProgressFill: {
    height: "100%",
  },
  inlineBox: {
    marginTop: 10,
    backgroundColor: "#f7fbff",
    padding: 8,
    borderRadius: 8,
  },
  inlineTitle: {
    fontWeight: "700",
    color: "#004a99",
  },
  inlineText: {
    color: "#333",
    fontSize: 13,
    marginTop: 4,
  },
});
