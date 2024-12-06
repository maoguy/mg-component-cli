import { existsSync } from "fs";
import { Command } from "commander";
import path from "path";
import { z } from "zod";
import { getRegistryIndex } from "@/src/utils/registry";
import { logger } from '@/src/utils/logger';
import prompts from "prompts";
import { getConfig } from "../utils/get-config";

export const addOptionsSchema = z.object({
  components: z.array(z.string()).optional(),
  yes: z.boolean(),
  overwrite: z.boolean(),
  cwd: z.string(),
  all: z.boolean(),
});

export const add = new Command()
  .name("add")
  .description("add a component to your project")
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
    "-o, --overwrite",
    "overwrite existing files.",
    false
  )
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .option(
    "-a, --all",
    "add all awailable components",
    false
  )
  .action(async(components, opts)=>{
    try{
      const options = addOptionsSchema.parse({
        components,
        cwd: path.resolve(opts.cwd),
        ...opts
      });
      console.log("add with options:",options);

      if (!options.components?.length) {
        options.components = await promptForRegistryComponents(options);
      }

      // preFlightAdd
      // 
      if (!existsSync(options.cwd)) {
        logger.error(`The path ${options.cwd} does not exit. Please try again.`);
      }

      const config = await getConfig(options.cwd);
      if(!config) {
        logger.warn(
          
        )
      }
    }catch(error){
      console.error(error);
    }
  });

async function promptForRegistryComponents(
  options: z.infer<typeof addOptionsSchema>
) {
  const registryIndex = await getRegistryIndex();
  if(!registryIndex) {
    logger.error("Fail to fetch registry index!");
    return []
  }

  if (options.all) {
    return registryIndex.map((entry) => entry.name);
  }

  if (options.components?.length) {
    return options.components;
  }

  const { components } = await prompts({
    type: "multiselect",
    name: "components",
    message: "Which components would you like to add?",
    hint: "Space to select. A to toggle all. Enter to submit.",
    instructions: false,
    choices: registryIndex
      .filter((entry) => entry.type === "registry:ui")
      .map((entry) => ({
        title: entry.name,
        value: entry.name,
        selected: options.all ? true : options.components?.includes(entry.name)
      }))
  });

  logger.info("you select:",components);

  if (!components?.length) {
    logger.warn("No components selected. Exiting.");
    logger.info("");
    process.exit(1);
  }

  const result = z.array(z.string()).safeParse(components);
  if (!result.success) {
    logger.error("Something went wrong. Please try again.");
    return [];
  }
  return result.data;
}