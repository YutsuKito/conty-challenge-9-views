# Desafio 9 — Views que não parecem humanas

Classificador **determinístico, auditável e conservador** de views/hora. API Node 22, sem modelo opaco ou dados externos. Retorna `classification` (`legitimate`, `suspicious`, `inconclusive`), `reason` legível e `signals` numéricos.

```bash
npm test && npm run typecheck
npm run evaluate
npm start
curl -X POST http://localhost:3009/classify -H 'content-type: application/json' -d '{"views":[80,80,80,80,80,80,80,80,8000,8000,8000,8000,8000,8000,8000,8000,80,80,80,80,80,80,80,80]}'
# response: {"classification":"suspicious","reason":"Platô alto repetido ...","signals":{"baseline_views":80,"peak_views":8000,...}}
```

`npm run evaluate` gera `data/synthetic.json` com seed `20261009` e mede falso positivo apenas entre exemplos com rótulo `legitimate`. `npm test` recalcula e **falha se a taxa a seguir divergir**. Os 120 casos legítimos incluem séries estáveis, pico orgânico viral gradual e evento ao vivo; os 40 suspeitos têm plateau mecânico artificial. Série de um único pico alto **não é acusada**: retorna `inconclusive`.

**FPR_DATASET=0.00%** (taxa de falso positivo no dataset, não no tráfego real).

Sinais usados: razão pico/base, horas contínuas de platô alto, duração de valores altos idênticos, maior razão de subida e queda entre horas. Regra suspeita exige **múltiplos sinais** conjuntamente; pico isolado não basta. O modelo não detecta bots com distribuição humana simulada, fraude distribuída sofisticada ou surtos reais artificialmente regulares; precisa revisão humana para consequência financeira. Dataset sintético não estabelece sensibilidade/especificidade em produção.

## Planejamento, execução e revisão

Planejamento e execução utilizando Codex GPT Sol 6.1. As implementações iniciais tiveram assistência de ChatGPT. O Codex realizou a revisão técnica e a análise dos requisitos, inspecionou o código e executou a validação automatizada registrada nesta entrega.

O autor realizou a revisão pessoal dos nove desafios, conforme declarado nesta execução. Os pontos abaixo documentam os critérios de análise da estrutura, da geração de testes e da qualidade do código.

| Área | Pontos de análise e revisão |
|---|---|
| Geração da estrutura | Separar classificador, gerador de dataset e avaliação; retornar classificação, motivo legível e sinais. |
| Geração e revisão dos testes | Cobrir platô mecânico, pico viral, abstenção, entradas inválidas, reprodutibilidade e casos sintéticos independentes. Manter teste que compara o FPR calculado com o README. |
| Qualidade estrutural | Conferir a combinação conservadora de sinais e os limites de inconclusive. O resultado sintético não sustenta ação financeira automática. |

**Limite confirmado na revisão pessoal:** FPR de 0% corresponde a 0 falsos positivos entre 120 casos legítimos sintéticos, gerados com seed 20261009. A taxa de falsos positivos em tráfego real não foi medida. Avaliar essa taxa exige dados reais rotulados, independentes do gerador, e revisão dos casos; este protótipo não fornece evidência para declarar precisão real ou tomar decisões financeiras automaticamente.


## Verificação completa em 09/10/2026

Séries com posições ausentes são rejeitadas, evitando classificação com sinais NaN. A avaliação sintética continua independente dessa validação.

O transporte HTTP rejeita JSON nulo, arrays e valores primitivos com 400 antes de chamar o serviço. Parâmetros de rota são decodificados uma vez; escape inválido retorna 400. Dois testes de transporte verificam esses comportamentos, incluindo códigos com caracteres especiais.

Resultado desta rodada: 12 testes aprovados, zero falhas; checagem sintática aprovada e smoke HTTP com entrada válida 200 e inválida 400. As correções e a nova validação foram realizadas pelo Codex; não são atribuídas como revisão manual do autor.
