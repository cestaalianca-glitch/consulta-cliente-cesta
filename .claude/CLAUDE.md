# consulta-cliente-cesta — Consulta de Cliente dos vendedores (repositório PÚBLICO, GitHub Pages)

Responder sempre em português. Este repositório é **público** e a branch `main` vai direto para o ar: nunca colocar dado de cliente (nome, CPF, telefone, endereço, dívida), senha, token ou chave de serviço em nenhum arquivo. A chave pública do Supabase em `config.js` é pública por desenho: quem lê a tabela é decidido pelo RLS, depois do login. **Arquivo de dados de cliente nunca entra aqui**: a tela lê do banco.

Este manual fica em `.claude/` de propósito: na raiz ele seria publicado junto com a página.

## Para quem é
O vendedor, na rua, no celular Android, muitas vezes sem internet. Ele digita CPF, nome ou endereço e vê se o cliente deve ou não deve, a última compra, quantas compras fez e a qualidade de pagamento. Precisa abrir sem rede e não pode errar: cliente que deve aparecendo como "não deve" faz a empresa perder dinheiro.

## Mapa: o que mora onde

| Assunto | Arquivo |
|---|---|
| A tela inteira (busca, cartão do cliente, botão Atualizar) | `index.html` |
| Login | `login-gate.js`, `config.js` (chaves públicas) |
| Funcionar sem internet | `sw.js`, `manifest-consulta.json`, ícones |
| Esteiras e governança | `.github/workflows/esteira.yml`, `.github/workflows/saude.yml`, `.github/ci/` |

De onde vem o dado: tabela `consulta_clientes` no Supabase, alimentada pelo repositório privado do ecossistema (`scripts/build_consulta_cliente.js`; rotina de toda noite, botão Atualizar e conferência diária contra o sistema de gestão). Número errado na tela quase sempre se conserta lá, não aqui.

## Economia de tokens (vale para toda sessão)
- Não reler o repositório: o mapa acima diz o arquivo. `index.html` tem mais de 500 linhas: procurar o trecho com `grep -n` e ler só a faixa.
- Para saber o que mudou: `git log --oneline -10`, depois `git diff main...HEAD --stat` e só então o diff do arquivo que interessa.
- Uma tarefa, uma branch curta (`feat/...` ou `fix/...`) saída da `main` atualizada. Depois do merge, a limpeza semanal apaga a branch.
- Estado do repositório em um comando: `node .github/ci/saude-repo.js`.
- Pendências e ideias ficam nas Issues do repositório privado do ecossistema, não em arquivo.

## Esteiras do GitHub
- **`esteira.yml`**, em todo push e todo pull request: trava da linha pública (`.github/ci/conferir-publico.js`), sintaxe de todo `.js` e de todo script embutido na página, versão limpa e **prévia baixável** (artefato `previa-consulta-<commit>`, 14 dias).
- **Publicação**: não passa pela esteira. O GitHub Pages publica sozinho o que entra na `main`. Por isso: nunca trabalhar direto na `main`.
- **`saude.yml`**, toda segunda-feira: audita branches, esteiras e se a página está no ar; apaga as branches já incorporadas e paradas há mais de 7 dias.
- **Ganchos locais** (ligar uma vez por computador: `node .github/ci/instalar-ganchos.js`): a mesma trava roda antes de cada commit e de cada envio.
- Mudou algo que o celular guarda para funcionar sem rede: subir a versão em `sw.js`, senão o vendedor continua vendo a tela antiga.

## Fluxo para mudar a tela
1. Criar uma branch `feat/...` a partir da `main` atualizada.
2. Prévia local: `npx --yes http-server -p 8080 -c-1 .` e abrir `http://localhost:8080/`.
3. Enviar a branch: a esteira confere e guarda a prévia (aba Actions).
4. Abrir um pull request para a `main`, com a esteira verde. O Gestor confere a prévia no celular e aprova. Só o merge publica.
