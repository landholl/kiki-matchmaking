import { useState, useEffect } from "react";

const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
document.head.appendChild(link);

const T = {
  bg:"#F9F7F4",white:"#FFFFFF",rose:"#D64E7A",roseSoft:"#FDE8EF",
  gold:"#E8952A",goldSoft:"#FEF3E2",text:"#1A1714",muted:"#7A7269",light:"#C4BFB8",
  border:"rgba(0,0,0,0.07)",borderMed:"rgba(0,0,0,0.11)",
  serif:"'Cormorant Garamond', Georgia, serif",sans:"'Plus Jakarta Sans', -apple-system, sans-serif",
  sh1:"0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)",
  sh2:"0 2px 8px rgba(0,0,0,0.07), 0 12px 40px rgba(0,0,0,0.09)",
  sh3:"0 4px 12px rgba(0,0,0,0.07), 0 20px 60px rgba(0,0,0,0.11)",
  shHov:"0 8px 20px rgba(0,0,0,0.09), 0 28px 72px rgba(0,0,0,0.13)",
};

const STAGES=[
  {id:0,name:"Introduction",sym:"✦",color:"#E8952A",soft:"#FEF3E2",desc:"Kiki introduces two compatible souls with a personal letter.",duration:"Allow 1 week",instruction:"Be specific about what drew you to this match."},
  {id:1,name:"First Letter",sym:"✉",color:"#9B6FE8",soft:"#F3EDFF",desc:"Each person writes a letter. No photos yet — only words.",duration:"Allow 2 weeks",isLetter:true,instruction:"Write as if to a dear friend you've never met."},
  {id:2,name:"The Exchange",sym:"⇌",color:"#2E86E8",soft:"#E8F3FF",desc:"Letters exchanged. Each reads and writes a thoughtful reply.",duration:"Allow 2 weeks",isLetter:true,instruction:"Respond to what genuinely moved you. Ask one real question."},
  {id:3,name:"The Call",sym:"◎",color:"#0D9E86",soft:"#E6F7F4",desc:"A 20-minute phone call — voice only, no video.",duration:"Schedule within 1 week",instruction:"20 minutes is intentional. Leave the call wanting more.",prompts:["What's a small moment this week that made you smile?","What have you been quietly curious about lately?","Describe your ideal free weekend."]},
  {id:4,name:"First Meeting",sym:"◈",color:"#E86A2E",soft:"#FEF0E8",desc:"Coffee or a walk — 45 minutes maximum.",duration:"Within 2 weeks of the call",instruction:"Arrive 5 minutes early. No phones."},
  {id:5,name:"The Courtship",sym:"✿",color:"#D64E7A",soft:"#FDE8EF",desc:"Three intentional dates, each building on the last.",duration:"Over 4–6 weeks",instruction:"Date 1 — Active. Date 2 — Cultural. Date 3 — Intimate."},
  {id:6,name:"The Decision",sym:"◇",color:"#C9A84C",soft:"#F7EEE8",desc:"Each person privately shares their true intentions with Kiki.",duration:"Take all the time you need",instruction:"This conversation is between you and Kiki alone."},
];

const PALS=[
  {bg:"#F3EDFF",fg:"#9B6FE8"},{bg:"#E8F3FF",fg:"#2E86E8"},{bg:"#E6F7F4",fg:"#0D9E86"},
  {bg:"#FEF3E2",fg:"#E8952A"},{bg:"#FDE8EF",fg:"#D64E7A"},{bg:"#FEF0E8",fg:"#E86A2E"},
];

const CLIENTS_0=[
  {id:"c1",fname:"Sophia",lname:"Laurent",gender:"Woman",age:34,city:"New York, NY",job:"Interior Designer",bio:"Lover of art museums, farmers markets, and finding the perfect croissant.",hobbies:["Art & Music","Travel","Wine & Dining"],goal:"Long-term relationship",personality:"Ambivert",pal:0},
  {id:"c2",fname:"Marcus",lname:"Cole",gender:"Man",age:38,city:"Atlanta, GA",job:"Architect",bio:"I design spaces by day and cook elaborate dinners by night.",hobbies:["Cooking","Outdoors","Art & Music"],goal:"Marriage",personality:"Extrovert",pal:1},
  {id:"c3",fname:"Priya",lname:"Nair",gender:"Woman",age:29,city:"Austin, TX",job:"Software Engineer",bio:"Tech nerd who unplugs with hiking and pottery.",hobbies:["Tech","Outdoors","Reading"],goal:"Open to seeing where it goes",personality:"Introvert",pal:2},
  {id:"c4",fname:"David",lname:"Kim",gender:"Man",age:36,city:"Chicago, IL",job:"Photographer",bio:"I chase light for a living and stillness for fun.",hobbies:["Photography","Cooking","Travel"],goal:"Long-term relationship",personality:"Ambivert",pal:3},
  {id:"c5",fname:"Aisha",lname:"Roberts",gender:"Woman",age:31,city:"Miami, FL",job:"Nutritionist",bio:"Obsessed with farmers markets, sunset runs, and reality TV.",hobbies:["Fitness","Cooking","Travel"],goal:"Marriage",personality:"Extrovert",pal:4},
];
const JOURNEYS_0=[
  {id:"j1",c1:"c1",c2:"c2",stage:1,completed:[0],letters:{},created:Date.now()-86400000*12,updated:Date.now()-86400000*3},
  {id:"j2",c1:"c3",c2:"c4",stage:3,completed:[0,1,2],letters:{},created:Date.now()-86400000*44,updated:Date.now()-86400000*1},
];

const getInitials=c=>(c.fname?.[0]||"")+(c.lname?.[0]||"");
const daysAgo=ts=>Math.floor((Date.now()-ts)/86400000);

function Avatar({client,size=44,style={}}) {
  const p=PALS[client.pal%PALS.length];
  return <div style={{width:size,height:size,borderRadius:"50%",background:p.bg,color:p.fg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.32,fontWeight:700,fontFamily:T.sans,flexShrink:0,boxShadow:`0 0 0 2px ${p.fg}44`,...style}}>{getInitials(client)}</div>;
}

function Chip({label,color}) {
  return <span style={{fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:99,background:color+"22",color,fontFamily:T.sans,letterSpacing:"0.03em",border:`1px solid ${color}33`}}>{label}</span>;
}

