"use strict";
// Allow readers to switch sections without keeping multiple answers open.
const group=document.querySelectorAll(".faq details");
group.forEach(d=>d.addEventListener("toggle",()=>{if(d.open)group.forEach(x=>{if(x!==d)x.open=false;});}));

const monthGrid=document.getElementById("month-grid");
if(monthGrid){
 const p=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Tokyo",year:"numeric",month:"numeric",day:"numeric"}).formatToParts(new Date());
 const tokyo=Object.fromEntries(p.map(x=>[x.type,x.value]));
 const startYear=Number(tokyo.year),startMonth=Number(tokyo.month)-1,startDay=Number(tokyo.day);
 let y=startYear,m=startMonth;
 const days=["月","火","水","木","金","土","日"];
 function drawMonth(){
  document.getElementById("month-label").textContent=`${y}年${m+1}月`;
  const first=(new Date(Date.UTC(y,m,1)).getUTCDay()+6)%7,end=new Date(Date.UTC(y,m+1,0)).getUTCDate();
  const tbody=monthGrid.tBodies[0],rows=[];
  for(let i=0;i<Math.ceil((first+end)/7)*7;i++){
   if(i%7===0)rows.push(document.createElement("tr"));
   const day=i-first+1,td=document.createElement("td");
   if(day<1||day>end){td.className="empty";td.setAttribute("aria-hidden","true");}
   else{const d=document.createElement("span");d.className="date";d.textContent=day;td.append(d);
    if(i%7===0||i%7===1){td.classList.add("closed");const rest=document.createElement("span");rest.className="rest";rest.textContent="休";td.append(rest);}
    if(y===startYear&&m===startMonth&&day===startDay){td.classList.add("today");td.setAttribute("aria-current","date");}
    td.setAttribute("aria-label",`${m+1}月${day}日（${days[i%7]}）${i%7<2?"定休日":"営業日"}`);
   }
   rows.at(-1).append(td);
  }
  tbody.replaceChildren(...rows);
 }
 function move(n){m+=n;if(m>11){m=0;y++;}if(m<0){m=11;y--;}drawMonth();}
 document.getElementById("prev-month").addEventListener("click",()=>move(-1));
 document.getElementById("next-month").addEventListener("click",()=>move(1));
 document.getElementById("month-controls").hidden=false;monthGrid.hidden=false;document.getElementById("calendar-fallback").hidden=true;drawMonth();
}
