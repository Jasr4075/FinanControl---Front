import { useState } from "react";
import { Text, TouchableOpacity, View, Modal } from "react-native";
import Card from "../atoms/Card";
import ContaItem from "../molecules/ContaItem";
import { Plus } from "lucide-react-native";
import CreateContaForm from "../organisms/CreateContaForm";

interface Conta {
  id: string;
  nome: string;
  saldo: number;
}

export default function ContasList({ contas }: { contas: Conta[] }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <Card>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>
          Saldos por Conta
        </Text>

        <TouchableOpacity onPress={() => setShowForm(true)}>
          <Plus size={24} color="black" />
        </TouchableOpacity>
      </View>

      {contas.map((c) => (
        <ContaItem key={c.id} nome={c.nome} saldo={c.saldo} />
      ))}

      <Modal visible={showForm} animationType="slide">
        <CreateContaForm onClose={() => setShowForm(false)} />
      </Modal>
    </Card>
  );
}
