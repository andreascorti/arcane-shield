import type { DefaultAzureCredential } from "@azure/identity";
import { SubscriptionClient } from "@azure/arm-subscriptions";

export async function retrieveSubscriptions(creds: DefaultAzureCredential) {
	const subscriptionClient = new SubscriptionClient(creds);
	const subs = [];
	for await (const subscription of subscriptionClient.subscriptions.list()) {
		subs.push({
			id: subscription.subscriptionId,
			name: subscription.displayName,
		});
	}
	return subs;
}
