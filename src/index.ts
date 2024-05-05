#!/usr/bin/env node

import { exec as execCb } from "node:child_process";
import { promisify } from "node:util";
import chalk from "chalk";
import { program } from "commander";
import select from "@inquirer/select";
import { readFileSync, unlinkSync, writeFile } from "node:fs";
import { printConsoleReport } from "./print-utils.js";
import type { SWA, SecureDomain} from "./swa.types.js";
import { retrieveSubscriptions } from "./az-commands/subscriptions.js";
import { retrieveStaticWebApps } from "./az-commands/swa.js";
import { scanSWAAndReport } from "./scanner/waf-scanner.js";

const exec = promisify(execCb);

program
	.version("0.1.0")
	.description(
		"Welcome to Arcane Shield, a security tool to check the presence of a Web Application Firewall on static web site in your subscription.",
	)
	.option("-s, --subscription <id>", "ID of your Azure subscription")
  .option("-o, --output <type>", "Output type:", "scanReport.json")
	.action(async (options) => {
		console.log(chalk.magentaBright.bold`Welcome to Arcane Shield`);
		const subscriptions = await retrieveSubscriptions();
    let selectedSubscription = options.subscription;
		if (!selectedSubscription) {
			selectedSubscription = await select({
          message: 'Select a subscription',
          choices: subscriptions.map((subscription: { name: string; id: string; isDefault: boolean}) => ({
            name: subscription.name,
            value: subscription.id,
            description: `ID: ${subscription.id}`
          }))});
    }
    const staticWebApps = await retrieveStaticWebApps(selectedSubscription);
    const enhancedSWAs: SWA[] = [];
    for(const staticWebApp of staticWebApps) {
      enhancedSWAs.push(await scanSWAAndReport(staticWebApp));
    }
    for (const swa of enhancedSWAs) {
      printConsoleReport(swa);
    }
    writeFile(options.output, JSON.stringify(enhancedSWAs, null, 2), (err) => {
      if (err) {
        console.error(chalk.red(err));
        return;
      }
      console.log(chalk.green(`Scan report saved to ${options.output}`));
    });
	});
program.parse(process.argv);
