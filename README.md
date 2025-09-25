# 📱 FinanControl - Frontend Mobile

Aplicativo móvel React Native para sistema de controle financeiro pessoal, desenvolvido com Expo e TypeScript. Interface intuitiva e moderna para gestão completa das finanças pessoais.

## 🎯 Objetivo

Desenvolver uma aplicação móvel multiplataforma (iOS/Android) que ofereça uma experiência de usuário excepcional para controle financeiro pessoal, conectando-se à API backend para fornecer funcionalidades completas de gestão de receitas, despesas, metas e relatórios financeiros.

## 🚀 Stack Tecnológico

- **React Native** + **Expo SDK 51**
- **TypeScript** (Tipagem estática)
- **Expo Router** (Navegação file-based)
- **React Hook Form** (Formulários)
- **Zod** (Validação)
- **Zustand** (Gerenciamento de estado)
- **React Query** (Cache e sync de dados)
- **NativeWind** (Styling com Tailwind CSS)
- **Expo Notifications** (Push notifications)
- **Expo SecureStore** (Armazenamento seguro)
- **React Native Charts** (Gráficos e visualizações)

## 📁 Estrutura do Projeto

```
📦 FinanControl---Front/                   # Frontend Mobile
├─ 📄 app.json                             # Configuração Expo
├─ 📄 eas.json                             # Build configurations
├─ 📄 package.json                         # Dependências e scripts
├─ 📄 tsconfig.json                        # Configuração TypeScript
├─ 📄 expo-env.d.ts                        # Types do Expo
│
├─ 📁 app/                                 # File-based routing (Expo Router)
│  ├─ 🔐 _layout.tsx                       # Layout raiz da aplicação
│  ├─ 🏠 index.tsx                         # Tela inicial/splash
│  │
│  ├─ 🔐 (auth)/                           # Grupo de autenticação
│  │  ├─ _layout.tsx                       # Layout das telas de auth
│  │  ├─ login.tsx                         # Tela de login
│  │  ├─ register.tsx                      # Tela de cadastro
│  │  ├─ forgot-password.tsx               # Recuperar senha
│  │  └─ welcome.tsx                       # Tela de boas-vindas
│  │
│  └─ 📊 (dashboard)/                      # Grupo principal do app
│     ├─ _layout.tsx                       # Layout com tab navigation
│     ├─ index.tsx                         # Dashboard principal
│     ├─ transactions.tsx                  # Lista de transações
│     ├─ accounts.tsx                      # Contas e cartões
│     ├─ categories.tsx                    # Gestão de categorias
│     ├─ goals.tsx                         # Metas financeiras
│     ├─ reports.tsx                       # Relatórios e gráficos
│     ├─ notifications.tsx                 # Central de notificações
│     └─ profile.tsx                       # Perfil e configurações
│
├─ 📁 assets/                              # Recursos estáticos
│  ├─ 📁 fonts/                            # Fontes customizadas
│  └─ 📁 images/                           # Imagens e ícones
│
└─ 📁 src/                                 # Código fonte
   ├─ 📁 components/                       # Componentes reutilizáveis
   │  ├─ 🧱 atoms/                         # Atomic Design - Átomos
   │  │  ├─ Button.tsx                     # Botões
   │  │  ├─ Input.tsx                      # Inputs
   │  │  ├─ Text.tsx                       # Textos
   │  │  ├─ Icon.tsx                       # Ícones
   │  │  └─ Avatar.tsx                     # Avatares
   │  │
   │  ├─ 🧩 molecules/                     # Atomic Design - Moléculas
   │  │  ├─ FormField.tsx                  # Campo de formulário
   │  │  ├─ Card.tsx                       # Cards de conteúdo
   │  │  ├─ Modal.tsx                      # Modais
   │  │  ├─ DatePicker.tsx                 # Seletor de data
   │  │  └─ AmountInput.tsx                # Input de valores
   │  │
   │  ├─ 🏗️ organisms/                     # Atomic Design - Organismos
   │  │  ├─ TransactionForm.tsx            # Formulário de transação
   │  │  ├─ AccountCard.tsx                # Card de conta
   │  │  ├─ ExpenseChart.tsx               # Gráfico de gastos
   │  │  ├─ GoalProgress.tsx               # Progresso de metas
   │  │  └─ NotificationList.tsx           # Lista de notificações
   │  │
   │  └─ 📄 templates/                     # Atomic Design - Templates
   │     ├─ DashboardTemplate.tsx          # Template do dashboard
   │     ├─ FormTemplate.tsx               # Template de formulários
   │     └─ ListTemplate.tsx               # Template de listas
   │
   ├─ 📁 constants/                        # Constantes da aplicação
   │  ├─ Colors.ts                         # Paleta de cores
   │  ├─ Layout.ts                         # Constantes de layout
   │  ├─ Config.ts                         # Configurações
   │  └─ Categories.ts                     # Categorias padrão
   │
   ├─ 📁 context/                          # Context providers
   │  ├─ AuthContext.tsx                   # Contexto de autenticação
   │  ├─ ThemeContext.tsx                  # Contexto de tema
   │  └─ NotificationContext.tsx           # Contexto de notificações
   │
   ├─ 📁 features/                         # Features organizadas por domínio
   │  ├─ 🔐 auth/                          # Funcionalidades de autenticação
   │  │  ├─ components/                    # Componentes específicos
   │  │  ├─ hooks/                         # Hooks customizados
   │  │  ├─ services/                      # Serviços de API
   │  │  └─ types/                         # Types específicos
   │  │
   │  ├─ 💰 transactions/                  # Gestão de transações
   │  │  ├─ components/                    # Lista, forms, etc.
   │  │  ├─ hooks/                         # useTransactions, etc.
   │  │  ├─ services/                      # API calls
   │  │  └─ types/                         # Transaction types
   │  │
   │  ├─ 🏦 accounts/                      # Contas e cartões
   │  │  ├─ components/                    # Cards de conta, etc.
   │  │  ├─ hooks/                         # useAccounts, etc.
   │  │  ├─ services/                      # API de contas
   │  │  └─ types/                         # Account types
   │  │
   │  ├─ 🎯 goals/                         # Metas financeiras
   │  │  ├─ components/                    # Progress, forms, etc.
   │  │  ├─ hooks/                         # useGoals, etc.
   │  │  ├─ services/                      # API de metas
   │  │  └─ types/                         # Goal types
   │  │
   │  └─ 📊 reports/                       # Relatórios e análises
   │     ├─ components/                    # Gráficos, tabelas, etc.
   │     ├─ hooks/                         # useReports, etc.
   │     ├─ services/                      # API de relatórios
   │     └─ types/                         # Report types
   │
   ├─ 📁 hooks/                            # Hooks globais reutilizáveis
   │  ├─ useAPI.ts                         # Hook de API
   │  ├─ useStorage.ts                     # Armazenamento local
   │  ├─ useNotifications.ts               # Push notifications
   │  ├─ useTheme.ts                       # Gerenciamento de tema
   │  └─ useKeyboard.ts                    # Gerenciamento do teclado
   │
   ├─ 📁 types/                            # Types globais do TypeScript
   │  ├─ api.ts                            # Types da API
   │  ├─ navigation.ts                     # Types de navegação
   │  ├─ common.ts                         # Types comuns
   │  └─ env.ts                            # Types de ambiente
   │
   └─ 📁 utils/                            # Utilitários e helpers
      ├─ api.ts                            # Configuração da API
      ├─ storage.ts                        # Helpers de armazenamento
      ├─ formatters.ts                     # Formatação de dados
      ├─ validators.ts                     # Validações customizadas
      ├─ constants.ts                      # Constantes globais
      └─ helpers.ts                        # Funções auxiliares
```

