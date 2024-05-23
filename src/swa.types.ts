export type Subscription = {
    name: string,
    id: string,
}

export type SWA = {
    name: string;
    resourceGroup: string;
    repositoryUrl: string;
    sku: {tier: string};
    defaultHostname: SecureDomain;
    customDomains: SecureDomain[];
    linkedBackends: string[];
    privateEndpointConnections: string[];
    databaseConnections: string[];
}

export type SecureDomain = {
    domain: string;
    waf?: boolean;
    httpStatusCode?: string;
    firewall?: string;
    manufacturer?: string;
}