function PBtn({children,onClick,full,sm,outline,disabled,style={}}) {
  const [h,setH]=useState(false);
  const base=outline
    ?{background:h?"#F0ECE8":"transparent",color:T.muted,border:`1.5px solid ${T.borderMed}`,boxShadow:"none"}
    :{background:disabled?"#ddd":h?"#C13368":"linear-gradient(145deg,#E84B7A,#C73D6A)",color:disabled?"#999":"#fff",border:"none",boxShadow:disabled?"none":h?"0 8px 24px rgba(214,78,122,0.5)":"0 4px 14px rgba(214,78,122,0.35)"};
  return <button onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} onClick={onClick} disabled={disabled}
    style={{...base,borderRadius:12,padding:sm?"9px 18px":"14px 28px",fontSize:sm?13:15,fontWeight:700,fontFamily:T.sans,cursor:disabled?"not-allowed":"pointer",transition:"all 0.2s",width:full?"100%":"auto",letterSpacing:"0.01em",...style}}>{children}</button>;
}

// ── WELCOME — Light, fresh, full screen ───────────────────────
function WelcomeScreen({clients,journeys,go}) {
  const [in_,setIn_]=useState(false);
  useEffect(()=>{setTimeout(()=>setIn_(true),80);},[]);
  const recent=journeys[0];
  const rc1=recent&&clients.find(c=>c.id===recent.c1);
  const rc2=recent&&clients.find(c=>c.id===recent.c2);

  return (
    <div style={{minHeight:"100vh",width:"100%",background:"#F9F6F1",display:"flex",flexDirection:"column",fontFamily:T.sans,position:"relative",overflow:"hidden"}}>

      {/* Big soft color blobs — light and airy */}
      <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}}>
        <div style={{position:"absolute",width:"60vw",height:"60vw",maxWidth:700,maxHeight:700,borderRadius:"50%",background:"radial-gradient(circle,rgba(214,78,122,0.08) 0%,transparent 70%)",top:"-15%",right:"-10%",animation:"b1 14s ease-in-out infinite"}}/>
        <div style={{position:"absolute",width:"45vw",height:"45vw",maxWidth:500,maxHeight:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(232,149,42,0.07) 0%,transparent 70%)",bottom:"-10%",left:"-8%",animation:"b2 17s ease-in-out infinite"}}/>
        <div style={{position:"absolute",width:"25vw",height:"25vw",maxWidth:280,maxHeight:280,borderRadius:"50%",background:"radial-gradient(circle,rgba(155,111,232,0.06) 0%,transparent 70%)",top:"40%",left:"30%",animation:"b3 20s ease-in-out infinite"}}/>
      </div>

      {/* Top nav bar */}
      <div style={{padding:"24px clamp(24px,6vw,80px)",display:"flex",justifyContent:"space-between",alignItems:"center",position:"relative",zIndex:1,opacity:in_?1:0,transition:"opacity 0.5s ease"}}>
        <div style={{fontSize:13,fontWeight:700,letterSpacing:"0.12em",color:T.rose,textTransform:"uppercase",fontFamily:T.sans}}>Kiki's Matchmaking</div>
        <PBtn sm onClick={()=>go("intake")}>+ Add client</PBtn>
      </div>

      {/* Hero */}
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 clamp(24px,6vw,80px) clamp(32px,5vh,60px)",position:"relative",zIndex:1,maxWidth:1100,margin:"0 auto",width:"100%",boxSizing:"border-box"}}>

        {/* Manifesto */}
        <div style={{opacity:in_?1:0,transform:in_?"none":"translateY(20px)",transition:"all 0.7s ease 0.1s",marginBottom:"clamp(12px,2vh,20px)"}}>
          <span style={{fontFamily:T.serif,fontSize:"clamp(22px,3.5vw,44px)",color:T.muted,fontStyle:"italic",fontWeight:400}}>While everyone else swipes,</span>
        </div>
        <div style={{opacity:in_?1:0,transform:in_?"none":"translateY(20px)",transition:"all 0.7s ease 0.15s",marginBottom:"clamp(16px,3vh,32px)"}}>
          <span style={{fontFamily:T.serif,fontSize:"clamp(22px,3.5vw,44px)",color:T.text,fontWeight:700}}>we write letters.</span>
        </div>

        {/* Big brand */}
        <div style={{opacity:in_?1:0,transform:in_?"none":"translateY(20px)",transition:"all 0.7s ease 0.2s",marginBottom:"clamp(20px,3.5vh,40px)"}}>
          <div style={{fontFamily:T.serif,fontSize:"clamp(56px,10vw,130px)",fontWeight:700,color:T.text,lineHeight:0.9,letterSpacing:"-0.03em"}}>Kiki's</div>
          <div style={{fontFamily:T.serif,fontSize:"clamp(56px,10vw,130px)",fontWeight:400,fontStyle:"italic",color:T.rose,lineHeight:0.9,letterSpacing:"-0.03em"}}>Matchmaking</div>
        </div>

        {/* Tagline */}
        <div style={{opacity:in_?1:0,transform:in_?"none":"translateY(20px)",transition:"all 0.7s ease 0.25s",marginBottom:"clamp(24px,4vh,44px)",maxWidth:560}}>
          <p style={{fontFamily:T.serif,fontStyle:"italic",fontSize:"clamp(15px,1.8vw,20px)",color:T.muted,lineHeight:1.75,margin:0,paddingLeft:16,borderLeft:`3px solid ${T.rose}44`}}>
            "Courtship is not old-fashioned. It is the only path to something real. Seven intentional stages — from first letter to final decision."
          </p>
        </div>

        {/* Stage pills */}
        <div style={{opacity:in_?1:0,transform:in_?"none":"translateY(20px)",transition:"all 0.7s ease 0.3s",display:"flex",flexWrap:"wrap",gap:8,marginBottom:"clamp(28px,4.5vh,52px)"}}>
          {STAGES.map(s=>(
            <div key={s.id} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:99,background:s.soft,border:`1.5px solid ${s.color}33`,boxShadow:`0 2px 8px ${s.color}18`}}>
              <span style={{fontSize:13,color:s.color}}>{s.sym}</span>
              <span style={{fontSize:12,fontWeight:600,color:s.color,fontFamily:T.sans,whiteSpace:"nowrap"}}>{s.name}</span>
            </div>
          ))}
        </div>

        {/* Stats + CTA */}
        <div style={{opacity:in_?1:0,transform:in_?"none":"translateY(20px)",transition:"all 0.7s ease 0.35s",display:"flex",alignItems:"center",gap:"clamp(20px,4vw,56px)",flexWrap:"wrap"}}>
          <div style={{display:"flex",gap:"clamp(20px,3.5vw,44px)"}}>
            {[[clients.length,"Clients"],[journeys.length,"Journeys"],[journeys.filter(j=>j.stage===6).length,"Complete"]].map(([n,l])=>(
              <div key={l}>
                <div style={{fontFamily:T.serif,fontWeight:700,fontSize:"clamp(30px,4vw,52px)",color:T.text,lineHeight:1}}>{n}</div>
                <div style={{fontSize:10,color:T.light,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:3,fontFamily:T.sans}}>{l}</div>
              </div>
            ))}
          </div>
          <PBtn onClick={()=>go("home")} style={{fontSize:"clamp(14px,1.5vw,16px)",padding:"clamp(12px,1.5vh,16px) clamp(24px,2.5vw,32px)"}}>View journeys →</PBtn>
        </div>
      </div>

      {/* Floating recent journey card */}
      {rc1&&rc2&&(
        <div style={{position:"absolute",bottom:"clamp(20px,4vh,40px)",right:"clamp(24px,5vw,60px)",zIndex:2,opacity:in_?1:0,transform:in_?"none":"translateY(12px)",transition:"all 0.7s ease 0.5s"}}>
          <div onClick={()=>go("journey",{journey:recent})}
            style={{background:T.white,borderRadius:20,padding:"18px 22px",cursor:"pointer",boxShadow:T.sh3,border:`1px solid ${T.border}`,minWidth:260,transition:"all 0.2s"}}>
            <div style={{fontSize:9,fontWeight:700,color:T.light,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:12}}>Most recent journey</div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <div style={{display:"flex"}}><Avatar client={rc1} size={36}/><div style={{marginLeft:-8}}><Avatar client={rc2} size={36}/></div></div>
              <div>
                <div style={{fontWeight:700,fontSize:13,color:T.text}}>{rc1.fname} & {rc2.fname}</div>
                <div style={{fontSize:11,color:T.muted,marginTop:1}}>{STAGES[recent.stage].name} · Day {daysAgo(recent.created)+1}</div>
              </div>
            </div>
            <div style={{height:3,background:T.bg,borderRadius:99,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${Math.round(recent.stage/(STAGES.length-1)*100)}%`,background:`linear-gradient(90deg,${T.gold},${STAGES[recent.stage].color})`,borderRadius:99}}/>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes b1{0%,100%{transform:translate(0,0)}50%{transform:translate(-20px,20px)}}
        @keyframes b2{0%,100%{transform:translate(0,0)}50%{transform:translate(18px,-18px)}}
        @keyframes b3{0%,100%{transform:translate(0,0)}33%{transform:translate(12px,12px)}66%{transform:translate(-12px,8px)}}
      `}</style>
    </div>
  );
}

function JourneyCard({j,clients,onClick,featured=false}) {
  const [h,setH]=useState(false);
  const c1=clients.find(c=>c.id===j.c1),c2=clients.find(c=>c.id===j.c2);
  if(!c1||!c2) return null;
  const st=STAGES[j.stage],pct=Math.round(j.stage/(STAGES.length-1)*100);
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} onClick={onClick} style={{background:T.white,borderRadius:featured?20:16,border:`1px solid ${h?T.borderMed:T.border}`,boxShadow:h?T.shHov:featured?T.sh3:T.sh2,cursor:"pointer",overflow:"hidden",transform:h?"translateY(-3px)":"none",transition:"all 0.22s ease"}}>
      <div style={{height:5,background:`linear-gradient(90deg,${T.gold},${st.color})`}}/>
      <div style={{padding:featured?"22px":"16px 18px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:featured?16:12}}>
          <div style={{display:"flex",position:"relative",width:featured?72:56}}><Avatar client={c1} size={featured?44:36}/><div style={{position:"absolute",left:featured?28:20}}><Avatar client={c2} size={featured?44:36}/></div></div>
          <div style={{flex:1}}><div style={{fontWeight:700,fontSize:featured?16:14,color:T.text,fontFamily:T.sans}}>{c1.fname} <span style={{color:T.rose}}>+</span> {c2.fname}</div><div style={{fontSize:12,color:T.muted,marginTop:2}}>{c1.city.split(",")[0]} · {c2.city.split(",")[0]}</div></div>
          <Chip label={st.name} color={st.color}/>
        </div>
        {featured&&<p style={{fontFamily:T.serif,fontStyle:"italic",fontSize:14,color:T.muted,lineHeight:1.6,marginBottom:14,padding:"10px 14px",background:st.soft,borderRadius:10,borderLeft:`3px solid ${st.color}`}}>"{st.desc}"</p>}
        <div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:5}}><span style={{color:T.muted,fontWeight:500,fontFamily:T.sans}}>Stage {j.stage+1} of {STAGES.length}</span><span style={{color:st.color,fontWeight:700,fontFamily:T.sans}}>{pct}%</span></div>
          <div style={{height:featured?5:3,background:T.bg,borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${T.gold},${st.color})`,borderRadius:99}}/></div>
        </div>
        {featured&&<div style={{fontSize:12,color:T.light,marginTop:10,fontFamily:T.sans}}>Day {daysAgo(j.created)+1} · Updated {daysAgo(j.updated)===0?"today":`${daysAgo(j.updated)}d ago`}</div>}
      </div>
    </div>
  );
}

function HomeScreen({clients,journeys,go}) {
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",background:T.bg,fontFamily:T.sans}}>
      <div style={{padding:"20px 24px 0",display:"flex",alignItems:"center",justifyContent:"space-between",maxWidth:900,margin:"0 auto",width:"100%",boxSizing:"border-box"}}>
        <div><div style={{fontFamily:T.serif,fontWeight:700,fontSize:24,color:T.text}}>Kiki's <em style={{color:T.rose,fontWeight:400}}>Matchmaking</em></div><div style={{fontSize:12,color:T.muted,marginTop:1}}>Active journeys</div></div>
        <div style={{display:"flex",gap:8}}><PBtn sm outline onClick={()=>go("match")}>New match</PBtn><PBtn sm onClick={()=>go("intake")}>+ Client</PBtn></div>
      </div>
      <div style={{flex:1,overflow:"auto",padding:"20px 24px"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24}}>
            {[[clients.length,"Clients","👤"],[journeys.length,"Journeys","✦"],[journeys.filter(j=>j.stage===6).length,"Complete","♥"]].map(([n,l,ic])=>(
              <div key={l} style={{background:T.white,borderRadius:14,padding:"16px",textAlign:"center",boxShadow:T.sh1,border:`1px solid ${T.border}`}}>
                <div style={{fontSize:20,marginBottom:4}}>{ic}</div>
                <div style={{fontFamily:T.serif,fontWeight:700,fontSize:28,color:T.text,lineHeight:1}}>{n}</div>
                <div style={{fontSize:11,color:T.light,textTransform:"uppercase",letterSpacing:"0.05em",marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
          {journeys.length===0?(<div style={{textAlign:"center",padding:"60px 20px",color:T.muted}}><div style={{fontSize:48,marginBottom:16}}>✦</div><div style={{fontFamily:T.serif,fontSize:24,color:T.text,marginBottom:8}}>No journeys yet</div><PBtn onClick={()=>go("match")}>Create first match →</PBtn></div>):(
            <><div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:12}}>Featured</div>
            <div style={{marginBottom:20}}><JourneyCard featured j={journeys[0]} clients={clients} onClick={()=>go("journey",{journey:journeys[0]})}/></div>
            {journeys.length>1&&<><div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:12}}>All journeys</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>{journeys.map(j=><JourneyCard key={j.id} j={j} clients={clients} onClick={()=>go("journey",{journey:j})}/>)}</div></>}</>
          )}
        </div>
      </div>
      <div style={{borderTop:`1px solid ${T.border}`,background:"rgba(249,247,244,0.95)",backdropFilter:"blur(12px)",display:"flex",padding:"12px 0 14px",justifyContent:"center"}}>
        {[["✦","Journeys",()=>{}],["👤","Clients",()=>go("clients")],["♥","New Match",()=>go("match")]].map(([ic,l,fn])=>(
          <button key={l} onClick={fn} style={{background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",fontFamily:T.sans,padding:"0 32px"}}><span style={{fontSize:20}}>{ic}</span><span style={{fontSize:10,color:T.muted,fontWeight:600,letterSpacing:"0.03em"}}>{l}</span></button>
        ))}
      </div>
    </div>
  );
}

function JourneyDetailScreen({journey:j,clients,go,onUpdate}) {
  const [jou,setJou]=useState(j);
  useEffect(()=>setJou(j),[j]);
  const c1=clients.find(c=>c.id===jou.c1),c2=clients.find(c=>c.id===jou.c2);
  if(!c1||!c2) return null;
  const st=STAGES[jou.stage];
  const isSent=cid=>!!jou.letters?.[`${cid}_${jou.stage}_sent`];
  const bothSent=isSent(c1.id)&&isSent(c2.id);
  function advance(){if(jou.stage<STAGES.length-1){const upd={...jou,stage:jou.stage+1,completed:[...jou.completed,jou.stage],updated:Date.now()};setJou(upd);onUpdate(upd);}}
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",background:T.bg,fontFamily:T.sans}}>
      <div style={{padding:"16px 24px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${T.border}`,background:T.white,boxShadow:T.sh1}}>
        <button onClick={()=>go("home")} style={{background:"none",border:`1.5px solid ${T.borderMed}`,borderRadius:9,padding:"7px 13px",fontSize:13,cursor:"pointer",fontFamily:T.sans,color:T.muted,fontWeight:600}}>← Back</button>
        <div style={{flex:1}}><div style={{fontWeight:700,fontSize:15,color:T.text}}>{c1.fname} & {c2.fname}</div><div style={{fontSize:12,color:T.muted}}>Day {daysAgo(jou.created)+1}</div></div>
        <Chip label={st.name} color={st.color}/>
      </div>
      <div style={{flex:1,overflow:"auto"}}>
        <div style={{maxWidth:700,margin:"0 auto",padding:"0 24px"}}>
          <div style={{background:T.white,padding:"24px",display:"flex",alignItems:"center",gap:16,borderBottom:`1px solid ${T.border}`}}>
            <div style={{display:"flex",alignItems:"center"}}><Avatar client={c1} size={56}/><div style={{width:36,height:36,borderRadius:"50%",background:T.roseSoft,border:`2px solid ${T.rose}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,margin:"0 -6px",zIndex:1,boxShadow:T.sh1}}>♥</div><Avatar client={c2} size={56}/></div>
            <div style={{flex:1}}><div style={{fontFamily:T.serif,fontWeight:700,fontSize:22,color:T.text}}>{c1.fname} {c1.lname} <span style={{fontSize:15,fontWeight:400,color:T.muted}}>& </span>{c2.fname} {c2.lname}</div><div style={{fontSize:12,color:T.muted,marginTop:2}}>{c1.city.split(",")[0]} · {c2.city.split(",")[0]}</div></div>
          </div>
          <div style={{background:T.white,padding:"20px 24px",borderBottom:`1px solid ${T.border}`,overflowX:"auto"}}>
            <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:14}}>Journey progress</div>
            <div style={{display:"flex",alignItems:"flex-start",minWidth:"max-content"}}>
              {STAGES.map((s,i)=>{
                const done=jou.completed.includes(s.id),active=s.id===jou.stage;
                return(<div key={s.id} style={{display:"flex",alignItems:"center"}}><div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,width:70}}><div style={{width:active?38:28,height:active?38:28,borderRadius:"50%",background:done?s.color:active?s.soft:T.bg,border:done?"none":active?`2.5px solid ${s.color}`:`1.5px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:active?16:11,color:done?"#fff":active?s.color:T.light,boxShadow:active?`0 4px 16px ${s.color}44,0 0 0 4px ${s.color}18`:"none",transition:"all 0.3s",fontWeight:700,flexShrink:0}}>{done?"✓":s.sym}</div><div style={{fontSize:9,fontWeight:700,color:active?s.color:done?T.muted:T.light,letterSpacing:"0.03em",textAlign:"center",textTransform:"uppercase",whiteSpace:"nowrap"}}>{s.name}</div></div>{i<STAGES.length-1&&<div style={{width:18,height:2,background:jou.completed.includes(s.id)?s.color:T.bg,margin:"0 0 18px",flexShrink:0,borderRadius:99}}/>}</div>);
              })}
            </div>
          </div>
          <div style={{padding:"24px 0"}}>
            <div style={{background:T.white,borderRadius:20,overflow:"hidden",boxShadow:T.sh2,border:`1.5px solid ${st.color}33`}}>
              <div style={{height:5,background:`linear-gradient(90deg,${T.gold},${st.color})`}}/>
              <div style={{padding:"22px"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}><div style={{width:36,height:36,borderRadius:"50%",background:st.soft,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:st.color,border:`1.5px solid ${st.color}44`}}>{st.sym}</div><div><div style={{fontWeight:700,fontSize:15,color:T.text}}>{st.name}</div><div style={{fontSize:12,color:T.muted}}>{st.duration}</div></div></div>
                <p style={{fontFamily:T.serif,fontStyle:"italic",fontSize:15,color:T.muted,lineHeight:1.7,marginBottom:14,paddingLeft:14,borderLeft:`2px solid ${st.color}55`}}>"{st.desc}"</p>
                <p style={{fontSize:13,color:T.muted,lineHeight:1.65,marginBottom:16}}>{st.instruction}</p>
                {st.prompts&&<div style={{background:st.soft,borderRadius:12,padding:"14px 16px",marginBottom:16}}><div style={{fontSize:11,fontWeight:700,color:st.color,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:10}}>Conversation prompts</div>{st.prompts.map((p,i)=><div key={i} style={{display:"flex",gap:10,marginBottom:8,fontSize:13,color:T.text,lineHeight:1.5}}><span style={{color:st.color,fontWeight:700,flexShrink:0}}>{i+1}.</span>{p}</div>)}</div>}
                {st.isLetter&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>{[c1,c2].map(cl=>{const sent=isSent(cl.id);return(<div key={cl.id} style={{background:sent?st.soft:T.bg,borderRadius:14,padding:"14px",border:`1.5px solid ${sent?st.color+"55":T.border}`}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><Avatar client={cl} size={30}/><div><div style={{fontSize:13,fontWeight:700,color:T.text}}>{cl.fname}</div>{sent?<span style={{fontSize:11,color:st.color,fontWeight:600}}>Sent ✓</span>:<span style={{fontSize:11,color:T.light}}>Pending</span>}</div></div><button onClick={()=>go("letter",{journey:jou,clientId:cl.id})} style={{width:"100%",padding:"8px 0",borderRadius:9,border:`1.5px solid ${st.color}55`,background:sent?st.color+"22":"transparent",color:st.color,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:T.sans}}>{sent?"View letter ✎":"Open Letter Studio →"}</button></div>);})}</div>}
                {jou.stage<STAGES.length-1?<PBtn full onClick={advance} disabled={st.isLetter&&!bothSent}>{st.isLetter&&!bothSent?"Both letters must be sent to advance":`Advance to ${STAGES[jou.stage+1]?.name} →`}</PBtn>:<div style={{textAlign:"center",padding:"14px",background:T.goldSoft,borderRadius:12,border:`1px solid ${T.gold}44`,fontFamily:T.serif,fontSize:18,color:T.gold,fontWeight:600}}>✦ Journey Complete</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LetterStudioScreen({journey,clientId,clients,go,onUpdate}) {
  const client=clients.find(c=>c.id===clientId);
  const partner=clients.find(c=>(c.id===journey.c1||c.id===journey.c2)&&c.id!==clientId);
  const st=STAGES[journey.stage];
  const [text,setText]=useState(journey.letters?.[`${clientId}_${journey.stage}`]||"");
  const [loading,setLoading]=useState(false);
  const [preview,setPreview]=useState(false);
  const [sent,setSent]=useState(!!journey.letters?.[`${clientId}_${journey.stage}_sent`]);
  const p=PALS[client?.pal%PALS.length];
  if(!client) return null;
  async function aiDraft(){
    setLoading(true);
    try{
      const partnLetter=journey.letters?.[`${partner?.id}_${journey.stage-1}`]||"";
      const isReply=journey.stage===2;
      const sys="You are an eloquent letter-writing assistant for Kiki's Matchmaking. Help clients write genuine, heartfelt letters. 3-4 paragraphs. Personal but not overly revealing. Warm and curious. No clichés. First person. Sign off with just their first name.";
      const usr=isReply?`Write a reply letter for ${client.fname} ${client.lname}, ${client.age}, ${client.job} from ${client.city}. About them: "${client.bio}". Interests: ${client.hobbies?.join(", ")}. They received:\n\n"${partnLetter||"[A warm introductory letter]"}"\n\nReply warmly, share something genuine, ask one real question.`:`Write a first letter for ${client.fname} ${client.lname}, ${client.age}, ${client.job} from ${client.city}. About them: "${client.bio}". Interests: ${client.hobbies?.join(", ")}. Personality: ${client.personality}. Looking for: ${client.goal}.`;
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,system:sys,messages:[{role:"user",content:usr}]})});
      const data=await res.json();
      setText(data.content?.map(b=>b.text||"").join("\n")||"");
    }catch{setText("Couldn't connect. Please write your letter manually.");}
    setLoading(false);
  }
  function markSent(){const key=`${clientId}_${journey.stage}`,sentKey=`${key}_sent`;onUpdate({...journey,letters:{...journey.letters,[key]:text,[sentKey]:true},updated:Date.now()});setSent(true);}
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",background:T.bg,fontFamily:T.sans}}>
      <div style={{padding:"16px 24px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${T.border}`,background:T.white,boxShadow:T.sh1}}>
        <button onClick={()=>go("journey",{journey})} style={{background:"none",border:`1.5px solid ${T.borderMed}`,borderRadius:9,padding:"7px 13px",fontSize:13,cursor:"pointer",fontFamily:T.sans,color:T.muted,fontWeight:600}}>← Back</button>
        <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14,color:T.text}}>Letter Studio — {client.fname}</div><div style={{fontSize:12,color:T.muted}}>{st.name}</div></div>
        <div style={{display:"flex",gap:8}}><PBtn sm outline onClick={()=>setPreview(v=>!v)}>{preview?"✎ Edit":"👁 Preview"}</PBtn>{!sent?<PBtn sm onClick={markSent}>Mark as Sent ✓</PBtn>:<Chip label="Sent ✓" color={st.color}/>}</div>
      </div>
      <div style={{flex:1,overflow:"auto",padding:"32px 24px",display:"flex",justifyContent:"center"}}>
        <div style={{width:"100%",maxWidth:600}}>
          <div style={{background:T.white,borderRadius:20,boxShadow:`0 4px 12px rgba(0,0,0,0.07),0 20px 60px rgba(0,0,0,0.10)`,border:`1px solid ${T.border}`,overflow:"hidden",minHeight:400}}>
            <div style={{height:4,background:`linear-gradient(90deg,${p.fg},${st.color})`}}/>
            <div style={{padding:"28px 32px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,paddingBottom:16,borderBottom:`1px solid ${T.border}`}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}><Avatar client={client} size={36}/><div><div style={{fontWeight:700,fontSize:13,color:T.text}}>{client.fname} {client.lname}</div><div style={{fontSize:11,color:T.muted}}>{client.job} · {client.city}</div></div></div>
                <div style={{fontSize:12,color:T.light}}>{new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</div>
              </div>
              {preview?<div style={{fontFamily:T.serif,fontSize:17,lineHeight:2.1,color:T.text,whiteSpace:"pre-wrap",minHeight:280}}>{text||<span style={{color:T.light,fontStyle:"italic"}}>Your letter will appear here...</span>}</div>:<div style={{position:"relative"}}><div style={{position:"absolute",left:0,top:0,bottom:0,width:2.5,background:p.fg+"44",borderRadius:99}}/><textarea value={text} onChange={e=>setText(e.target.value)} placeholder={`Begin your letter here...\n\n${st.instruction}`} style={{width:"100%",minHeight:320,background:"transparent",border:"none",outline:"none",fontFamily:T.serif,fontSize:17,lineHeight:2.1,color:T.text,resize:"none",padding:"0 0 0 18px",boxSizing:"border-box"}}/></div>}
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:16,padding:"14px 18px",background:T.white,borderRadius:14,boxShadow:T.sh1,border:`1px solid ${T.border}`}}>
            <span style={{fontSize:12,color:T.light}}>{text.split(" ").filter(Boolean).length} words</span>
            <button onClick={aiDraft} disabled={loading} style={{display:"flex",alignItems:"center",gap:8,background:loading?T.bg:`linear-gradient(135deg,${T.gold},#D4821E)`,border:"none",borderRadius:10,padding:"10px 20px",cursor:loading?"not-allowed":"pointer",fontFamily:T.sans,fontSize:13,fontWeight:700,color:loading?T.muted:"#fff",boxShadow:loading?"none":"0 4px 12px rgba(232,149,42,0.3)",transition:"all 0.2s"}}>
              {loading?<><span style={{display:"inline-block",animation:"spin 1s linear infinite"}}>✦</span> Drafting...</>:"✦ AI Draft"}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}textarea::placeholder{color:${T.light};font-family:${T.serif};font-style:italic;font-size:16px}`}</style>
    </div>
  );
}

const STEPS=["Basics","Preferences","Lifestyle","Review"];
function IntakeScreen({go,onAdd}) {
  const [step,setStep]=useState(0);
  const [f,setF]=useState({fname:"",lname:"",dob:"",gender:"",email:"",phone:"",city:"",job:"",bio:"",agemin:"",agemax:"",prefGender:[],goal:"",dealbreakers:[],hobbies:[],personality:"",kids:""});
  const u=(k,v)=>setF(p=>({...p,[k]:v}));
  const tog=(k,v)=>setF(p=>({...p,[k]:p[k].includes(v)?p[k].filter(x=>x!==v):[...p[k],v]}));
  const one=(k,v)=>setF(p=>({...p,[k]:p[k]===v?"":v}));
  const age=dob=>{if(!dob)return null;const a=Math.floor((Date.now()-new Date(dob))/(365.25*24*3600*1000));return a>=18&&a<100?a:null;};
  const iS={padding:"11px 14px",borderRadius:10,border:`1.5px solid ${T.border}`,background:T.white,color:T.text,fontSize:14,fontFamily:T.sans,outline:"none",width:"100%",boxSizing:"border-box",boxShadow:T.sh1};
  const Fld=({label,children})=><div style={{display:"flex",flexDirection:"column",gap:5}}><label style={{fontSize:11,fontWeight:700,color:T.muted,letterSpacing:"0.06em",textTransform:"uppercase"}}>{label}</label>{children}</div>;
  const Chp=({label,on,onClick})=><button onClick={onClick} style={{padding:"7px 15px",borderRadius:99,border:on?`1.5px solid ${T.rose}66`:`1.5px solid ${T.border}`,background:on?T.roseSoft:T.white,color:on?T.rose:T.muted,fontSize:12,fontWeight:on?700:400,cursor:"pointer",fontFamily:T.sans,transition:"all 0.15s",boxShadow:T.sh1}}>{label}</button>;
  const content=[
    <div style={{display:"flex",flexDirection:"column",gap:13}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}><Fld label="First name"><input style={iS} value={f.fname} onChange={e=>u("fname",e.target.value)} placeholder="Maria"/></Fld><Fld label="Last name"><input style={iS} value={f.lname} onChange={e=>u("lname",e.target.value)} placeholder="Johnson"/></Fld><Fld label="Date of birth"><input style={iS} type="date" value={f.dob} onChange={e=>u("dob",e.target.value)}/></Fld><Fld label="Gender"><select style={iS} value={f.gender} onChange={e=>u("gender",e.target.value)}><option value="">Select...</option>{["Woman","Man","Non-binary","Other"].map(g=><option key={g}>{g}</option>)}</select></Fld><Fld label="Email"><input style={iS} type="email" value={f.email} onChange={e=>u("email",e.target.value)} placeholder="you@email.com"/></Fld><Fld label="Phone"><input style={iS} value={f.phone} onChange={e=>u("phone",e.target.value)} placeholder="+1 555 000 0000"/></Fld><Fld label="City"><input style={iS} value={f.city} onChange={e=>u("city",e.target.value)} placeholder="New York, NY"/></Fld><Fld label="Occupation"><input style={iS} value={f.job} onChange={e=>u("job",e.target.value)} placeholder="Designer..."/></Fld></div><Fld label="About you"><textarea style={{...iS,minHeight:86,resize:"vertical"}} value={f.bio} onChange={e=>u("bio",e.target.value)} placeholder="Share your world in your own words..."/></Fld></div>,
    <div style={{display:"flex",flexDirection:"column",gap:18}}><Fld label="Interested in"><div style={{display:"flex",flexWrap:"wrap",gap:7}}>{["Women","Men","Non-binary","Open to all"].map(g=><Chp key={g} label={g} on={f.prefGender.includes(g)} onClick={()=>tog("prefGender",g)}/>)}</div></Fld><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}><Fld label="Min age"><input style={iS} type="number" value={f.agemin} onChange={e=>u("agemin",e.target.value)} placeholder="28"/></Fld><Fld label="Max age"><input style={iS} type="number" value={f.agemax} onChange={e=>u("agemax",e.target.value)} placeholder="45"/></Fld></div><Fld label="Relationship goal"><div style={{display:"flex",flexWrap:"wrap",gap:7}}>{["Long-term relationship","Marriage","Companionship","Open to it"].map(g=><Chp key={g} label={g} on={f.goal===g} onClick={()=>one("goal",g)}/>)}</div></Fld><Fld label="Deal-breakers"><div style={{display:"flex",flexWrap:"wrap",gap:7}}>{["Smoking","Heavy drinking","No pets","Doesn't want kids","Wants kids","Strong religion"].map(d=><Chp key={d} label={d} on={f.dealbreakers.includes(d)} onClick={()=>tog("dealbreakers",d)}/>)}</div></Fld></div>,
    <div style={{display:"flex",flexDirection:"column",gap:18}}><Fld label="Interests & hobbies"><div style={{display:"flex",flexWrap:"wrap",gap:7}}>{["Travel","Cooking","Fitness","Art & Music","Outdoors","Reading","Tech","Spirituality","Photography","Sports","Film & TV","Dance","Wine & Dining"].map(h=><Chp key={h} label={h} on={f.hobbies.includes(h)} onClick={()=>tog("hobbies",h)}/>)}</div></Fld><Fld label="Personality"><div style={{display:"flex",flexWrap:"wrap",gap:7}}>{["Introvert","Extrovert","Ambivert","Adventurous","Homebody","Spontaneous","Planner"].map(p=><Chp key={p} label={p} on={f.personality===p} onClick={()=>one("personality",p)}/>)}</div></Fld><Fld label="Children"><div style={{display:"flex",flexWrap:"wrap",gap:7}}>{["Have kids","No kids","Want kids","Don't want kids","Open to discussing"].map(k=><Chp key={k} label={k} on={f.kids===k} onClick={()=>one("kids",k)}/>)}</div></Fld></div>,
    <div style={{display:"flex",flexDirection:"column",gap:10}}>{[["👤 Personal",[["Name",`${f.fname} ${f.lname}`],["Age",age(f.dob)?`${age(f.dob)} yrs`:"—"],["Gender",f.gender||"—"],["Email",f.email||"—"],["City",f.city||"—"],["Job",f.job||"—"]]],["💑 Preferences",[["Interested in",f.prefGender.join(", ")||"—"],["Age range",f.agemin&&f.agemax?`${f.agemin}–${f.agemax}`:"—"],["Goal",f.goal||"—"]]],["🌿 Lifestyle",[["Hobbies",f.hobbies.slice(0,4).join(", ")||"—"],["Personality",f.personality||"—"],["Kids",f.kids||"—"]]]].map(([title,rows])=>(<div key={title} style={{background:T.white,borderRadius:14,padding:"14px 16px",boxShadow:T.sh1,border:`1px solid ${T.border}`}}><div style={{fontSize:11,fontWeight:700,color:T.muted,letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:10}}>{title}</div>{rows.map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${T.border}`,fontSize:13}}><span style={{color:T.muted}}>{k}</span><span style={{color:T.text,fontWeight:500,maxWidth:"60%",textAlign:"right"}}>{v}</span></div>)}</div>))}</div>
  ];
  function submit(){onAdd({id:"c"+Date.now(),pal:Math.floor(Math.random()*PALS.length),fname:f.fname||"New",lname:f.lname||"Client",gender:f.gender,age:age(f.dob),email:f.email,city:f.city,job:f.job,bio:f.bio,hobbies:f.hobbies,goal:f.goal,personality:f.personality,kids:f.kids});go("home");}
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",background:T.bg,fontFamily:T.sans}}>
      <div style={{padding:"16px 24px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${T.border}`,background:T.white,boxShadow:T.sh1}}>
        <button onClick={()=>step===0?go("home"):setStep(s=>s-1)} style={{background:"none",border:`1.5px solid ${T.borderMed}`,borderRadius:9,padding:"7px 13px",fontSize:13,cursor:"pointer",fontFamily:T.sans,color:T.muted,fontWeight:600}}>{step===0?"✕":"←"}</button>
        <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14,color:T.text}}>{STEPS[step]}</div><div style={{display:"flex",gap:4,marginTop:5}}>{STEPS.map((_,i)=><div key={i} style={{height:3,flex:1,borderRadius:99,background:i<=step?T.rose:T.border,transition:"background 0.3s"}}/>)}</div></div>
        <div style={{fontSize:12,color:T.muted,fontWeight:600}}>{step+1}/{STEPS.length}</div>
      </div>
      <div style={{flex:1,overflow:"auto",padding:"20px 24px"}}><div style={{maxWidth:600,margin:"0 auto"}}>{content[step]}</div></div>
      <div style={{padding:"16px 24px",borderTop:`1px solid ${T.border}`,background:T.white}}><div style={{maxWidth:600,margin:"0 auto"}}>{step<STEPS.length-1?<PBtn full onClick={()=>setStep(s=>s+1)}>Continue →</PBtn>:<PBtn full onClick={submit}>✦ Submit Profile</PBtn>}</div></div>
    </div>
  );
}

