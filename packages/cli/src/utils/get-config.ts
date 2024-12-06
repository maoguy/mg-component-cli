import { cosmiconfig } from "cosmiconfig";
import { COMPONENTS_CONFIG_FILE_NAME } from "@/src/commands/init";
import { logger } from '@/src/utils/logger';

const explorer = cosmiconfig("components",{
  searchPlaces: [COMPONENTS_CONFIG_FILE_NAME]
})

export async function getRawConfig(cwd: string) {
  try {
    const configResult = await explorer.search(cwd);

    if (!configResult) {
      return null;
    }

    return configResult.config;
  } catch (error) {
    const componentPath = `${cwd}/${COMPONENTS_CONFIG_FILE_NAME}`;
    logger.error(`Invalid configuration found in ${componentPath}`);
  }
}

export async function getConfig(cwd: string) {
  const config = await getRawConfig(cwd);

  if(!config) {
    return null;
  }

  return config;
}

export async function resolveConfigPaths(cwd:string,config:any) {

}