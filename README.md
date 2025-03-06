# Arcane Shield

This CLI performs security checks on Azure Static Web Apps resources in a subscription.
It requires [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/) to be install as well as [wafw00f](https://github.com/EnableSecurity/wafw00f)

## How to use
If you are building the CLI, execute:
```bash
 pnpm i
 pnpm run build
 npm link
```
After that, you will be able to use the CLI as:
```
arcane-shield
```

## Features:
### WAF Checking
Check for each Domain configured in a static web app if a WAF is detected.
It requires [wafw00f](https://github.com/EnableSecurity/wafw00f) to be installed
### Check private endpoints
Check if the static web app is configured to be in a VNet

### TODOs
Add additional security checks.