function NewMatchScreen({clients,journeys,go,onCreate}) {
  const [s1,setS1]=useState(""),[s2,setS2]=useState("");
  const c1=clients.find(c=>c.id===s1),c2=clients.find(c=>c.id===s2);
  const paired=new Set(journeys.flatMap(j=>[j.c1,j.c2]));
  const avail=clients.filter(c=>!paired.has(c.id));
  const iS={padding:"11px 14px",borderRadius:10,border:`1.5px solid ${T.border}`,background:T.white,color:T.text,fontSize:14,fontFamily:T.sans,outline:"none",width:"100%",boxSizing:"border-box",boxShadow:T.sh1};
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",background:T.bg,fontFamily:T.sans}}>
      <div style={{padding:"18px 24px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${T.border}`,background:T.white,boxShadow:T.sh1}}><button onClick={()=>go("home")} style={{background:"none",border:`1.5px solid ${T.borderMed}`,borderRadius:9,padding:"7px 13px",fontSize:13,cursor:"pointer",fontFamily:T.sans,color:T.muted,fontWeight:600}}>← Back</button><div style={{fontFamily:T.serif,fontWeight:700,fontSize:20,color:T.text}}>Create a Match</div></div>
      <div style={{flex:1,overflow:"auto",padding:"24px"}}><div style={{maxWidth:560,margin:"0 auto"}}>
        <p style={{fontFamily:T.serif,fontStyle:"italic",fontSize:16,color:T.muted,lineHeight:1.7,marginBottom:24}}>"Every great love story begins with an introduction. Choose wisely."</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:10,alignItems:"end",marginBottom:20}}><div><div style={{fontSize:11,fontWeight:700,color:T.muted,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:6}}>First person</div><select style={iS} value={s1} onChange={e=>{setS1(e.target.value);if(e.target.value===s2)setS2("");}}><option value="">Select client...</option>{avail.map(c=><option key={c.id} value={c.id}>{c.fname} {c.lname} · {c.city}</option>)}</select></div><div style={{fontSize:22,color:T.rose,paddingBottom:8,textAlign:"center"}}>♥</div><div><div style={{fontSize:11,fontWeight:700,color:T.muted,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:6}}>Second person</div><select style={iS} value={s2} onChange={e=>setS2(e.target.value)}><option value="">Select client...</option>{avail.filter(c=>c.id!==s1).map(c=><option key={c.id} value={c.id}>{c.fname} {c.lname} · {c.city}</option>)}</select></div></div>
        {c1&&c2&&<div style={{background:T.white,borderRadius:18,padding:"20px",boxShadow:T.sh2,border:`1px solid ${T.border}`,marginBottom:20,display:"flex",alignItems:"center",gap:14}}><Avatar client={c1} size={52}/><div style={{flex:1,textAlign:"center"}}><div style={{fontSize:20,color:T.rose,marginBottom:4}}>✦</div><div style={{fontSize:12,color:T.muted}}>Will begin with Introduction stage</div></div><Avatar client={c2} size={52}/></div>}
        <PBtn full onClick={()=>{if(s1&&s2&&s1!==s2){onCreate({id:"j"+Date.now(),c1:s1,c2:s2,stage:0,completed:[],letters:{},created:Date.now(),updated:Date.now()});go("home");}}} disabled={!s1||!s2||s1===s2}>✦ Begin the Journey</PBtn>
      </div></div>
    </div>
  );
}

