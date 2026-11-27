"use strict";
/* Fixture. When the CMS is connected, replace this array at the data boundary, not the views. */
const breadCatalog=[
  {
    "id": "croissant",
    "name": "クロワッサン",
    "price": 320,
    "bakeTime": "06:00",
    "category": "パン",
    "description": "層はさっくり。発酵バターが香る定番。",
    "image": "story-croissant.webp"
  },
  {
    "id": "shokupan",
    "name": "山型食パン",
    "price": 460,
    "bakeTime": "06:00",
    "category": "パン",
    "description": "耳までやわらかく、トーストにも。",
    "image": "bread-shokupan.webp"
  },
  {
    "id": "anpan",
    "name": "粒あんぱん",
    "price": 250,
    "bakeTime": "06:00",
    "category": "パン",
    "description": "つぶあんを、ふんわりした生地で包みました。",
    "image": "bread-anpan.webp"
  },
  {
    "id": "melon",
    "name": "メロンパン",
    "price": 280,
    "bakeTime": "08:30",
    "category": "パン",
    "description": "格子模様のクッキー生地はさくさく。",
    "image": "bread-melon.webp"
  },
  {
    "id": "chocolat",
    "name": "パン・オ・ショコラ",
    "price": 380,
    "bakeTime": "08:30",
    "category": "パン",
    "description": "ほろ苦いチョコをバターの層で包んだパン。",
    "image": "bread-chocolat.webp"
  },
  {
    "id": "cinnamon",
    "name": "シナモンロール",
    "price": 340,
    "bakeTime": "08:30",
    "category": "パン",
    "description": "ほどよい甘さとシナモンの香り。",
    "image": "bread-cinnamon.webp"
  },
  {
    "id": "campagne",
    "name": "カンパーニュ",
    "price": 760,
    "bakeTime": "10:30",
    "category": "パン",
    "description": "香ばしい皮に、もっちりした中身。",
    "image": "story-campagne.webp"
  },
  {
    "id": "egg",
    "name": "たまごサンド",
    "price": 480,
    "bakeTime": "10:30",
    "category": "サンド",
    "description": "まろやかなたまごを、やわらかい食パンで。",
    "image": "bread-egg.webp"
  },
  {
    "id": "ham",
    "name": "ハムとレタスのバゲットサンド",
    "price": 560,
    "bakeTime": "10:30",
    "category": "サンド",
    "description": "歯切れのいいバゲットに、ハムとレタス。",
    "image": "bread-ham.webp"
  },
  {
    "id": "focaccia",
    "name": "玉ねぎのフォカッチャ",
    "price": 360,
    "bakeTime": "10:30",
    "category": "パン",
    "description": "甘く焼いた玉ねぎとハーブ。",
    "image": "bread-focaccia.webp"
  },
  {
    "id": "salt-roll",
    "name": "塩バターロール",
    "price": 220,
    "bakeTime": "13:00",
    "category": "パン",
    "description": "底のカリッとしたところまで香ばしい。",
    "image": "story-salt-roll.webp"
  },
  {
    "id": "sausage",
    "name": "ウインナーロール",
    "price": 360,
    "bakeTime": "13:00",
    "category": "パン",
    "description": "ウインナーに、粒マスタードを少し。",
    "image": "bread-sausage.webp"
  },
  {
    "id": "canelé",
    "name": "カヌレ",
    "price": 320,
    "bakeTime": "13:00",
    "category": "焼き菓子",
    "description": "外はカリッと、中はもっちり。",
    "image": "bread-canele.webp"
  },
  {
    "id": "financier",
    "name": "フィナンシェ",
    "price": 260,
    "bakeTime": "13:00",
    "category": "焼き菓子",
    "description": "焦がしバターとアーモンドが香る。",
    "image": "bread-financier.webp"
  },
  {
    "id": "matcha",
    "name": "抹茶とホワイトチョコのスコーン",
    "price": 330,
    "bakeTime": "13:00",
    "category": "焼き菓子",
    "description": "ほろ苦い抹茶に、ミルキーな甘さ。",
    "image": "bread-matcha.webp"
  }
];
const breadBase=new URL(".",document.currentScript.src);
const node=(tag,text="",cls="")=>{const e=document.createElement(tag);e.textContent=text;if(cls)e.className=cls;return e;};
const schedule=document.querySelector("#bakes .schedule");
if(schedule){
 const slots=Map.groupBy?Map.groupBy(breadCatalog,p=>p.bakeTime):breadCatalog.reduce((m,p)=>m.set(p.bakeTime,[...(m.get(p.bakeTime)||[]),p]),new Map());
 const intro={"06:00":"朝いちばんの定番","08:30":"甘いパン","10:30":"お昼に向けて","13:00":"午後のパンと焼き菓子"};
 const rows=[...slots].sort(([a],[b])=>a.localeCompare(b)).map(([time,items])=>{const row=node("article"),title=node("h3",intro[time]||"焼き上がり"),line=node("p","","bake-items");for(const [i,p] of items.entries()){if(i)line.append(node("span","・","bake-divider"));const a=node("a",p.name);a.href=new URL("menu/#"+encodeURIComponent(p.id),breadBase).href;line.append(a);}const clock=node("time",time,"clock");clock.dateTime=time;row.append(clock,title,line);return row;});
 schedule.replaceChildren(...rows);
}
const menu=document.querySelector("#all-breads");
if(menu){for(const p of breadCatalog){const card=node("article","","menu-item");card.id=p.id; const img=node("img");img.src=new URL("photos/"+p.image,breadBase).href;img.alt="";img.width=640;img.height=640;img.loading="lazy";img.decoding="async";img.addEventListener("error",()=>{img.remove();},{once:true});const meta=node("p",p.category+" ・ "+p.bakeTime,"menu-meta"),heading=node("h2",p.name),line=node("div","","menu-title");line.append(heading,node("span","¥"+p.price));card.append(img,meta,line,node("p",p.description,"menu-description"));menu.append(card);}}