## 🎨 Design System e UI/UX

### 🎯 Princípios de Design
- **Minimalismo**: Interface limpa e focada no essencial
- **Acessibilidade**: Suporte completo a leitores de tela e navegação por teclado
- **Consistência**: Componentes padronizados seguindo Atomic Design
- **Responsividade**: Adaptação perfeita a diferentes tamanhos de tela
- **Performance**: Carregamento rápido e animações fluidas

### 🎨 Paleta de Cores
```typescript
const colors = {
  primary: {
    50: '#F0F9FF',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    900: '#1E3A8A'
  },
  success: {
    500: '#10B981',
    600: '#059669'
  },
  error: {
    500: '#EF4444',
    600: '#DC2626'
  },
  warning: {
    500: '#F59E0B',
    600: '#D97706'
  },
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    500: '#6B7280',
    700: '#374151',
    900: '#111827'
  }
}
```

### 📱 Componentes Principais
- **Atomic Design**: Arquitetura escalável de componentes
- **Theme Provider**: Suporte a tema claro e escuro
- **Gesture Handlers**: Interações gestuais nativas
- **Haptic Feedback**: Feedback tátil para ações importantes
- **Loading States**: Estados de carregamento consistentes
- **Error Boundaries**: Tratamento elegante de erros

## ⭐ Funcionalidades Principais

