import chalk from "chalk";
import type { SWA, SecureDomain } from "./swa.types.js";

export function printConsoleReport(swa: SWA) {
    console.log("SWA:", chalk.blueBright(swa.name));
    printConsoleDomain(swa.defaultHostname, true);
    for (const customDomain of swa.customDomains) {
        printConsoleDomain(customDomain)
    }
    console.log("\t Has linked Backends:", swa.linkedBackends.length > 0 ? chalk.red('Yes') : chalk.green('No'));
    console.log("\t Has private Endpoints:", swa.privateEndpointConnections.length > 0 ? chalk.green('Yes') : chalk.red('No'));
}
  
export function printConsoleDomain(domain: SecureDomain, isDefault = false) {
    console.log(isDefault ? 'Default Domain' : 'Custom Domain:', chalk.blue(domain.domain));
    console.log("\t WAF:",domain.waf ? chalk.green('Detected') : chalk.red('Not detected'));
    if (domain.waf) {
        console.log("\t\t Firewall:", chalk.green(domain.firewall));
        console.log("\t\t Manufacturer:", chalk.green(domain.manufacturer));
    }
}