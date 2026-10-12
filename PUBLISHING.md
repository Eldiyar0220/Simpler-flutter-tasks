# Publishing

```sh
npx vsce login Eldiyar-Dev   # once, asks for a Personal Access Token
npm run package              # builds simpler-flutter-tasks-<version>.vsix
npm run release              # publishes to the Marketplace
```

Personal Access Token: https://dev.azure.com/ebolotov904 → user icon (top right) →
Personal access tokens → scope "Marketplace → Manage".

Publisher page: https://marketplace.visualstudio.com/manage/publishers/eldiyar-dev