### 🔐 Autenticação e Onboarding
- **Login/Registro**: Interface intuitiva com validação em tempo real
- **Biometria**: Login com Face ID/Touch ID/Impressão digital
- **Onboarding**: Tutorial interativo para novos usuários
- **Recuperação de senha**: Fluxo completo de reset via email
- **Configuração inicial**: Setup de contas, cartões e categorias

### 📊 Dashboard Principal
- **Visão Geral**: Cards com saldos, receitas e despesas do mês
- **Gráficos Interativos**: Visualização de gastos por categoria
- **Transações Recentes**: Lista das últimas movimentações
- **Valor Disponível**: Cálculo dinâmico do que pode ser gasto
- **Metas Progress**: Acompanhamento visual das metas de economia

### 💰 Gestão de Transações
- **Registro Rápido**: Interface simplificada para gastos/receitas
- **Categorização**: Sistema completo de categorias personalizáveis
- **Parcelamento**: Suporte completo a compras parceladas
- **Anexos**: Captura de fotos de comprovantes
- **Localização**: GPS opcional para transações
- **Busca e Filtros**: Sistema avançado de pesquisa

### 🏦 Contas e Cartões
- **Múltiplas Contas**: Gestão de várias contas bancárias
- **Cartões de Crédito**: Controle de limite e fatura
- **Transferências**: Movimentação entre contas próprias
- **Saldos em Tempo Real**: Atualização automática dos saldos
- **Histórico Detalhado**: Timeline completa de movimentações

### 🎯 Metas e Planejamento
- **Metas de Economia**: Definição e acompanhamento de objetivos
- **Orçamento por Categoria**: Controle de gastos por área
- **Alertas Inteligentes**: Notificações de proximidade de limites
- **Simulações**: Projeções futuras baseadas no histórico
- **Gamificação**: Sistema de conquistas e motivação

### 📈 Relatórios e Análises
- **Gráficos Dinâmicos**: Visualizações interativas dos dados
- **Comparativos**: Análise mensal, trimestral e anual
- **Exportação**: PDF/Excel para relatórios externos
- **Insights Automáticos**: Sugestões baseadas em padrões
- **Tendências**: Identificação de comportamentos financeiros

### 🔔 Notificações Inteligentes
- **Push Notifications**: Lembretes de vencimentos e limites
- **Notificações Contextuais**: Baseadas na localização e hora
- **Centro de Notificações**: Histórico completo de alertas
- **Configuração Granular**: Controle total sobre tipos de alerta
- **Smart Reminders**: Sugestões inteligentes de ações

## 🛠️ Requisitos Técnicos

### 📱 Compatibilidade
- **iOS**: Versão 11.0 ou superior
- **Android**: API Level 21 (Android 5.0) ou superior
- **Expo Go**: Para desenvolvimento e testes
- **EAS Build**: Para builds de produção

