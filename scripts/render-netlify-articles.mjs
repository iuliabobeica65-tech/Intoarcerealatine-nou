import {renderArticles} from "./generate-articles.mjs";
import {resolve} from "node:path";
const directory=resolve(process.argv[2]||"public-site");
const base=process.env.SITE_URL||"https://spontaneous-quokka-e0bede.netlify.app";
renderArticles(directory,base);
