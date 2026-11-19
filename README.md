# GestorImoveis

O GestorImoveis é um sistema para quem administra imóveis de aluguel. Ele reúne em um só lugar os imóveis, os inquilinos, o financeiro e os documentos. No Dashboard aparece a situação do mês: aluguéis pagos, pendentes e atrasados, receitas, despesas e saldo. Também é possível:

- ver o histórico de contas de cada apartamento;
- registrar pagamentos e enviar lembretes de cobrança;
- consultar contratos, laudos e comprovantes em PDF;
- cadastrar novos imóveis, inquilinos e aluguéis.

Esta versão é uma demonstração com dados fictícios. Os fluxos funcionam na tela, mas nada é salvo.

## Frontend

O projeto é um site estático em **HTML, CSS e JavaScript puros**, sem frameworks, bibliotecas ou etapa de build. A única dependência externa é a fonte [Inter](https://fonts.google.com/specimen/Inter), do Google Fonts. Sem ela, o site usa a fonte do sistema.

### Como executar

Basta servir a pasta com qualquer servidor estático e abrir `login.html` ou `index.html`. Por exemplo:

```bash
python -m http.server 5500
```

Depois, acesse <http://localhost:5500/login.html>.

### Estrutura

```
├── login.html          Tela de entrada
├── index.html          Dashboard
├── imoveis.html        Imóveis (prédio, inquilinos e histórico de contas)
├── inquilinos.html     Inquilinos (cards paginados e registro de pagamento)
├── financeiro.html     Financeiro (resumo e transações paginadas)
├── documentos.html     Documentos (recentes, busca, lista e grade)
├── ajuda.html          Ajuda (atalhos e perguntas frequentes)
├── configuracoes.html  Configurações (perfil, notificações e segurança)
├── styles.css          Todo o estilo do site
└── assets/
    ├── js/             Um script por comportamento (ver abaixo)
    ├── icons/          Ícones em SVG
    ├── img/            Logo, mascote, fotos e ilustrações
    └── docs/           PDFs fictícios abertos pela página Documentos
```

### Layout responsivo

O layout se adapta à **largura disponível**, e não só à largura da janela:

- **Desktop:** barra lateral fixa à esquerda e conteúdo à direita.
- **Entre 860 e 450px:** a barra lateral e o logo encolhem aos poucos, até o limite em que os textos do menu ainda cabem inteiros.
- **Abaixo de 450px (celular):** a barra lateral vira uma barra de menu fixa no topo, com o botão "Menu", e os títulos ficam menores.
- **Container queries:** o conteúdo principal é um *container* (`container: main`), e cada bloco reorganiza o próprio layout conforme o espaço que tem. Por exemplo:
  - os cards "Situação dos aluguéis" e "Resumo financeiro" ficam lado a lado em telas largas;
  - o card do Prédio A e o documento em destaque escondem a foto ou a prévia antes de cortar texto;
  - a grade de inquilinos passa para uma coluna.

Os headers ficam presos no topo durante a rolagem. Em Imóveis e Documentos, o título da seção atual ("Prédio A", "Recentes", "Todos os documentos") também fica preso logo abaixo do header. A posição é medida por script e funciona inclusive com a barra de menu do celular.

### Padrões visuais

- **Cores e espaçamentos** ficam em variáveis CSS no `:root`: texto, cinzas, azul de destaque (`--primary`), margem lateral (`--gutter`) e largura da barra lateral (`--sidebar-w`).
- **Escala tipográfica:** 48px (título da página), 32px (título de seção), 24px (números grandes), 18px (subseções e modais), 15px (título dos cards), 14px (texto, botões e campos), 13px (links e tabela) e 12px (texto dos cards, rótulos e etiquetas). No celular, os títulos caem para 24 e 20px.
- **Cards:** fundo cinza (`#f2f2f2`), sem borda nem sombra. Nas listas horizontais, todos têm o mesmo tamanho fixo (200 × 300px). Dentro do cinza, elementos de destaque ficam brancos.
- **Etiquetas de status** usam as cores de sistema da Apple: vermelho para atrasado, laranja para pendente, verde para pago e azul para mais recente.
- **Listas horizontais** não mostram barra de rolagem. Com o mouse, elas deslizam sozinhas ao parar o cursor perto de uma das bordas, que ganham um esmaecimento suave.

### Scripts

Cada arquivo em `assets/js` cuida de um comportamento e só age se os elementos dele existirem na página:

| Arquivo | O que faz |
|---|---|
| `demo.js` | Base dos fluxos de demonstração: validação de formulários com mensagens em português, valores em reais e avisos (*toasts*) |
| `modal.js` | Abre e fecha os modais (`<dialog>`) pelos botões, por Esc ou por um clique fora |
| `nav.js` | Barra de menu do celular |
| `sticky-sections.js` | Títulos de seção presos abaixo do header |
| `edge-scroll.js` | Rolagem das listas horizontais ao parar o mouse perto das bordas |
| `pagination.js` | Paginação no próprio navegador (Inquilinos e Financeiro) |
| `dashboard.js` | Busca rápida do Dashboard e cadastro de novo aluguel |
| `imoveis.js` | Detalhes das contas, lembrete de cobrança e cadastro de imóvel |
| `inquilinos.js` | Detalhes do inquilino, registro de pagamento e cadastro de inquilino |
| `documentos.js` | Busca sem diferenciar acentos, alternância lista/grade e modo de busca |
| `faq.js` | Abertura animada das perguntas frequentes |
| `configuracoes.js` | Lembra o estado dos interruptores de notificação (troca de senha e verificação em duas etapas usam `demo.js`) |
| `login.js` | Entrada (aceita qualquer login), recuperação de senha e criação de conta |

Os dados ficam escritos no próprio HTML. Os scripts só leem e atualizam a tela, sem nenhuma requisição a servidor. Algumas preferências ficam no navegador: o modo lista/grade de Documentos e os interruptores de notificação, no `localStorage`, e um aviso de "acabou de entrar" para a animação do Dashboard, no `sessionStorage`.

### Animações

As animações são curtas, de 160 a 260ms, com a mesma curva de suavização:

- **Modais:** entrada e saída com fade e leve escala.
- **Menu do celular e resultados da busca:** deslizam ao aparecer e ao sumir.
- **Pagamento registrado:** a etiqueta de status pulsa ao mudar.
- **Listas:** paginação e filtros fazem os itens surgirem com fade.
- **Erros de validação:** as mensagens entram crescendo, em vez de empurrar o formulário de uma vez.
- **Login → Dashboard:** uma chuva de moedas e notas, com o mascote pulando no centro, antes de abrir o Dashboard.

Todas respeitam a preferência do sistema **"reduzir movimento"** (`prefers-reduced-motion`). Com ela ligada, a interface funciona sem animação.

### Acessibilidade

- HTML semântico: `header`, `main`, `nav`, `section`, `dialog`, `details` e listas de definição para dados.
- Rótulos e estados ARIA nos botões e campos: `aria-label`, `aria-pressed`, `aria-expanded`, `aria-current` e `aria-invalid`.
- Contorno de foco visível em todos os elementos interativos; tudo funciona pelo teclado.
- Mensagens de erro ligadas ao campo por `aria-describedby`, e avisos anunciados por leitores de tela (`role="status"`).
- Sem JavaScript, o conteúdo continua acessível: listas aparecem inteiras, as perguntas frequentes abrem e os links funcionam.