### 🔧 Dependências Principais
```json
{
  "@expo/vector-icons": "^14.0.0",
  "expo": "~51.0.0",
  "expo-router": "~3.5.0",
  "react": "18.2.0",
  "react-native": "0.74.0",
  "typescript": "~5.3.0",
  "zod": "^3.22.0",
  "@tanstack/react-query": "^5.0.0",
  "zustand": "^4.4.0",
  "react-hook-form": "^7.45.0",
  "nativewind": "^2.0.11"
}
```

## 🏗️ Arquitetura e Padrões

### 🧩 Atomic Design
```
📦 Componentes
├─ ⚛️ Atoms (Átomos)
│  ├─ Button, Input, Text, Icon
│  └─ Elementos básicos não decomponíveis
│
├─ 🧬 Molecules (Moléculas)  
│  ├─ FormField, Card, Modal
│  └─ Combinação simples de átomos
│
├─ 🦠 Organisms (Organismos)
│  ├─ Header, TransactionForm, Chart
│  └─ Grupos complexos de moléculas
│
├─ 📄 Templates
│  ├─ Page layouts, Grid systems
│  └─ Estruturas de página reutilizáveis
│
└─ 📱 Pages
   ├─ Dashboard, Login, Reports
   └─ Implementações específicas dos templates
```

### 🔄 Gerenciamento de Estado
- **Zustand**: Estado global da aplicação
- **React Query**: Cache e sincronização com API
- **Context API**: Estados específicos de componentes
- **AsyncStorage**: Persistência local de dados
- **SecureStore**: Armazenamento seguro de tokens

### 🌐 Comunicação com API
- **Axios**: Cliente HTTP configurado
- **Interceptors**: Tratamento automático de tokens
- **Error Handling**: Tratamento centralizado de erros
- **Retry Logic**: Reenvio automático em falhas de rede
- **Offline Queue**: Fila de requisições offline

## 🎨 UI/UX Design Guidelines

### 📱 Design Responsivo
- **Mobile First**: Design otimizado para mobile
- **Safe Areas**: Respeito às áreas seguras do device
- **Gesture Navigation**: Navegação por gestos intuitiva
- **Keyboard Handling**: Gerenciamento inteligente do teclado
- **Screen Orientation**: Suporte a portrait e landscape

### 🎯 Usabilidade
- **Loading States**: Feedback visual durante carregamento
- **Error States**: Mensagens de erro claras e acionáveis
- **Empty States**: Orientação quando não há dados
- **Progressive Disclosure**: Revelação progressiva de informações
- **Accessibility**: Conformidade com WCAG 2.1

### 🎨 Animações e Transições
- **Micro-interactions**: Feedback visual em ações
- **Page Transitions**: Transições fluidas entre telas
- **Loading Animations**: Indicadores de progresso elegantes
- **Gesture Feedback**: Resposta visual a interações
- **Performance Optimized**: Animações otimizadas a 60fps

## 🔒 Segurança e Privacidade

### 🛡️ Medidas de Segurança
- **Token Storage**: Armazenamento seguro de credenciais
- **Biometric Auth**: Autenticação biométrica nativa
- **SSL/TLS**: Comunicação criptografada com API
- **Code Obfuscation**: Ofuscação do código em produção
- **Root/Jailbreak Detection**: Detecção de dispositivos comprometidos

### 🔐 Privacidade de Dados
- **LGPD Compliance**: Conformidade com lei brasileira
- **Data Encryption**: Criptografia de dados sensíveis
- **Minimal Permissions**: Solicitação mínima de permissões
- **Analytics Opt-in**: Coleta de dados opcional
- **Data Retention**: Políticas claras de retenção

## 📊 Analytics e Monitoramento

### 📈 Métricas de Negócio
- **User Engagement**: Tempo de uso e frequência
- **Feature Usage**: Funcionalidades mais utilizadas
- **Conversion Funnel**: Acompanhamento do onboarding
- **Financial Health Score**: Indicador de saúde financeira
- **Goal Achievement**: Taxa de sucesso nas metas

