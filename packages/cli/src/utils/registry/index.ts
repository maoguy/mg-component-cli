import indexJson from '@/src/static-data/index.json';
import {logger} from '@/src/utils/logger';
import { registryIndexSchema } from '@/src/utils/registry/schema';
import z from 'zod';

const REGISTRY_URL = "";

export async function getRegistryIndex() {
  try {
    const [result] = await fetchRegistry(["index.json"]);
    
    return registryIndexSchema.parse(result);
  } catch (error) {
    logger.error("\n");
    logger.error(error);
  }
}

async function fetchRegistry(paths: string[]) {
  try{
    const results = await Promise.all(
      paths.map(async(path) => {
        // const url = getRegistryUrl(path);
        // const response = await fetch(url);
        if(path === "index.json") {
          return indexJson;
        }
      })
    );
    return results;
  }catch(error){
    return [];
  }
}

function getRegistryUrl(path: string) {
  if(isUrl(path)) {
    const url = new URL(path);
    return url.toString();
  }

  return `${REGISTRY_URL}/${path}`;
}

function isUrl(path: string) {
  try {
    new URL(path)
    return true;
  } catch (error) {
    return false;
  }
}