/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import Ajv from "ajv";
import { schema } from "@uniswap/token-lists";
import type { TokenList } from "@uniswap/token-lists";
import addFormats from "ajv-formats";
import contenthashToUri from "./contenthashToUri";
import { parseENSAddress } from "./ENS/parseENSAddress";
import uriToHttp from "./uriToHttp";

const ajv = new Ajv({ allErrors: true, verbose: true });
addFormats(ajv);
const tokenListValidator = ajv.compile(schema);

/**
 * Contains the logic for resolving a list URL to a validated token list
 * @param listUrl list url
 * @param resolveENSContentHash resolves an ens name to a contenthash
 */
export default async function getTokenList(
  listUrl: string,
  resolveENSContentHash: (ensName: string) => Promise<string>
): Promise<TokenList> {
  const parsedENS = parseENSAddress(listUrl);
  let urls: string[];
  if (parsedENS) {
    let contentHashUri;
    try {
      contentHashUri = await resolveENSContentHash(parsedENS.ensName);
    } catch (error) {
      console.error(`Failed to resolve ENS name: ${parsedENS.ensName}`, error);
      throw new Error(`Failed to resolve ENS name: ${parsedENS.ensName}`);
    }
    let translatedUri;
    try {
      translatedUri = contenthashToUri(contentHashUri);
    } catch (error) {
      console.error("Failed to translate contenthash to URI", contentHashUri);
      throw new Error(`Failed to translate contenthash to URI: ${contentHashUri}`);
    }
    urls = uriToHttp(`${translatedUri}${parsedENS.ensPath ?? ""}`);
  } else {
    urls = uriToHttp(listUrl);
  }
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const isLast = i === urls.length - 1;
    let response;
    try {
      response = await fetch(url);
    } catch (error) {
      console.error("Failed to fetch list", listUrl, error);
      if (isLast) throw new Error(`Failed to download list ${listUrl}`);
      continue;
    }

    if (!response.ok) {
      if (isLast) throw new Error(`Failed to download list ${listUrl}`);
      continue;
    }

    let json = await response.json();
    json = {
      ...json,
      tokens: json.tokens.filter((token) => token.address !== "0x6EaDc05928ACd93eFB3FA0DFbC644D96C6Aa1Df8"),
    };
    if (!tokenListValidator(json)) {
      console.log(json);
      const validationErrors: string =
        tokenListValidator.errors?.reduce<string>((memo, error) => {
          const add = `${(error as any).dataPath} ${error.message ?? ""}`;
          return memo.length > 0 ? `${memo}; ${add}` : `${add}`;
        }, "") ?? "unknown error";
      throw new Error(`Token list failed validation: ${validationErrors}`);
    }
    return json as TokenList;
  }
  throw new Error("Unrecognized list URL protocol.");
}
