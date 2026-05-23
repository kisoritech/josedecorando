# APK e atualizacoes do app

Este projeto esta configurado para o caminho mais seguro no momento:

- APK de teste via EAS Build, usando o perfil `preview`.
- AAB de producao via EAS Build, usando o perfil `production`.
- Atualizacoes OTA via EAS Update para mudancas de JavaScript, telas, estilos, rotas e regras de negocio.

## Primeiro setup

Instale e autentique o EAS CLI:

```bash
npm install -g eas-cli
eas login
```

Depois vincule o projeto ao Expo. Este comando cria o projeto remoto e adiciona os dados que dependem da sua conta Expo, como `projectId` e URL de updates:

```bash
eas update:configure
```

Confira se o `app.json` passou a ter algo parecido com:

```json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/SEU-PROJECT-ID"
    },
    "extra": {
      "eas": {
        "projectId": "SEU-PROJECT-ID"
      }
    }
  }
}
```

Nao invente esses valores manualmente. Eles devem vir da sua conta Expo.

## Gerar APK instalavel

Use o perfil `preview`, que esta configurado como APK:

```bash
npm run build:android:apk
```

O EAS vai retornar um link para baixar o APK. Para instalar direto no Android, o aparelho precisa permitir instalacao de apps externos para o navegador/gerenciador de arquivos usado no download. Essa permissao e do sistema Android, nao e uma permissao que o app consegue pedir sozinho.

## Gerar AAB para Play Store

Quando chegar na etapa de loja:

```bash
npm run build:android:aab
```

## Publicar atualizacoes OTA

Depois que o APK ja estiver instalado, mudancas comuns podem ir por OTA:

```bash
npm run update:preview -- --message "ajuste na tela de login"
```

Para producao:

```bash
npm run update:production -- --message "correcao de sincronizacao"
```

O app verifica updates ao abrir. Se houver uma atualizacao compativel, ele baixa e recarrega.

## Quando precisa novo APK

Use OTA para:

- Telas, componentes e estilos.
- Regras de negocio em TypeScript/JavaScript.
- Ajustes de chamadas da API.
- Fluxos de login, dashboard, produtos, movimentacoes e relatorios.

Gere novo APK/AAB para:

- Novos plugins nativos.
- Mudancas de permissoes Android.
- Alteracoes em SDK nativo, camera, scanner, biometria ou Mercado Pago nativo.
- Mudanca de `expo.version`, porque o projeto usa `runtimeVersion` com politica `appVersion`.

## Cuidado com versoes

O `runtimeVersion` esta ligado ao `appVersion`. Isso protege o app: uma OTA so chega em builds compativeis. Quando houver mudanca nativa, suba a versao no `app.json`, gere novo APK/AAB, e so depois publique updates naquele novo runtime.
