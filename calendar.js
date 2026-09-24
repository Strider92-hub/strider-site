(()=>{
const grid=document.getElementById('calendar-grid');if(!grid)return;
const today=new Date();today.setHours(0,0,0,0);let focus=new Date(2026,9,1),view='month';
const names=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const format=(date,options)=>new Intl.DateTimeFormat('en-GB',options).format(date);
const key=date=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const add=(date,days)=>new Date(date.getFullYear(),date.getMonth(),date.getDate()+days);
const monday=date=>add(date,-((date.getDay()+6)%7));
// Demonstration records only. October 2026 is a fixed showcase, not real posts.
const relativeEvents=[0,1,2,4,6,8,10,13,16,20,25,32,38].map((offset,i)=>({date:add(today,offset),platform:i%2?'X':'YouTube',title:['Behind the scenes','A week of creating','A little inspiration','Weekend highlights'][i%4],hour:i%3===0?'10:00':i%3===1?'14:30':'18:00'}));
const octoberEvents=[];
const busyDays=new Set([5,12,19,26]);
const demoTitles=['Behind the scenes','A quick creator tip','Daily highlights','Something worth sharing','The evening wrap-up'];
const demoTimes=['09:00','11:30','14:00','17:00','20:00'];
for(let day=1;day<=31;day++){
 const count=busyDays.has(day)?5:1;
 for(let i=0;i<count;i++)octoberEvents.push({date:new Date(2026,9,day),platform:(day+i)%2?'YouTube':'X',title:demoTitles[i]+' · '+day+' Oct',hour:demoTimes[i]});
}
const events=[...relativeEvents.filter(e=>!(e.date.getFullYear()===2026&&e.date.getMonth()===9)),...octoberEvents].sort((a,b)=>a.date-b.date||a.hour.localeCompare(b.hour));
function eventNode(event){const article=document.createElement('article');article.className='calendar-event'+(event.platform==='X'?' x-event':'');const header=document.createElement('header'),img=document.createElement('img');img.src=`platform-icons/${event.platform==='X'?'x-brand':'youtube.com'}.png`;img.alt='';header.append(img,document.createTextNode(event.platform));const title=document.createElement('strong');title.textContent=event.title;const time=document.createElement('time');time.dateTime=key(event.date)+'T'+event.hour;time.textContent=event.hour+' · Scheduled example';article.append(header,title,time);return article;}
function render(){const selected=Array.from(document.querySelectorAll('.platform-filters input:checked'),input=>input.value);let start,end,title;
if(view==='month'){start=new Date(focus.getFullYear(),focus.getMonth(),1);end=new Date(focus.getFullYear(),focus.getMonth()+1,1);title=format(focus,{month:'long',year:'numeric'});}
else if(view==='week'){start=monday(focus);end=add(start,7);title=format(start,{day:'numeric',month:'short',year:'numeric'})+' – '+format(add(end,-1),{day:'numeric',month:'short',year:'numeric'});}
else{start=new Date(focus);end=add(start,1);title=format(focus,{weekday:'long',day:'numeric',month:'long',year:'numeric'});}
const visible=events.filter(event=>event.date>=start&&event.date<end&&selected.includes(event.platform));
document.getElementById('period-title').textContent=title;document.getElementById('calendar-date').value=key(focus);document.getElementById('event-count').textContent=visible.length+' upcoming example'+(visible.length===1?'':'s');document.getElementById('calendar-summary').textContent=!selected.length?'Select a platform to see its upcoming posts.':!visible.length?'No upcoming examples match this period and platform selection.':`${visible.length} upcoming examples shown. View only.`;
grid.replaceChildren();grid.className=view==='day'?'day-view':view+'-grid';
if(view==='day'){if(visible.length)visible.forEach(event=>grid.append(eventNode(event)));else{const empty=document.createElement('p');empty.className='empty';empty.textContent='No upcoming videos to display.';grid.append(empty);}}
else{names.forEach(name=>{const label=document.createElement('div');label.className='weekday';label.textContent=name;grid.append(label);});const first=view==='month'?monday(start):start;const count=view==='month'?Math.ceil(((start.getDay()+6)%7+(new Date(focus.getFullYear(),focus.getMonth()+1,0).getDate()))/7)*7:7;for(let i=0;i<count;i++){const date=add(first,i),cell=document.createElement('section');cell.className='calendar-day'+(date<start||date>=end?' outside':'')+(key(date)===key(today)?' is-today':'');cell.setAttribute('aria-label',format(date,{weekday:'long',day:'numeric',month:'long',year:'numeric'}));const number=document.createElement('span');number.className='day-number';number.textContent=date.getDate();if(key(date)===key(today))number.setAttribute('aria-label','Today, '+date.getDate());cell.append(number);visible.filter(event=>key(event.date)===key(date)).forEach(event=>cell.append(eventNode(event)));grid.append(cell);}}
document.querySelectorAll('[data-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.view===view)));
document.getElementById('previous').setAttribute('aria-label','Previous '+view);document.getElementById('next').setAttribute('aria-label','Next '+view);
}
function move(direction){focus=view==='month'?new Date(focus.getFullYear(),focus.getMonth()+direction,1):add(focus,direction*(view==='week'?7:1));render();}
document.getElementById('previous').addEventListener('click',()=>move(-1));document.getElementById('next').addEventListener('click',()=>move(1));document.getElementById('today').addEventListener('click',()=>{focus=new Date(today);render();});document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{view=button.dataset.view;render();}));document.querySelectorAll('.platform-filters input').forEach(input=>input.addEventListener('change',render));document.getElementById('all-platforms').addEventListener('click',()=>{document.querySelectorAll('.platform-filters input').forEach(input=>input.checked=true);render();});document.getElementById('calendar-date').addEventListener('change',event=>{if(!event.target.value)return;const [year,month,day]=event.target.value.split('-').map(Number);if(year<100||year>9999)return;focus=new Date(year,month-1,day);render();});document.getElementById('timezone-note').textContent='Times shown in your browser timezone: '+Intl.DateTimeFormat().resolvedOptions().timeZone+'. On a phone or tablet, scroll the weekly or monthly grid sideways to see every day.';render();
})();
