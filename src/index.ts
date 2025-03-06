#!/usr/bin/env node

import select from "@inquirer/select";
import chalk from "chalk";
import { program } from "commander";
import { retrieveSubscriptions } from "./az-commands/subscriptions.js";
import { retrieveStaticWebApps } from "./az-commands/swa.js";
import {
	printConsoleReport,
	writeCSVOutput,
	writeJSONOutput,
} from "./print-utils.js";
import { scanSWAAndReport } from "./scanner/waf-scanner.js";
import type { SWA } from "./swa.types.js";
import { DefaultAzureCredential } from "@azure/identity";

program
	.version("0.1.0")
	.description(
		"Welcome to Arcane Shield, a security tool to check the presence of a Web Application Firewall on static web site in your subscription.",
	)
	.option("-s, --subscription <id>", "ID of your Azure subscription")
	.option("-o, --output <name>", "Output name", "scanReport.json")
	.option(
		"-f, --format <type>",
		"Output format, accepted json, csv; default: json",
		"json",
	)
	.action(async (options) => {
		console.log(chalk.magentaBright.bold`Welcome to Arcane Shield`);
		const creds = new DefaultAzureCredential();
		const subscriptions = await retrieveSubscriptions(creds);
		let selectedSubscription = options.subscription;
		if (!selectedSubscription) {
			selectedSubscription = await select({
				message: "Select a subscription",
				choices: subscriptions.map((subscription) => ({
					name: subscription.name,
					value: subscription.id,
					description: `ID: ${subscription.id}`,
				})),
			});
		}
		const staticWebApps = await retrieveStaticWebApps(
			creds,
			selectedSubscription,
		);
		const enhancedSWAs: SWA[] = [];
		for (const staticWebApp of staticWebApps) {
			enhancedSWAs.push(await scanSWAAndReport(staticWebApp));
		}
		for (const swa of enhancedSWAs) {
			printConsoleReport(swa);
		}

		if (options.format === "json") {
			writeJSONOutput(options.output, selectedSubscription, enhancedSWAs);
		} else if (options.format === "csv") {
			writeCSVOutput(options.output, selectedSubscription, enhancedSWAs);
		}
	});
program.parse(process.argv);
