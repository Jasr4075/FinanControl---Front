// src/organisms/CartoesRow.tsx
import { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import CartaoCreditoCard from "../molecules/CartaoCreditoCard";
import api from "../../utils/api";

type Cartao = {
  id: string;
  nome: string;
  conta: string;
  valorFaturaAtual?: number;
};

export default function CartoesRow({ refreshKey }: { refreshKey?: any } = {}) {
  const [cartoes, setCartoes] = useState<Cartao[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandido, setExpandido] = useState(false);

  useEffect(() => {
    async function fetchCartoes() {
      try {
        const r = await api.get("/cartoes");
        const cartoesData = r.data.data;
        // Para cada cartão, buscar o valor da fatura atual
        const cartoesComFatura = await Promise.all(
          cartoesData.map(async (cartao: any) => {
            try {
              const fat = await api.get(`/faturas/cartao/${cartao.id}/atual`);
              return { ...cartao, valorFaturaAtual: Number(fat.data.data?.fatura?.valorTotal) || 0 };
            } catch {
              return { ...cartao, valorFaturaAtual: 0 };
            }
          })
        );
        // Ordena decrescente pelo valor da fatura
        cartoesComFatura.sort((a, b) => (b.valorFaturaAtual || 0) - (a.valorFaturaAtual || 0));
        setCartoes(cartoesComFatura);
      } catch (err) {
        console.error("Erro ao buscar cartões:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCartoes();
  }, [refreshKey]);

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" />;
  }

  if (cartoes.length === 0) {
    return <Text style={{ textAlign: "center", color: "#666" }}>Nenhum cartão cadastrado</Text>;
  }

  const cardsVisiveis = expandido ? cartoes : cartoes.slice(0, 1);

  return (
    <>
      <View style={styles.row}>
        {cardsVisiveis.map((cartao) => (
          <CartaoCreditoCard key={cartao.id} cartaoId={cartao.id} />
        ))}
      </View>
      {cartoes.length > 1 && (
        <TouchableOpacity
          style={styles.toggleBtn}
          activeOpacity={0.7}
          onPress={() => setExpandido((e) => !e)}
        >
          <Text style={styles.toggleText}>
            {expandido ? 'Mostrar menos' : `Ver todos os cartões (${cartoes.length})`}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
    gap: 10,
  },
  toggleBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#e6f0ff',
    marginBottom: 12,
  },
  toggleText: {
    color: '#0066cc',
    fontWeight: '600'
  }
});
