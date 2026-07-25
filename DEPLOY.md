# Deploy no Fly.io

Este projeto já vem com `Dockerfile`, `fly.toml` e `.fly/entrypoint.d/` prontos e
testados localmente (build + boot + migração + persistência de dados via volume
foram verificados rodando o container real com Docker antes de deixar isso aqui).

## Antes de começar

- Crie uma conta em https://fly.io e instale a CLI:
  ```bash
  curl -L https://fly.io/install.sh | sh
  fly auth login
  ```
- Cartão de crédito é exigido no cadastro, mas o app descrito aqui (1 máquina
  `shared-cpu-1x`, 512MB, volume de 1GB) fica dentro da faixa gratuita do plano
  Hobby na maior parte dos casos. Acompanhe o uso em https://fly.io/dashboard.

## Passo a passo

```bash
# 1. Cria o app no Fly (usa o nome/região já definidos em fly.toml —
#    troque em fly.toml se "sorteio-equilibrado" já estiver em uso por outra conta)
fly apps create sorteio-equilibrado

# 2. Cria o volume persistente onde o SQLite vai morar (nome tem que
#    bater com o "source" em fly.toml, e a região com "primary_region")
fly volumes create sorteio_data --region gru --size 1

# 3. Define o APP_KEY como secret (NUNCA coloque isso no fly.toml, que é versionado)
fly secrets set APP_KEY="base64:R5LMEoTVRVzHJ+zkbLGTvop4wmBdzsSQuHwGuILYNEI="

# 4. Deploy
fly deploy
```

Depois do primeiro deploy, o app fica em `https://sorteio-equilibrado.fly.dev`
(ajuste `APP_URL` em `fly.toml` se usar outro nome de app ou domínio próprio).

## Por que só 1 máquina

O banco é um arquivo SQLite num volume. Volumes do Fly são por-máquina — uma
segunda máquina teria seu próprio volume vazio, e os dois bancos divergiriam
silenciosamente. **Nunca rode `fly scale count` acima de 1** neste app. Isso já
é natural aqui porque só existe um volume `sorteio_data`, mas vale o aviso.

## Comandos úteis pós-deploy

```bash
fly logs                       # ver logs em tempo real
fly ssh console                # entrar no container
fly ssh console -C "php artisan migrate:status"
fly volumes list                # conferir o volume
```

## Se algo der errado na permissão do volume

O `.fly/entrypoint.d/60-fix-data-volume-permissions.sh` corrige a dono do
diretório do volume automaticamente a cada boot. Se mesmo assim aparecer erro
de permissão no arquivo `.sqlite`, rode manualmente:

```bash
fly ssh console -C "chown -R www-data:www-data /data"
```
