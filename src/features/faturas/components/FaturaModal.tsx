import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
} from "react-native";
import { FaturaDetalhe } from "../types";

const currency = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const pct = (n: number) => `${n.toFixed(1)}%`;

type Props = {
    visible: boolean;
    onClose: () => void;
    detalhe: FaturaDetalhe | null;
    loading: boolean;
    mes: number | null;
    ano: number | null;
    navegar: (dir: -1 | 1) => void;
};

export default function FaturaModal({
    visible,
    onClose,
    detalhe,
    loading,
    mes,
    ano,
    navegar,
}: Props) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {loading && !detalhe && (
                        <ActivityIndicator size="large" color="#4a90e2" />
                    )}

                    {detalhe && (
                        <>
                            {/* Header */}
                            <View style={styles.headerBox}>
                                <Text style={styles.modalTitle}>
                                    Fatura {mes}/{ano}
                                </Text>
                                <Text style={styles.valorRestante}>
                                    {currency(Number(detalhe.resumo.restante))}
                                </Text>

                                <Text style={styles.valorLegenda}>Valor a pagar</Text>
                            </View>

                            {/* Resumo */}
                            <Text style={styles.resumo}>
                                Total: {currency(Number(detalhe.fatura.valorTotal))} | Pago:{" "}
                                {currency(Number(detalhe.fatura.valorPago))} | Restante:{" "}
                                {currency(detalhe.resumo.restante)} ({pct(detalhe.resumo.percentPago)})
                            </Text>


                            {/* Parcelas */}
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
                                        <View>
                                            <Text style={styles.detalheDescricao}>
                                                {item.numeroParcela}. {item.despesa.descricao}
                                            </Text>
                                            <Text style={styles.detalheData}>
                                                Venc: {item.dataVencimento}
                                            </Text>
                                        </View>
                                        <Text
                                            style={[
                                                styles.detalheValor,
                                                item.paga && { color: "#4caf50" },
                                            ]}
                                        >
                                            {currency(Number(item.valor))}
                                        </Text>
                                    </View>
                                )}
                            />

                            {/* Navegação */}
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

                            {/* Fechar */}
                            <TouchableOpacity style={styles.fecharBtn} onPress={onClose}>
                                <Text style={{ color: "#fff", fontWeight: "bold" }}>Fechar</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {!loading && !detalhe && (
                        <Text style={{ textAlign: "center", color: "#555" }}>
                            Nenhuma fatura disponível
                        </Text>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
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
    headerBox: {
        backgroundColor: "#f5f9ff",
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
        textAlign: "center",
    },
    valorRestante: {
        fontSize: 24,
        fontWeight: "700",
        color: "#e53935",
        marginTop: 4,
    },
    valorLegenda: {
        fontSize: 13,
        color: "#666",
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
    detalheData: {
        fontSize: 12,
        color: "#888",
    },
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
