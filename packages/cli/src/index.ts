#!/usr/bin/env node
import { Command } from 'commander';
import packageJson from "../package.json";
import { init } from '@/src/commands/init';
import { add } from '@/src/commands/add' ;

async function main() {
  const program = new Command()
    .name("suxi-ui-cli")
    .description("add components and dependencies to your project")
    .version(
      packageJson.version || "1.0.0",
      "-v, --version",
      "display the version number"
    );
  
  program
    .addCommand(init)
    .addCommand(add)

  program.parse();
}

main()