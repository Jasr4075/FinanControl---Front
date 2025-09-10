import { Modal, View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";

type Detalhe = {
    id: string;
    descricao: string;
    valor: number;
    data?: string;
};

type Props = {
    visible: boolean;
    onClose: () => void;
    titulo: string;
    detalhes: Detalhe[];
};

export default function DetalhesModal({ visible, onClose, titulo, detalhes }: Props) {
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.titulo}>{titulo}</Text>

                    <FlatList
                        data={detalhes}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.item}>
                                <View style={styles.descricaoContainer}>
                                    <Text style={styles.data}>{item.data ?? "Sem data"}</Text>
                                    <Text style={styles.descricao}>{item.descricao}</Text>
                                </View>
                                <Text style={styles.valor}>R$ {item.valor.toFixed(2)}</Text>
                            </View>
                        )}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>Nenhum item registrado</Text>
                        }
                        contentContainerStyle={detalhes.length === 0 && { flexGrow: 1, justifyContent: 'center' }}
                    />

                    <TouchableOpacity style={styles.botao} onPress={onClose}>
                        <Text style={styles.botaoTexto}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 20,
        width: "90%",
        maxHeight: "80%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
    },
    titulo: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#333",
    },
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: "#f9f9f9",
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    descricaoContainer: {
        flex: 1,
        marginRight: 10,
    },
    data: {
        fontSize: 12,
        color: "#888",
        marginBottom: 2,
    },
    descricao: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
    },
    valor: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#4a90e2",
    },
    emptyText: {
        textAlign: "center",
        color: "#666",
        fontSize: 16,
    },
    botao: {
        marginTop: 15,
        backgroundColor: "#4a90e2",
        paddingVertical: 12,
        borderRadius: 8,
    },
    botaoTexto: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16,
    },
});
