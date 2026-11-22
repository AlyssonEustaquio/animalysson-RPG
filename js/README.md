# Estrutura do projeto

O projeto usa JavaScript estático para funcionar no GitHub Pages.

- `index.html`: entrada da aplicação e orquestração da interface.
- `*.js` na raiz: módulos herdados compatíveis, mantidos enquanto a migração é concluída.
- `js/`: novos módulos, utilitários e arquivos de inicialização.
- `mapas/`: imagens, metadados e pacotes ZIP publicados.

## Compatibilidade

Os nomes globais existentes continuam disponíveis. A migração não altera os nomes públicos usados pela interface e pelos módulos antigos.
