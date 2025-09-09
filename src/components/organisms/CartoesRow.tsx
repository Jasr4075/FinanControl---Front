// src/organisms/CartoesRow.tsx
import { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
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
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const screenW = Dimensions.get('window').width;
  // per-card animated values (must be a hook and declared unconditionally)
  const anims = useRef<Record<string, Animated.Value>>({});

  useEffect(() => {
    async function fetchCartoes() {
      try {
        const r = await api.get("/cartoes");
        const cartoesData = r.data.data;
        // Não buscar fatura aqui; CartaoCreditoCard fará o fetch e exibirá o badge
        setCartoes(cartoesData);
      } catch (err) {
        // Em produção, não exibir detalhes técnicos para o usuário
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

  function toggleCard(id: string) {
    setExpandedCards((s) => ({ ...s, [id]: !s[id] }));
    pressAnim(id);
    setTimeout(() => {
      if (!expandedCards[id]) {
        setExpandedCards((s) => ({ ...s, [id]: true }));
      }
    }, 200);
  }


  function pressAnim(id: string) {
    if (!anims.current[id]) anims.current[id] = new Animated.Value(1);
    Animated.sequence([
      Animated.timing(anims.current[id], { toValue: 0.97, duration: 100, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
      Animated.timing(anims.current[id], { toValue: 1, duration: 120, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
    ]).start();
  }

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {cardsVisiveis.map((cartao) => {
            const expanded = !!expandedCards[cartao.id];
            if (!anims.current[cartao.id]) anims.current[cartao.id] = new Animated.Value(1);
            const anim = anims.current[cartao.id];
            return (
              <Animated.View
                key={cartao.id}
                style={[styles.cardWrapper, { transform: [{ scale: anim }] }]}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => { toggleCard(cartao.id); pressAnim(cartao.id); }}
                  style={styles.touchArea}
                >
                  <View style={styles.cardInner}>
                    <CartaoCreditoCard cartaoId={cartao.id} showInlineDetails={expanded} />
                    <Text style={[styles.caret, expanded && styles.caretOpen]}>{'▾'}</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </ScrollView>
      </View>
      {cartoes.length > 1 && (
        <TouchableOpacity
          style={styles.toggleBtn}
          activeOpacity={0.8}
          onPress={() => setExpandido((e) => !e)}
        >
          <Text style={styles.toggleText}>{expandido ? 'Mostrar menos' : `Ver todos os cartões (${cartoes.length})`}</Text>
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  // legacy row kept for compatibility (not used by new layout)
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
    gap: 10,
  },
  container: {
    marginVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
  cardWrapper: {
    width: 260,
    marginRight: 12,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  touchArea: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  cardInner: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 14,
    minHeight: 140,
    position: 'relative',
    justifyContent: 'center',
  },
  caret: {
    position: 'absolute',
    top: 8,
    left: 12,
    fontSize: 14,
    color: '#666',
    transform: [{ rotate: '0deg' }],
  },
  caretOpen: {
    transform: [{ rotate: '180deg' }],
    color: '#004a99',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#0066cc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#eef5ff',
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4a90e2',
  },
  progressLabel: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  expandedBox: {
    marginTop: 10,
    backgroundColor: '#f7fbff',
    padding: 10,
    borderRadius: 8,
  },
  expandedText: {
    fontWeight: '700',
    color: '#004a99',
  },
  expandedSub: {
    color: '#333',
    marginTop: 6,
  },
  expandedHint: {
    marginTop: 6,
    fontSize: 12,
    color: '#666',
  },
  toggleBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#e6f0ff',
    marginBottom: 12,
    marginLeft: 12,
  },
  toggleText: {
    color: '#0066cc',
    fontWeight: '600'
  }
});
