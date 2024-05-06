import chalk from "chalk";
import { exec as execCb } from "node:child_process";
import { promisify } from "node:util";
import type { SWA, SecureDomain } from "../swa.types.js";

const exec = promisify(execCb);

export async function retrieveStaticWebApps(subscriptionId: string) {
	console.log(
		chalk.blue`Retrieving resources for subscription ${subscriptionId}`,
	);
	const staticWebApps = await exec(
		`az staticwebapp list --subscription ${subscriptionId}`
	);
  if (staticWebApps.stderr) {
    console.log(
      chalk.red`An error occurred while trying to retrieve the resources.`,
    );
  }
  const swaList = JSON.parse(staticWebApps.stdout);
  return swaList.map((swa: SWA) => (
    {
      name: swa.name, 
      defaultHostname: {domain: swa.defaultHostname},
      resourceGroup: swa.resourceGroup,
      repositoryUrl: swa.repositoryUrl,
      sku: {tier: swa.sku.tier},
      customDomains: swa.customDomains.map((domain: SecureDomain) => ({domain})),
      linkedBackends: swa.linkedBackends,
      privateEndpointConnections: swa.privateEndpointConnections,
      databaseConnections: swa.databaseConnections
    }));
}