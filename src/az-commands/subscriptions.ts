import chalk from "chalk";
import { exec as execCb } from "node:child_process";
import { promisify } from "node:util";
import type { Subscription } from "../swa.types.js";

const exec = promisify(execCb);

export async function retrieveSubscriptions() {
	const json = await exec("az account list");
  if (json.stderr) {
    console.log(
			chalk.red`You are not logged in. Executing 'az login' to log in.`,
		);
		try {
			await exec("az login");
			console.log(chalk.green`You are now logged in.`);
      return retrieveSubscriptions();
		} catch (error) {
			console.log(chalk.red`An error occurred while trying to log in.`);
		}
  }
  const subs = JSON.parse(json.stdout ?? "[]");

  return subs.map((sub: Subscription) => ({id: sub.id, name: sub.name}));
}