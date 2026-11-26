import {writeFile,rename} from "node:fs/promises";
import {resolve} from "node:path";
import {fileURLToPath,pathToFileURL} from "node:url";

const slug=/^[a-z0-9][a-z0-9-]{0,62}$/;
const idPattern=/^[a-z0-9_-]{1,100}$/i;
function cleanText(value,max){return typeof value==="string"?value.trim().slice(0,max):"";}
export function normalizePublishedArticle(row){
 if(!row||!idPattern.test(row.id||"")||!row.publishedAt||!Number.isFinite(Date.parse(row.publishedAt)))return null;
 const title=cleanText(row.title,160),body=cleanText(row.body,18000);
 if(!title||!body)throw new Error("Schema mismatch: a published article is missing title/body.");
 const date=new Intl.DateTimeFormat("sv-SE",{timeZone:"Asia/Tokyo",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date(row.publishedAt));
 return {id:row.id,title,date,category:cleanText(row.category,90),summary:cleanText(row.summary,400),body};
}
export async function collectPublished({service,endpoint="blog",key,fetcher=fetch}){
 if(!slug.test(service||"")||!slug.test(endpoint)||!key)throw new Error("microCMS service ID, endpoint, or GET key is missing.");
 const rows=[];const max=100;
 for(let offset=0;offset<1000;offset+=max){
  const url=new URL(`https://${service}.microcms.io/api/v1/${endpoint}`);
  url.searchParams.set("fields","id,publishedAt,title,category,summary,body");
  url.searchParams.set("orders","-publishedAt");url.searchParams.set("limit",String(max));url.searchParams.set("offset",String(offset));
  const res=await fetcher(url,{headers:{"X-MICROCMS-API-KEY":key},redirect:"error",signal:AbortSignal.timeout(10000)});
  if(!res.ok)throw new Error(`microCMS responded with HTTP ${res.status}.`);
  const payload=await res.json();
  if(!Array.isArray(payload.contents)||!Number.isInteger(payload.totalCount)||payload.totalCount>1000)throw new Error("Invalid microCMS list response.");
  rows.push(...payload.contents.map(normalizePublishedArticle).filter(Boolean));
  if(offset+max>=payload.totalCount)break;
 }
 if(new Set(rows.map(p=>p.id)).size!==rows.length)throw new Error("Duplicate post ID; try again.");
 return rows.sort((a,b)=>b.date.localeCompare(a.date));
}
async function main(){
 const settings={service:process.env.MICROCMS_SERVICE_ID,endpoint:process.env.MICROCMS_ENDPOINT||"blog",key:process.env.MICROCMS_GET_KEY};
 const posts=await collectPublished(settings);
 const output=fileURLToPath(new URL("../blog/posts.json",import.meta.url));
 const tmp=output+".tmp";
 await writeFile(tmp,JSON.stringify({source:"microcms",posts},null,2)+"\n",{mode:0o644});
 await rename(tmp,output);
 console.log(`Collected ${posts.length} published article(s).`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)main().catch(e=>{console.error(e.message);process.exitCode=1;});
