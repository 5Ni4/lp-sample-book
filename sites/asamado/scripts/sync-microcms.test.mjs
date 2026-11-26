import {test} from "node:test";
import assert from "node:assert/strict";
import {collectPublished,normalizePublishedArticle} from "./sync-microcms.mjs";
const row={id:"hello",title:"試験記事",body:"1段落\n\n2段落",category:"お知らせ",summary:"短い説明",publishedAt:"2026-11-26T15:30:00Z"};
test("published items use Tokyo dates; drafts are not emitted",()=>{assert.equal(normalizePublishedArticle(row).date,"2026-11-27");assert.equal(normalizePublishedArticle({...row,publishedAt:undefined}),null)});
test("credentials only sent in header to the scoped microCMS host; not in output",async()=>{const got=await collectPublished({service:"test-bakery",key:"synthetic",fetcher:async(u,o)=>{assert.equal(u.origin,"https://test-bakery.microcms.io");assert.equal(u.pathname,"/api/v1/blog");assert.equal(o.headers["X-MICROCMS-API-KEY"],"synthetic");assert.equal(o.redirect,"error");assert.ok(!u.href.includes("synthetic"));return {ok:true,json:async()=>({totalCount:1,contents:[row]})};}});assert.equal(got.length,1);assert.ok(!JSON.stringify(got).includes("synthetic"));});
test("no credential or malformed schema fails closed",async()=>{await assert.rejects(collectPublished({service:"evil.com",key:"synthetic"}));await assert.rejects(collectPublished({service:"test-bakery",key:"synthetic",fetcher:async()=>({ok:false,status:403})}));assert.throws(()=>normalizePublishedArticle({...row,body:""}));});
