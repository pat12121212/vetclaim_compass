<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>VetClaim Compass</title>
    <!-- Google Font: Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet"/>
    <!-- Tailwind CSS via CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: '#047857',
              secondary: '#065f46'
            },
            fontFamily: {
              sans: ['Inter', 'sans-serif'],
            }
          }
        }
      }
    </script>
    <!-- Stripe.js -->
    <script src="https://js.stripe.com/v3/"></script>
    <style>
      body { font-family: 'Inter', sans-serif; }
      .section { display: none; }
      .section.active { display: block; }
      /* Smooth scroll behavior */
      html { scroll-behavior: smooth; }
    </style>
  </head>
  <body class="bg-gray-50 antialiased">
    <!-- NAVBAR -->
    <nav class="bg-white shadow-md fixed w-full z-30">
      <div class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#home" class="text-xl font-bold text-primary">VetClaim Compass</a>
        <div class="hidden md:flex space-x-8">
          <a href="#home" class="nav-link text-gray-700 hover:text-primary">Home</a>
          <a href="#pricing" class="nav-link text-gray-700 hover:text-primary">Pricing</a>
          <a href="#dashboard" class="nav-link text-gray-700 hover:text-primary">Dashboard</a>
        </div>
        <button id="mobile-menu-btn" class="md:hidden text-gray-700 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <div id="mobile-menu" class="hidden md:hidden bg-white px-6 pb-4">
        <a href="#home" class="block py-2 text-gray-700 hover:text-primary">Home</a>
        <a href="#pricing" class="block py-2 text-gray-700 hover:text-primary">Pricing</a>
        <a href="#dashboard" class="block py-2 text-gray-700 hover:text-primary">Dashboard</a>
      </div>
    </nav>

    <!-- HOME SECTION -->
    <section id="home" class="section active pt-24">
      <div class="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 class="text-5xl font-extrabold text-gray-800 leading-tight">
          Never miss another <span class="text-primary">VA claim</span> deadline
        </h1>
        <p class="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          VetClaim Compass guides you step-by-step, generates your Statement in Support PDF, and notifies you when your claim status changes.
        </p>
        <button
          class="mt-10 px-8 py-4 rounded-full bg-primary text-white hover:bg-secondary transition"
          data-target="pricing"
        >
          View Plans
        </button>
      </div>
    </section>

    <!-- PRICING SECTION -->
    <section id="pricing" class="section pt-24">
      <div class="max-w-5xl mx-auto px-6 py-20">
        <h2 class="text-center text-3xl font-bold text-gray-800 mb-12">
          Choose your plan
        </h2>
        <div id="plans-grid" class="grid gap-8 md:grid-cols-3">
          <!-- Cards populated by JS -->
        </div>
      </div>
    </section>

    <!-- DASHBOARD SECTION -->
    <section id="dashboard" class="section pt-24">
      <div class="max-w-6xl mx-auto px-6 py-16">
        <h2 class="text-3xl font-bold text-gray-800 mb-8">My Dashboard</h2>
        <div class="grid gap-6 md:grid-cols-3">
          <!-- Status Card -->
          <div class="bg-white rounded-2xl shadow-md p-6">
            <h3 class="text-gray-600">Current Claim Status</h3>
            <span id="status-badge" class="mt-2 inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-semibold">Pending Intake</span>
          </div>
          <!-- Next Task Card -->
          <div class="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between">
            <div>
              <h3 class="text-gray-600">Next Task</h3>
              <p id="next-task" class="mt-2 text-lg text-gray-800">Finish intake wizard</p>
            </div>
            <button data-target="intake" class="mt-4 w-full py-2 rounded-full bg-primary text-white hover:bg-secondary transition">
              Go to Intake
            </button>
          </div>
          <!-- Documents Card -->
          <div class="bg-white rounded-2xl shadow-md p-6">
            <h3 class="text-gray-600">Documents</h3>
            <ul id="doc-list" class="mt-2 text-sm text-gray-700 space-y-2">
              <li>No documents yet.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- INTAKE WIZARD SECTION -->
    <section id="intake" class="section bg-white pt-24">
      <div class="max-w-md mx-auto px-6 py-16">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Claim Intake Wizard</h2>
        <div id="wizard" class="space-y-4"></div>
        <div class="flex justify-between mt-8">
          <button id="prev-q" class="hidden px-5 py-2 bg-gray-200 rounded-full">Back</button>
          <button id="next-q" class="px-5 py-2 bg-primary text-white rounded-full">Next</button>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="mt-20 bg-white py-8">
      <div class="max-w-6xl mx-auto px-6 text-center text-sm text-gray-500">
        © 2025 VetClaim Compass • Not legal advice • <a href="#" class="underline">Privacy</a> • <a href="#" class="underline">Terms</a>
      </div>
    </footer>

    <!-- SCRIPTS -->
    <script>
      // Mobile menu toggle
      document.getElementById('mobile-menu-btn').addEventListener('click', () => {
        const menu = document.getElementById('mobile-menu');
        menu.classList.toggle('hidden');
      });

      // Section navigation
      function showSection(id) {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        window.scrollTo({ top: 0 });
      }
      document.querySelectorAll('[data-target]').forEach(btn => btn.addEventListener('click', () => showSection(btn.dataset.target)));

      // Pricing cards
      const plans = [
        {
          name: 'Single-Claim Bundle',
          desc: 'One-time toolkit for a single claim.',
          price: '$99',
          unit: 'One-time',
          features: ['Intake wizard', 'AI Statement PDF', 'Evidence checklists', '18-month tracking'],
          id: 'price_single',
          mode: 'payment',
          btn: 'Buy Now'
        },
        {
          name: 'Veteran-Plus',
          desc: 'Lifetime tracking & alerts.',
          price: '$15',
          unit: '/mo',
          features: ['All Bundle features', 'Buddy-Letter Builder', 'COLA alerts', 'Priority support'],
          id: 'price_monthly',
          mode: 'subscription',
          btn: 'Subscribe'
        },
        {
          name: 'Veteran-Plus Annual',
          desc: 'Save 25% vs monthly.',
          price: '$135',
          unit: '/yr',
          features: ['All Veteran-Plus features', 'Annual discount'],
          id: 'price_annual',
          mode: 'subscription',
          btn: 'Subscribe'
        }
      ];
      const grid = document.getElementById('plans-grid');
      plans.forEach(p => {
        const el = document.createElement('div');
        el.className = 'bg-white rounded-2xl shadow-md p-8 flex flex-col';
        el.innerHTML = `
          <h3 class="text-xl font-semibold text-gray-800 mb-2">${p.name}</h3>
          <p class="text-gray-600 mb-4 flex-grow">${p.desc}</p>
          <div class="text-4xl font-bold text-gray-800">${p.price}<span class="text-lg">${p.unit}</span></div>
          <ul class="mt-4 mb-6 space-y-2 text-gray-700 text-sm">${p.features.map(f => `<li>• ${f}</li>`).join('')}</ul>
          <button class="mt-auto py-3 bg-primary text-white rounded-full hover:bg-secondary transition" onclick="checkout('${p.id}', '${p.mode}')">${p.btn}</button>
        `;
        grid.appendChild(el);
      });

      // Stripe checkout
      const stripe = Stripe('pk_test_51RO4Ql2f4J2jytpSEwae0mUlX1OmdFmRkkbMf38sWrSdwPCVkJCgBm0ayDtNOAUEUf6p4Kr48aEtznKWoRbHjH3g00YhQzyHXb');
      const priceMap = { price_single: 'price_abc123', price_monthly: 'price_def456', price_annual: 'price_ghi789' };
      async function checkout(pid, mode) {
        const { error } = await stripe.redirectToCheckout({
          lineItems: [{ price: priceMap[pid], quantity: 1 }],
          mode,
          successUrl: window.location.origin + '#dashboard',
          cancelUrl: window.location.href
        });
        if (error) alert(error.message);
      }

      // Intake Wizard
      const questions = [
        { key: 'condition', q: 'What condition are you claiming?' },
        { key: 'onset', q: 'When did symptoms start?' },
        { key: 'impact', q: 'How does this impact daily life?' }
      ];
      let idx = 0, answers = {};
      const wiz = document.getElementById('wizard'), prev = document.getElementById('prev-q'), next = document.getElementById('next-q');
      function renderQ() {
        wiz.innerHTML = '';
        const { q, key } = questions[idx];
        const lb = document.createElement('label');
        lb.textContent = q; lb.className = 'block mb-2 text-gray-700';
        const inp = document.createElement('textarea');
        inp.className = 'w-full p-3 border rounded-lg'; inp.value = answers[key] || '';
        inp.oninput = e => answers[key] = e.target.value;
        wiz.append(lb, inp);
        prev.classList.toggle('hidden', idx === 0);
        next.textContent = idx === questions.length - 1 ? 'Finish' : 'Next';
      }
      prev.onclick = () => { if (idx > 0) { idx--; renderQ(); }};
      next.onclick = () => {
        if (idx < questions.length - 1) { idx++; renderQ(); }
        else {
          // simulate save
          localStorage.setItem('claim', JSON.stringify(answers));
          document.getElementById('doc-list').innerHTML = '<li>Statement.pdf</li>';
          document.getElementById('status-badge').textContent = 'Ready to File';
          document.getElementById('next-task').textContent = 'Await VA status';
          showSection('dashboard');
        }
      };
      renderQ();
    </script>
  </body>
</html>
