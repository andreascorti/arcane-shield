import chalk from "chalk";
import { exec as execCb } from "node:child_process";
import { promisify } from "node:util";
import type { SWA, SecureDomain } from "../swa.types.js";
import { readFileSync, unlinkSync } from "node:fs";

const exec = promisify(execCb);

export async function scanSWAAndReport(swa: SWA) {
    const enhancedSWA = {...swa};
    console.log(chalk.yellow(`Analyzing ${enhancedSWA.name}`));
    enhancedSWA.defaultHostname = await scanDomain(enhancedSWA.name, enhancedSWA.defaultHostname);
    const customDomains = [];
    for(const customDomain of enhancedSWA.customDomains) {
        customDomains.push(await scanDomain(enhancedSWA.name, customDomain));
    }
    enhancedSWA.customDomains = customDomains;
    return enhancedSWA;
}

export async function scanDomain(name: string, domain: SecureDomain) {
    console.log(chalk.yellow(`\t Testing https://${domain.domain}`));
    const wafResult =  await exec(`wafw00f https://${domain.domain} -f json -o ${name}.${domain.domain}.json`);
    if (wafResult.stderr) {
    //console.debug(wafResult.stderr);
    }
    const domainResult: {detected: boolean, firewall: string, manufacturer: string} = JSON.parse(
        readFileSync(`${name}.${domain.domain}.json`, 'utf8'))[0];
    
        //Try to curl to get the status code
    const httpStatus = await exec(`curl -s -o /dev/null -w "%{http_code}" --location https://${domain.domain}`);

    unlinkSync(`${name}.${domain.domain}.json`);
    return {
        ...domain,
        waf: domainResult.detected,
        httpStatusCode: httpStatus.stdout,
        firewall: domainResult.firewall,
        manufacturer: domainResult.manufacturer
    };
}