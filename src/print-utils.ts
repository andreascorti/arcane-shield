import chalk from "chalk";
import type { SWA, SecureDomain } from "./swa.types.js";
import { writeFile } from "node:fs";

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

export function writeJSONOutput(output: string, sub: string, enhancedSWAs: SWA[]) {
    writeFile(output, JSON.stringify({subscription: sub, 'static-web-apps': enhancedSWAs}, null, 2), (err) => {
    if (err) {
        console.error(chalk.red(err));
        return;
    }
    console.log(chalk.green(`Scan report saved to ${output}`));
    });
}

export function writeCSVOutput(output: string, sub: string, enhancedSWAs: SWA[]) {
    let csv = 'SWA Name, Subscription, Resource Group, repositoryUrl, SKU Tier, Domain, WAF, WAF Product, Private Endpoints, Linked Backends, Database Connection \n';
    for (const swa of enhancedSWAs) {
        csv += `${swa.name}, ${sub}, ${swa.resourceGroup}, ${swa.repositoryUrl}, ${swa.sku.tier},${swa.defaultHostname.domain}, ${swa.defaultHostname.waf}, ${swa.defaultHostname.waf ? `${swa.defaultHostname.firewall} - ${swa.defaultHostname.manufacturer}` : 'None'}, ${swa.privateEndpointConnections?.length > 0}, ${swa.linkedBackends?.length > 0}, ${swa.databaseConnections.length > 0} \n`;
        for (const customDomain of swa.customDomains) {
            csv += `${swa.name}, ${sub}, ${swa.resourceGroup}, ${swa.repositoryUrl}, ${swa.sku.tier}, ${customDomain.domain}, ${customDomain.waf}, ${customDomain.waf ? `${customDomain.firewall} - ${customDomain.manufacturer}` : 'None'}, ${swa.privateEndpointConnections?.length > 0}, ${swa.linkedBackends?.length > 0}, ${swa.databaseConnections?.length > 0} \n`;
        }
    }
    writeFile(output, csv, (err) => {
        if (err) {
            console.error(chalk.red(err));
            return;
        }
        console.log(chalk.green(`Scan report saved to ${output}`));
    });
}