### 🔧 Métricas Técnicas
- **App Performance**: Tempo de carregamento e crashes
- **API Performance**: Latência e taxa de erro
- **Device Analytics**: Distribuição de devices e OS
- **Network Analytics**: Uso de dados e conectividade
- **Error Tracking**: Monitoramento de erros em produção

## 🔄 Futuras Melhorias (Frontend)

### 📱 Funcionalidades Mobile Avançadas
- **Widget iOS/Android**: Widget na tela inicial para saldos
- **Shortcuts Siri**: Ações rápidas via comando de voz
- **Apple Watch App**: Companheiro para Apple Watch
- **Wear OS Support**: Suporte para smartwatches Android
- **CarPlay Integration**: Interface para uso no carro
- **Deep Linking**: URLs personalizadas para funcionalidades

### 🤖 Inteligência Artificial
- **Smart Categorization**: Categorização automática via ML
- **Expense Prediction**: Previsão de gastos futuros
- **Photo Recognition**: OCR para notas fiscais e recibos
- **Voice Commands**: Controle por comandos de voz
- **Chatbot Assistant**: Assistente conversacional
- **Behavioral Analysis**: Análise de padrões de gasto

### 🌐 Sincronização e Integração
- **Cloud Sync**: Sincronização multi-device
- **Bank Sync**: Integração automática com bancos
- **Export/Import**: Backup completo de dados
- **Third-party Apps**: Integração com outros apps financeiros
- **Social Features**: Compartilhamento de conquistas
- **Multi-user Support**: Contas familiares compartilhadas

### 🎨 UI/UX Avançado
- **Dark Mode**: Tema escuro completo
- **Custom Themes**: Temas personalizáveis
- **Accessibility++**: Recursos avançados de acessibilidade
- **Gesture Customization**: Gestos personalizáveis
- **Interactive Charts**: Gráficos mais interativos
- **Augmented Reality**: AR para captura de comprovantes

### 🔧 Performance e Tecnologia
- **React Native New Architecture**: Fabric + TurboModules
- **Hermes Engine**: Engine JavaScript otimizada
- **CodePush**: Updates over-the-air
- **Background Sync**: Sincronização em background
- **Offline-first**: Funcionalidade completa offline
- **Progressive Web App**: Versão PWA da aplicação


## 🚀 Instalação e Desenvolvimento

### 📋 Pré-requisitos
- **Node.js**: 18+ LTS
- **npm/yarn**: Gerenciador de pacotes
- **Expo CLI**: `npm install -g @expo/cli`
- **EAS CLI**: `npm install -g eas-cli`
- **Git**: Controle de versão

### ⚙️ Setup do Projeto
```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/financontrol.git
cd financontrol/FinanControl---Front

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas configurações

# 4. Inicie o servidor de desenvolvimento
npx expo start

# 5. Execute em dispositivo/emulador
# iOS: npx expo run:ios
# Android: npx expo run:android
# Web: npx expo start --web
```

### 📱 Desenvolvimento
```bash
# Desenvolvimento com hot reload
npx expo start --dev-client

# Limpar cache
npx expo start --clear

# Executar testes
npm run test

# Análise de bundle
npx expo export --analyze

# Build para produção
eas build --profile production --platform all
```

### 🔧 Scripts Disponíveis
```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo run:android", 
    "ios": "expo run:ios",
    "web": "expo start --web",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/ --ext .ts,.tsx",
    "type-check": "tsc --noEmit",
    "build:android": "eas build --platform android",
    "build:ios": "eas build --platform ios",
    "submit:stores": "eas submit --platform all"
  }
}
```

### 📋 Padrões de Código
- **TypeScript**: Tipagem estrita obrigatória
- **ESLint**: Configuração React Native/Expo
- **Prettier**: Formatação automática
- **Atomic Design**: Estrutura de componentes
- **Conventional Commits**: Padrão para mensagens

---

**Desenvolvido com ❤️ usando React Native, Expo e TypeScript**

**Licença**: MIT - Consulte LICENSE.md para detalhes