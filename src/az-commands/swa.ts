import chalk from "chalk";
import type { SWA } from "../swa.types.js";
import type { DefaultAzureCredential } from "@azure/identity";
import { WebSiteManagementClient } from "@azure/arm-appservice";

export async function retrieveStaticWebApps(
	creds: DefaultAzureCredential,
	subscriptionId: string,
) {
	console.log(
		chalk.blue(`Retrieving resources for subscription ${subscriptionId}`),
	);
	const serviceAppClient = new WebSiteManagementClient(creds, subscriptionId);
	const staticWebApps = serviceAppClient.staticSites.list();
	const swaList: SWA[] = [];
	for await (const swa of staticWebApps) {
		console.log(
			chalk.blue(`Retrieved ${swa.name} from subscription ${subscriptionId}`),
		);
		swaList.push({
			name: swa.name ?? "unknown",
			defaultHostname: { domain: swa.defaultHostname ?? "unknown" },
			resourceGroup: swa.id?.split("/")[4] ?? "unknown",
			repositoryUrl: swa.repositoryUrl ?? "unknown",
			sku: { tier: swa.sku?.tier ?? "unknown" },
			customDomains:
				swa.customDomains?.map((domain: string) => ({ domain })) ?? [],
			linkedBackends:
				swa.linkedBackends?.map(
					(linkedBackend) => linkedBackend.backendResourceId ?? "unknown",
				) ?? [],
			privateEndpointConnections:
				swa.privateEndpointConnections?.map((pe) => pe.name ?? "unknown") ?? [],
			databaseConnections:
				swa.databaseConnections?.map((db) => db.name ?? "unknown") ?? [],
		});
	}
	return swaList;
}
