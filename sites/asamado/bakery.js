"use strict";
// Allow readers to switch sections without keeping multiple answers open.
const group=document.querySelectorAll(".faq details");
group.forEach(d=>d.addEventListener("toggle",()=>{if(d.open)group.forEach(x=>{if(x!==d)x.open=false;});}));
