# vetclaim_compass
vet claim compass website
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>VetClaim Compass</title>
    <!-- Tailwind CSS via CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Stripe.js -->
    <script src="https://js.stripe.com/v3/"></script>
    <style>
      /* Minimal resets for consistent look */
      body { margin: 0; }
      .section { display: none; }
      .section.active { display: block; }
    </style>
  </head>
  <body class="bg-slate-50 font-sans antialiased">
    <!-- NAVBAR -->
    <nav class="bg-white shadow sticky top-0 z-20">
      <div class="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <span class="text-xl font-semibold text-emerald-700">VetClaim Compass</span>
        <div class="space-x-6 hidden sm:flex">
          <button class="nav-btn text-slate-700 hover:text-emerald-600" data-target="home">Home</button>
          <button class="nav-btn text-slate-700 hover:text-emerald-600" data-target="pricing">Pricing</button>
          <button class="nav-btn text-slate-700 hover:text-emerald-600" data-target="dashboard">Dashboard</button>
        </div>
      </div>
    </nav>
    <!-- HOME -->
    <section id="home" class="section active">
      <div class="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-slate-800">Never miss another VA claim deadline</h1>
        <p class="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
          VetClaim Compass guides you step-by-step, auto-writes your Statement in Support, and texts you when your status changes.
        </p>
        <button class="mt-10 px-8 py-4 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition" data-target="pricing">
          View Plans
        </button>
      </div>
    </section>
    <!-- PRICING -->
    <section id="pricing" class="section">
      <div class="max-w-5xl mx-auto px-6 py-20">
        <h2 class="text-center text-3xl font-semibold text-slate-800 mb-12">Plans & Pricing</h2>
        <div id="plans-grid" class="grid md:grid-cols-3 gap-8"></div>
      </div>
    </section>
    <!-- DASHBOARD -->
    <section id="dashboard" class="section">
      <div class="max-w-6xl mx-auto px-6 py-16">
        <h2 class="text-2xl font-semibold text-slate-800 mb-6">My Dashboard</h2>
        <div class="grid md:grid-cols-3 gap-6">
          <div class="bg-white rounded-2xl shadow p-6 flex flex-col">
            <h3 class="text-slate-600 mb-2">Current Claim Status</h3>
            <span id="status-badge" class="text-xl font-bold text-emerald-700">Pending Intake</span>
          </div>
          <div class="bg-white rounded-2xl shadow p-6 flex flex-col">
            <h3 class="text-slate-600 mb-2">Next Task</h3>
            <span id="next-task" class="text-lg">Finish intake wizard</span>
            <button data-target="intake" class="mt-4 px-4 py-2 rounded-lg bg-emerald-600 text-white">Go to Intake</button>
          </div>
          <div class="bg-white rounded-2xl shadow p-6 flex flex-col">
            <h3 class="text-slate-600 mb-2">Documents</h3>
            <ul id="doc-list" class="text-sm text-slate-700 space-y-2">
              <li>No documents yet.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <!-- INTAKE WIZARD -->
    <section id="intake" class="section bg-white">
      <div class="max-w-xl mx-auto px-6 py-16">
        <h2 class="text-xl font-semibold text-slate-800 mb-8 text-center">Claim Intake Wizard</h2>
        <div id="wizard" class="space-y-6"></div>
        <div class="flex justify-between mt-8">
          <button id="prev-q" class="hidden px-4 py-2 bg-slate-200 rounded-lg">Back</button>
          <button id="next-q" class="px-4 py-2 bg-emerald-600 text-white rounded-lg">Next</button>
        </div>
      </div>
    </section>
    <!-- FOOTER -->
    <footer class="py-8 text-center text-sm text-slate-500 bg-white">
      © 2025 VetClaim Compass • Not legal advice • Privacy • Terms
    </footer>
    <!-- JS -->
    <script>
      // Navigation
      document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
          document.getElementById(btn.dataset.target).classList.add('active');
          window.scrollTo(0,0);
        });
      });
      // Pricing cards
      const plans = [
        { name:'Single-Claim Bundle', desc:'One-time toolkit for a single claim.', price:'$99', unit:'One-time', features:['Intake wizard','AI Statement PDF','Evidence checklist','18-month tracking'], id:'price_single', mode:'payment', btn:'Buy' },
        { name:'Veteran-Plus', desc:'Lifetime tracking & alerts.', price:'$15', unit:'/mo', features:['All Bundle','Buddy-Letter','COLA alerts','Priority support'], id:'price_monthly', mode:'subscription', btn:'Subscribe' },
        { name:'Veteran-Plus Annual', desc:'25% savings.', price:'$135', unit:'/yr', features:['All Vet-Plus','Discount'], id:'price_annual', mode:'subscription', btn:'Subscribe' }
      ];
      const grid = document.getElementById('plans-grid');
      plans.forEach(p=>{
        const card = document.createElement('div');card.className='bg-white rounded-2xl shadow p-8 flex flex-col';
        card.innerHTML=`<h3 class='text-xl font-medium text-slate-800 mb-2'>${p.name}</h3>`+
        `<p class='text-slate-600 mb-6 flex-grow'>${p.desc}</p>`+
        `<div class='text-4xl font-bold text-slate-800 mb-2'>${p.price}</div>`+
        `<span class='text-sm text-slate-500 mb-6'>${p.unit}</span>`+
        `<ul class='text-sm text-slate-600 mb-10'>${p.features.map(f=>`<li>${f}</li>`).join('')}</ul>`+
        `<button class='plan-btn mt-auto py-3 rounded-xl bg-emerald-600 text-white'>${p.btn}</button>`;
        const btn=card.querySelector('.plan-btn');btn.onclick=()=>checkout(p.id,p.mode);
        grid.appendChild(card);
      });
      // Stripe checkout
      const stripe=Stripe('pk_test_REPLACE_WITH_YOUR_KEY');
      const priceMap={price_single:'price_abc123',price_monthly:'price_def456',price_annual:'price_ghi789'};
      async function checkout(id,mode){
        const {error}=await stripe.redirectToCheckout({lineItems:[{price:priceMap[id],quantity:1}],mode,successUrl:location.href+'#dashboard',cancelUrl:location.href});if(error)alert(error.message)}
      // Intake wizard
      const questions=[{key:'condition',q:'What condition are you claiming?'},{key:'onset',q:'When did symptoms start?'},{key:'impact',q:'How does this impact daily life?'}];
      let idx=0,answers={};
      const wizard=document.getElementById('wizard'),prev=document.getElementById('prev-q'),next=document.getElementById('next-q');
      function render(){wizard.innerHTML='';const {q,key}=questions[idx];const label=document.createElement('label');label.textContent=q;label.className='block mb-2 text-slate-700';const input=document.createElement('textarea');input.className='w-full p-3 border rounded-lg';input.value=answers[key]||'';input.oninput=e=>answers[key]=e.target.value;wizard.append(label,input);prev.classList.toggle('hidden',idx===0);next.textContent=idx===questions.length-1?'Finish':'Next';}
      prev.onclick=()=>{if(idx>0){idx--;render()}};
      next.onclick=()=>{if(idx<questions.length-1){idx++;render()}else{localStorage.setItem('claim',JSON.stringify(answers));document.getElementById('doc-list').innerHTML='<li>Statement.pdf</li>';document.getElementById('status-badge').textContent='Ready to File';document.getElementById('next-task').textContent='Await VA status';document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));document.getElementById('dashboard').classList.add('active');}};
      render();
    </script>
  </body>
</html>
