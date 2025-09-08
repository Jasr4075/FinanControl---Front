// src/utils/formatCurrency.ts

/**
 * Formata uma string numérica para o padrão brasileiro (milhar com ponto e decimal com vírgula)
 * Ex: "123456" => "1.234,56"
 */
export const formatCurrency = (text: string): string => {
    if (!text) return "";
    const numericValue = text.replace(/\D/g, "");
    const floatValue = (parseInt(numericValue, 10) / 100).toFixed(2);
  
    return floatValue
      .replace(".", ",")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  
  /**
   * Converte string formatada no padrão brasileiro para número (ponto decimal)
   * Ex: "1.234,56" => 1234.56
   */
  export const parseCurrencyToNumber = (text: string): number => {
    if (!text) return 0;
    return parseFloat(text.replace(/\./g, "").replace(",", "."));
  };
  