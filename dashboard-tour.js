(()=>{
const key='strider.preview.dashboardTour.v1';
const steps=[
 ['Your dashboard','This is your workspace: see your connected accounts, prepare videos and keep track of publishing.','.hero'],
 ['Your connected socials','Check which accounts are connected. Manage account takes you to connection settings. YouTube, X, Instagram, TikTok and Facebook are supported.','.platform-grid'],
 ['Add your videos','Drag an MP4 or MOV into this area, or choose a file. Each video can be up to 500 MB, with 5 GB total account storage. This design preview does not upload files.','#video-drop-zone'],
 ['Prepare a post','Choose Create post beside a video to set its destination, title and caption. Expand Auto-fill draft for editable suggestions from a filename or topic. For YouTube, auto-fill selects Public; review visibility before posting.','#videos .item'],
 ['Post ASAP or schedule','The Create post form lets you choose Post ASAP or Schedule. Post to all selects all connected, available platforms. Preview actions do not publish or schedule a real video.','#videos'],
 ['Track your posts','Post status shows processing, posted and failed examples. Recent history shows previous activity. Use the calendar to view upcoming posts.','.grid'],
 ['Short Video/Reels Calendar','This is your view-only calendar of upcoming posts. Each example shows its platform and scheduled time. You cannot create, edit or move posts here.','#calendar-grid','calendar-video.html'],
 ['Choose your calendar view','Switch between Daily, Weekly and Monthly. Use the arrows to move through dates, Today to return, or Go to date to jump to a date.','.calendar-toolbar','calendar-video.html'],
 ['Filter your upcoming posts','Select the platforms you want to see. The other calendar types are linked above and marked under construction.','.platform-filters','calendar-video.html'],
 ['Social Connections & X credit','Connect or manage your social accounts here. The X card links to X Balance. Minimum top-up is £10 and posting charges include a 15% markup. Real authorisation and payments are not connected in this preview.','.nav a[href="connections.html"]'],
 ['Billing & Subscription','See your plan, renewal and payment details. Find options for payment methods, plans, invoices and cancellation. This preview shows sample data and does not change your subscription.','.nav a[href="billing.html"]'],
 ['Your account','Manage your email and password, or personalise your dashboard with a logo or photo. Preview backgrounds are saved in this browser; account changes are demonstrations only.','.nav a[href="settings.html"]'],
 ['Platform status','See the five working integrations and the other platforms coming soon. These readiness labels are not live uptime monitoring.','.nav a[href="status.html"]'],
 ['Video Tutorials','Find step-by-step video guide topics and replay this dashboard tour. YouTube tutorials are labelled Coming soon until the videos are available.','.nav a[href="tutorials.html"]'],
 ['Help & FAQ','Find answers to common questions and contact Strider using the message form. The form is currently a preview and does not send messages.','.nav a[href="faq.html"]'],
 ['Come back any time','Use Dashboard to return to your workspace. You can run this tour again from the Dashboard tour button or Video Tutorials.','.nav a[href="dashboard.html"]']
];
const currentPage=location.pathname.split('/').pop()||'dashboard.html';
const activeKey='strider.preview.tour.active.v2';
steps.forEach(step=>{if(!step[3]){const match=step[2].match(/href="([^"]+)"/);step[3]=match?match[1]:'dashboard.html';if(match&&step[3]!=='dashboard.html')step[2]=step[3]==='settings.html'?'#appearance':'h1';}});
const dialog=document.createElement('dialog');dialog.className='dashboard-tour';dialog.setAttribute('aria-labelledby','tour-title');dialog.setAttribute('aria-describedby','tour-text');dialog.innerHTML='<div class="tour-focus" aria-hidden="true" hidden></div><section class="tour-panel"><p class="tour-kicker">WELCOME TO STRIDER</p><h2 id="tour-title"></h2><p id="tour-text"></p><p class="tour-progress" aria-live="polite"></p><div class="tour-actions"><button type="button" class="tour-skip">Skip tutorial</button><div><button type="button" class="tour-back">Back</button><button type="button" class="tour-next">Start tutorial</button></div></div></section>';document.body.append(dialog);
const title=dialog.querySelector('h2'),text=dialog.querySelector('#tour-text'),progress=dialog.querySelector('.tour-progress'),next=dialog.querySelector('.tour-next'),back=dialog.querySelector('.tour-back'),skip=dialog.querySelector('.tour-skip'),focus=dialog.querySelector('.tour-focus'),panel=dialog.querySelector('.tour-panel');let index=-1,returnFocus=null,oldScroll=0;
function save(status){try{localStorage.setItem(key,JSON.stringify({status,version:1}));}catch{}}
function position(){if(index<0||index>=steps.length){focus.hidden=true;panel.classList.add('tour-centred');return;}panel.classList.remove('tour-centred');const target=document.querySelector(steps[index][2]);if(!target){focus.hidden=true;return;}const r=target.getBoundingClientRect();focus.hidden=false;focus.style.left=Math.max(4,r.left-5)+'px';focus.style.top=Math.max(4,r.top-5)+'px';focus.style.width=Math.min(innerWidth-8,r.width+10)+'px';focus.style.height=Math.min(innerHeight-8,r.height+10)+'px';panel.classList.toggle('tour-at-top',r.top>innerHeight/2);}
function render(){
 const destination=index>=0&&index<steps.length?steps[index][3]:'dashboard.html';
 try{sessionStorage.setItem(activeKey,JSON.stringify({index,page:destination}));}catch{}
 if(currentPage!==destination){location.assign(destination+'?tourStep='+index);return;}
 back.hidden=index<0;skip.hidden=index>=steps.length;back.disabled=false;
 if(index===-1){title.textContent='Take a quick tour?';text.textContent='Get to know your dashboard and the tools in the left-hand menu. Start the guided tutorial, or skip it and explore at your own pace. You can replay it later.';progress.textContent='You choose when to start.';next.textContent='Start tutorial';}
 else if(index===steps.length){save('completed');title.textContent='You have completed the tutorial!';text.textContent='You’re ready to explore Strider. Revisit this tour any time from the dashboard or Video Tutorials.';progress.textContent='All '+steps.length+' steps completed.';next.textContent='Back to dashboard';back.hidden=true;}
 else{title.textContent=steps[index][0];text.textContent=steps[index][1];progress.textContent='Step '+(index+1)+' of '+steps.length;next.textContent=index===steps.length-1?'Complete tutorial':'Next';const target=document.querySelector(steps[index][2]);target?.scrollIntoView({block:'center',inline:'nearest',behavior:'instant'});}
 position();next.focus();}
function start(at=-1){if(dialog.open)return;returnFocus=document.activeElement;oldScroll=scrollY;index=at;dialog.showModal();render();}
next.addEventListener('click',()=>{if(index>=steps.length){dialog.close();return;}index++;render();});back.addEventListener('click',()=>{index--;render();});skip.addEventListener('click',()=>{save('skipped');dialog.close();});dialog.addEventListener('cancel',()=>{if(index<steps.length)save('skipped');});dialog.addEventListener('close',()=>{try{sessionStorage.removeItem(activeKey);}catch{}window.scrollTo({top:oldScroll,behavior:'instant'});if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});});window.addEventListener('resize',()=>{if(dialog.open)position();});window.addEventListener('scroll',()=>{if(dialog.open)position();},{passive:true});
document.getElementById('start-dashboard-tour')?.addEventListener('click',()=>start());
let seen=false;try{const saved=JSON.parse(localStorage.getItem(key)||'null');seen=saved?.version===1&&['completed','skipped'].includes(saved.status);}catch{}
const url=new URL(location.href);const replay=url.searchParams.get('tour')==='1';const requested=url.searchParams.get('tourStep');let continuation=null;
if(requested!==null&&/^-?\d+$/.test(requested)){const n=Number(requested);if(n>=-1&&n<=steps.length)continuation=n;}
if(continuation===null&&!replay){try{const active=JSON.parse(sessionStorage.getItem(activeKey)||'null');if(active?.page===currentPage&&Number.isInteger(active.index)&&active.index>=-1&&active.index<=steps.length)continuation=active.index;}catch{}}
if(replay||requested!==null){url.searchParams.delete('tour');url.searchParams.delete('tourStep');history.replaceState(null,'',url.pathname+url.search+url.hash);}
if(replay)start();else if(continuation!==null)start(continuation);else if(currentPage==='dashboard.html'&&!seen)start();
})();
