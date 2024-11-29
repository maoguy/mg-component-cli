import { promises as fs } from "fs";
import path from "path";
import { Command } from 'commander';
import prompts from "prompts";
// import { z } from "zod";

const COMPONENTS_CONFIG_FILE_NAME = "ui-components.json";

export const init = new Command()
  .name("init")
  .description("initialize your project and install dependencies")
  .argument(
    "[components...]",
    "the components to add or a url to the component."
  )
  .option(
    "-y, --yes",
    "skip confirmation prompt.",
    false
  )
  .option(
    "-c, --cwd <cwd>",
    "the working directory.defaults to the current directory.",
    process.cwd()
  )
  .action(async(components, opts)=>{
    try{
      const options = {
        cwd: path.resolve(opts.cwd),
        ...opts
      };
      await runInit(options);
    }catch(error){
      console.error(error);
    }
  });


export async function runInit(options:any) {
  console.log("runInit");
  
  console.log("options",options)
  if (!options.yes) {
    const { proceed } = await prompts({
      type: "confirm",
      name: "proceed",
      message: `Write configuration to "${COMPONENTS_CONFIG_FILE_NAME}".Proceed?`,
      initial: true
    });

    if (!proceed) {
      process.exit(0);
    }
  }

  // Write ui-components.json
  const targetPath = path.resolve(options.cwd, COMPONENTS_CONFIG_FILE_NAME);
  const config = {
    "aliases": {
      "components": "@/components",
      "utils": "@/utils",
    }
  };
  await fs.writeFile(targetPath, JSON.stringify(config, null, 2), "utf8")

}