function ClientsScreen({clients,journeys,go}) {
  const paired=new Set(journeys.flatMap(j=>[j.c1,j.c2]));
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",background:T.bg,fontFamily:T.sans}}>
      <div style={{padding:"18px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${T.border}`,background:T.white,boxShadow:T.sh1}}><div><button onClick={()=>go("home")} style={{background:"none",border:"none",fontSize:13,cursor:"pointer",color:T.muted,fontFamily:T.sans,fontWeight:600,padding:0,marginBottom:2,display:"block"}}>← Back</button><div style={{fontFamily:T.serif,fontWeight:700,fontSize:20,color:T.text}}>All Clients</div></div><PBtn sm onClick={()=>go("intake")}>+ Add client</PBtn></div>
      <div style={{flex:1,overflow:"auto",padding:"20px 24px"}}><div style={{maxWidth:700,margin:"0 auto",display:"flex",flexDirection:"column",gap:10}}>{clients.map(c=>{const j=journeys.find(j=>j.c1===c.id||j.c2===c.id);const st=j&&STAGES[j.stage];return(<div key={c.id} style={{background:T.white,borderRadius:16,padding:"16px",boxShadow:T.sh1,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:12}}><Avatar client={c} size={48}/><div style={{flex:1}}><div style={{fontWeight:700,fontSize:14,color:T.text}}>{c.fname} {c.lname}</div><div style={{fontSize:12,color:T.muted,marginTop:1}}>{c.city} · {c.job}</div></div>{st?<Chip label={st.name} color={st.color}/>:<span style={{fontSize:11,color:T.light,background:T.bg,padding:"4px 10px",borderRadius:99,border:`1px solid ${T.border}`}}>Unmatched</span>}</div>);})}</div></div>
    </div>
  );
}

function InstallBanner({onInstall,onDismiss}) {
  return (
    <div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",zIndex:1000,width:"calc(100% - 48px)",maxWidth:480}}>
      <div style={{background:T.white,borderRadius:20,padding:"16px 20px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",border:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:14}}>
        <div style={{width:48,height:48,borderRadius:14,background:"linear-gradient(145deg,#E84B7A,#C73D6A)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0,boxShadow:"0 4px 12px rgba(214,78,122,0.35)"}}>♥</div>
        <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14,color:T.text,fontFamily:T.sans,marginBottom:2}}>Add to Home Screen</div><div style={{fontSize:12,color:T.muted,fontFamily:T.sans}}>Open Kiki's like a real app</div></div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={onDismiss} style={{background:"none",border:`1.5px solid ${T.border}`,borderRadius:10,padding:"8px 12px",fontSize:12,cursor:"pointer",color:T.muted,fontFamily:T.sans,fontWeight:600}}>Not now</button>
          <PBtn sm onClick={onInstall}>Install ♥</PBtn>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [clients,setClients]=useState([]);
  const [journeys,setJourneys]=useState([]);
  const [loaded,setLoaded]=useState(false);
  const [screen,setScreen]=useState({name:"welcome",ctx:null});
  const [fade,setFade]=useState(true);
  const [toast,setToast]=useState("");
  const [installPrompt,setInstallPrompt]=useState(null);
  const [showInstall,setShowInstall]=useState(false);

  useEffect(()=>{
    try{
      const c=JSON.parse(localStorage.getItem("kiki3_clients")||"null");
      const j=JSON.parse(localStorage.getItem("kiki3_journeys")||"null");
      setClients(c&&c.length?c:CLIENTS_0);
      setJourneys(j&&j.length?j:JOURNEYS_0);
    }catch{setClients(CLIENTS_0);setJourneys(JOURNEYS_0);}
    setLoaded(true);
    const handler=e=>{e.preventDefault();setInstallPrompt(e);setShowInstall(true);};
    window.addEventListener("beforeinstallprompt",handler);
    return()=>window.removeEventListener("beforeinstallprompt",handler);
  },[]);

  useEffect(()=>{if(loaded)try{localStorage.setItem("kiki3_clients",JSON.stringify(clients));}catch{}},[clients,loaded]);
  useEffect(()=>{if(loaded)try{localStorage.setItem("kiki3_journeys",JSON.stringify(journeys));}catch{}},[journeys,loaded]);

  async function handleInstall(){if(!installPrompt)return;installPrompt.prompt();const{outcome}=await installPrompt.userChoice;if(outcome==="accepted")setShowInstall(false);setInstallPrompt(null);}
  function go(name,ctx=null){setFade(false);setTimeout(()=>{setScreen({name,ctx});setFade(true);},180);}
  function toast_(msg){setToast(msg);setTimeout(()=>setToast(""),2500);}
  function addClient(c){setClients(p=>[c,...p]);toast_("Client added ✓");}
  function addJourney(j){setJourneys(p=>[j,...p]);toast_("Journey started ✓");}
  function updateJourney(j){setJourneys(p=>p.map(x=>x.id===j.id?j:x));}

  const {name,ctx}=screen;
  const currentJourney=ctx?.journey?(journeys.find(j=>j.id===ctx.journey.id)||ctx.journey):null;

  return (
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:T.sans,position:"relative"}}>
      {toast&&<div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:T.text,color:T.white,borderRadius:99,padding:"10px 22px",fontSize:13,fontWeight:600,zIndex:9999,whiteSpace:"nowrap",fontFamily:T.sans,boxShadow:T.sh2}}>{toast}</div>}
      {showInstall&&<InstallBanner onInstall={handleInstall} onDismiss={()=>setShowInstall(false)}/>}
      <div style={{minHeight:"100vh",opacity:fade?1:0,transform:fade?"none":"translateY(6px)",transition:"opacity 0.18s ease,transform 0.18s ease"}}>
        {name==="welcome"&&<WelcomeScreen clients={clients} journeys={journeys} go={go}/>}
        {name==="home"&&<div style={{height:"100vh"}}><HomeScreen clients={clients} journeys={journeys} go={go}/></div>}
        {name==="journey"&&currentJourney&&<div style={{height:"100vh"}}><JourneyDetailScreen journey={currentJourney} clients={clients} go={go} onUpdate={updateJourney}/></div>}
        {name==="letter"&&currentJourney&&<div style={{height:"100vh"}}><LetterStudioScreen journey={currentJourney} clientId={ctx.clientId} clients={clients} go={go} onUpdate={updateJourney}/></div>}
        {name==="intake"&&<div style={{height:"100vh"}}><IntakeScreen go={go} onAdd={addClient}/></div>}
        {name==="match"&&<div style={{height:"100vh"}}><NewMatchScreen clients={clients} journeys={journeys} go={go} onCreate={addJourney}/></div>}
        {name==="clients"&&<div style={{height:"100vh"}}><ClientsScreen clients={clients} journeys={journeys} go={go}/></div>}
      </div>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{overflow-x:hidden}input:focus,textarea:focus,select:focus{border-color:${T.rose}88!important;outline:none}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.15);border-radius:99px}textarea::placeholder{color:${T.light};font-style:italic}`}</style>
    </div>
  );
}
