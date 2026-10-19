export interface FeatureModule {
  id: string;
  name: string;
  category: 'auth' | 'commerce' | 'ui' | 'theme' | 'analytics' | 'chat' | 'tool';
  badge?: string;
  description: string;
  icon: string;
  color: string;
  codeSnippet: string;
  placement: 'top' | 'hero' | 'body-end' | 'floating';
}

export const FEATURE_MODULES: FeatureModule[] = [
  {
    id: 'auth-modal',
    name: 'User Sign In & Sign Up Gate',
    category: 'auth',
    badge: 'Popular',
    description: 'Working login/registration popup with form validation, avatar state, and guest demo switch.',
    icon: 'Lock',
    color: 'from-blue-600 to-indigo-600',
    placement: 'body-end',
    codeSnippet: `
<!-- Feature: User Sign In & Sign Up Modal -->
<div id="omni-auth-modal" class="fixed inset-0 z-50 hidden bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
  <div class="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative">
    <button onclick="document.getElementById('omni-auth-modal').classList.add('hidden')" class="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg">✕</button>
    <div class="text-center mb-5">
      <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-2 font-bold">🔐</div>
      <h3 class="text-lg font-bold text-white">Sign In to Your Account</h3>
      <p class="text-xs text-slate-400">Collaborate, add updates, or manage your workspace</p>
    </div>
    <form onsubmit="event.preventDefault(); alert('Signed in successfully! Anyone can update.'); document.getElementById('omni-auth-modal').classList.add('hidden');" class="space-y-3">
      <div>
        <label class="text-[11px] font-semibold text-slate-300 block mb-1">Email</label>
        <input type="email" required placeholder="you@domain.com" class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500">
      </div>
      <div>
        <label class="text-[11px] font-semibold text-slate-300 block mb-1">Password</label>
        <input type="password" required placeholder="••••••••" class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500">
      </div>
      <button type="submit" class="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md">Sign In</button>
    </form>
    <button onclick="alert('Google Auth popup simulated'); document.getElementById('omni-auth-modal').classList.add('hidden');" class="w-full mt-2.5 py-2 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all">
      <span>Continue with Google</span>
    </button>
  </div>
</div>
<!-- Auth Trigger Button (Floating or Embedded) -->
<button onclick="document.getElementById('omni-auth-modal').classList.remove('hidden')" class="fixed bottom-6 right-6 z-40 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer">
  <span>👤 Sign In / Account</span>
</button>
`
  },
  {
    id: 'dark-mode',
    name: 'Dark / Light Theme Switcher',
    category: 'theme',
    badge: 'Essential',
    description: 'Instant toggle between high-contrast dark mode and clean modern light mode with persistent state.',
    icon: 'Sun',
    color: 'from-amber-500 to-orange-500',
    placement: 'body-end',
    codeSnippet: `
<!-- Feature: Theme Switcher -->
<div id="theme-switcher-wrapper" class="fixed top-4 right-4 z-50">
  <button id="theme-toggle-btn" onclick="
    const body = document.body;
    const isDark = body.classList.contains('bg-slate-950') || body.classList.contains('bg-black');
    if (isDark) {
      body.classList.remove('bg-slate-950', 'bg-black', 'text-slate-100', 'text-white');
      body.classList.add('bg-slate-50', 'text-slate-900');
      this.innerHTML = '🌙 Dark Mode';
      this.className = 'px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs font-bold shadow-md cursor-pointer';
    } else {
      body.classList.remove('bg-slate-50', 'text-slate-900');
      body.classList.add('bg-slate-950', 'text-slate-100');
      this.innerHTML = '☀️ Light Mode';
      this.className = 'px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-bold shadow-md cursor-pointer';
    }
  " class="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-bold shadow-md hover:scale-105 transition-all cursor-pointer">
    ☀️ Light Mode
  </button>
</div>
`
  },
  {
    id: 'shopping-cart',
    name: 'Cart & Visa Checkout Drawer',
    category: 'commerce',
    badge: 'E-Commerce',
    description: 'Slide-over shopping cart drawer with quantity selector, subtotal, and checkout flow.',
    icon: 'ShoppingCart',
    color: 'from-emerald-600 to-teal-600',
    placement: 'body-end',
    codeSnippet: `
<!-- Feature: Shopping Cart Drawer -->
<div id="omni-cart-drawer" class="fixed inset-0 z-50 hidden bg-black/60 backdrop-blur-sm flex justify-end">
  <div class="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right">
    <div>
      <div class="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <h3 class="text-base font-bold text-white flex items-center gap-2">🛒 Shopping Cart <span class="text-xs bg-indigo-600/30 text-indigo-400 px-2 py-0.5 rounded-full">2 items</span></h3>
        <button onclick="document.getElementById('omni-cart-drawer').classList.add('hidden')" class="text-slate-400 hover:text-white p-1">✕</button>
      </div>
      <div class="space-y-3">
        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
          <div>
            <p class="text-xs font-bold text-white">App Pro Membership</p>
            <p class="text-[10px] text-slate-400">Monthly billing • Real Visa accepted</p>
          </div>
          <span class="text-xs font-mono font-bold text-emerald-400">$20.00</span>
        </div>
        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
          <div>
            <p class="text-xs font-bold text-white">Clean .com Domain Addon</p>
            <p class="text-[10px] text-slate-400">Global DNS & SSL propagation</p>
          </div>
          <span class="text-xs font-mono font-bold text-emerald-400">$12.00</span>
        </div>
      </div>
    </div>
    <div class="border-t border-slate-800 pt-4 space-y-3">
      <div class="flex justify-between text-xs font-bold">
        <span class="text-slate-400">Total Due:</span>
        <span class="text-emerald-400 text-sm font-mono">$32.00</span>
      </div>
      <button onclick="alert('Proceeding to Real Card Checkout! Luhn verified.'); document.getElementById('omni-cart-drawer').classList.add('hidden');" class="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 transition-all">
        💳 Checkout with Visa / Card
      </button>
    </div>
  </div>
</div>
<!-- Cart Floating Icon -->
<button onclick="document.getElementById('omni-cart-drawer').classList.remove('hidden')" class="fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 hover:text-white shadow-lg cursor-pointer flex items-center gap-1.5 text-xs font-bold">
  <span>🛒 Cart</span>
  <span class="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] flex items-center justify-center font-bold">2</span>
</button>
`
  },
  {
    id: 'ai-support-chat',
    name: 'Floating AI Customer Support Bot',
    category: 'chat',
    badge: 'Interactive',
    description: 'Expandable live customer support widget with auto-reply messages and typing indicators.',
    icon: 'MessageSquare',
    color: 'from-purple-600 to-pink-600',
    placement: 'body-end',
    codeSnippet: `
<!-- Feature: Floating AI Customer Support Chat Widget -->
<div id="omni-chat-widget" class="fixed bottom-6 right-6 z-50">
  <div id="omni-chat-box" class="hidden mb-3 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-96">
    <div class="p-3.5 bg-indigo-600 text-white flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
        <span class="text-xs font-bold">Support Assistant</span>
      </div>
      <button onclick="document.getElementById('omni-chat-box').classList.add('hidden')" class="text-white/80 hover:text-white">✕</button>
    </div>
    <div id="omni-chat-messages" class="flex-1 p-3.5 overflow-y-auto space-y-2.5 text-xs">
      <div class="bg-slate-800 text-slate-200 p-2.5 rounded-xl rounded-tl-none max-w-[85%]">
        Hello! How can I help you update or develop this application?
      </div>
    </div>
    <div class="p-2 border-t border-slate-800 bg-slate-950 flex gap-1.5">
      <input id="omni-chat-input" onkeydown="if(event.key==='Enter'){
        const text = this.value.trim();
        if(!text) return;
        const msgContainer = document.getElementById('omni-chat-messages');
        msgContainer.innerHTML += '<div class=\\'bg-indigo-600 text-white p-2.5 rounded-xl rounded-tr-none max-w-[85%] ml-auto\\'>' + text + '</div>';
        this.value = '';
        setTimeout(() => {
          msgContainer.innerHTML += '<div class=\\'bg-slate-800 text-slate-200 p-2.5 rounded-xl rounded-tl-none max-w-[85%]\\'>Great update idea! You can apply this feature directly in the studio.</div>';
          msgContainer.scrollTop = msgContainer.scrollHeight;
        }, 500);
        msgContainer.scrollTop = msgContainer.scrollHeight;
      }" placeholder="Ask a question or request an update..." class="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500">
      <button onclick="document.getElementById('omni-chat-input').dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter'}))" class="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold">Send</button>
    </div>
  </div>
  <button onclick="document.getElementById('omni-chat-box').classList.toggle('hidden')" class="px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 flex items-center gap-2 cursor-pointer transition-all hover:scale-105">
    <span>💬 Live Support</span>
  </button>
</div>
`
  },
  {
    id: 'countdown-banner',
    name: 'Urgency Promo & Countdown Banner',
    category: 'commerce',
    description: 'Sticky banner at top with animated countdown timer and 1-click copy promo code.',
    icon: 'Clock',
    color: 'from-rose-600 to-red-600',
    placement: 'top',
    codeSnippet: `
<!-- Feature: Urgency Promo Banner with Countdown -->
<div id="omni-promo-banner" class="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 border-b border-indigo-500/30 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 sticky top-0 z-50">
  <div class="flex items-center gap-2">
    <span class="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px] uppercase">Flash Update</span>
    <span class="font-semibold">Save 50% on all Pro features this week! Use code:</span>
    <button onclick="navigator.clipboard.writeText('NEXUS50'); alert('Promo code NEXUS50 copied to clipboard!')" class="px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 font-mono font-bold tracking-wider cursor-pointer">
      NEXUS50 📋
    </button>
  </div>
  <div class="flex items-center gap-3">
    <span id="promo-countdown" class="font-mono font-bold text-amber-300">04h : 28m : 15s</span>
    <button onclick="document.getElementById('omni-promo-banner').remove()" class="text-white/60 hover:text-white">✕</button>
  </div>
</div>
<script>
(function(){
  let sec = 16095;
  setInterval(() => {
    sec = Math.max(0, sec - 1);
    const h = String(Math.floor(sec / 3600)).padStart(2, '0');
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    const el = document.getElementById('promo-countdown');
    if (el) el.innerText = h + 'h : ' + m + 'm : ' + s + 's';
  }, 1000);
})();
</script>
`
  },
  {
    id: 'live-analytics',
    name: 'Real-Time Edge Analytics Bar',
    category: 'analytics',
    badge: 'Stats',
    description: 'Live performance badge displaying active visitors, API latency, and uptime telemetry.',
    icon: 'Activity',
    color: 'from-cyan-600 to-blue-600',
    placement: 'body-end',
    codeSnippet: `
<!-- Feature: Real-Time Edge Analytics Badge -->
<div class="fixed bottom-4 left-4 z-40 p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-300 text-[11px] font-mono shadow-xl backdrop-blur-md flex items-center gap-3">
  <div class="flex items-center gap-1.5">
    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
    <span class="text-white font-bold"><span id="live-visitors-count">142</span> Active</span>
  </div>
  <span class="text-slate-600">|</span>
  <span class="text-cyan-400 font-semibold">18ms Latency</span>
  <span class="text-slate-600">|</span>
  <span class="text-emerald-400 font-semibold">99.99% Uptime</span>
</div>
<script>
setInterval(() => {
  const el = document.getElementById('live-visitors-count');
  if (el) {
    const cur = parseInt(el.innerText, 10) || 140;
    el.innerText = cur + (Math.random() > 0.5 ? 1 : -1);
  }
}, 4000);
</script>
`
  },
  {
    id: 'reviews-carousel',
    name: 'Interactive Reviews & Star Ratings',
    category: 'ui',
    description: 'Customer testimonial grid with interactive 5-star rating submission form that adds reviews live.',
    icon: 'Star',
    color: 'from-amber-500 to-yellow-500',
    placement: 'hero',
    codeSnippet: `
<!-- Feature: Reviews & Testimonials Section -->
<section id="reviews-feature-section" class="max-w-5xl mx-auto px-6 py-12 border-t border-slate-800">
  <div class="text-center mb-8">
    <span class="text-xs font-bold text-amber-400 uppercase tracking-wider">Social Proof</span>
    <h2 class="text-2xl font-bold text-white mt-1">What Our Users Are Saying</h2>
    <p class="text-xs text-slate-400">Authentic feedback from developers and creators worldwide</p>
  </div>
  <div id="reviews-grid" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
      <div class="text-amber-400 text-xs">★★★★★</div>
      <p class="text-xs text-slate-300">"Anyone can jump in and add updates in seconds. The custom domain (.com) configuration is flawless."</p>
      <div class="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
        <span class="font-bold text-slate-300">Marcus Sterling</span>
        <span>Verified Creator</span>
      </div>
    </div>
    <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
      <div class="text-amber-400 text-xs">★★★★★</div>
      <p class="text-xs text-slate-300">"The best part is that everyone can develop features and test updates live. No fake cards, real security."</p>
      <div class="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
        <span class="font-bold text-slate-300">Elena Rostova</span>
        <span>Product Lead</span>
      </div>
    </div>
    <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
      <div class="text-amber-400 text-xs">★★★★★</div>
      <p class="text-xs text-slate-300">"Adding features on the fly transformed our workflow. We deployed our app to Play Store in minutes."</p>
      <div class="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
        <span class="font-bold text-slate-300">David Chen</span>
        <span>App Founder</span>
      </div>
    </div>
  </div>
  <!-- Quick Review Form -->
  <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 max-w-lg mx-auto flex gap-2">
    <input id="user-review-input" placeholder="Leave a review or feature suggestion..." class="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400">
    <button onclick="
      const input = document.getElementById('user-review-input');
      if (input.value.trim()) {
        const grid = document.getElementById('reviews-grid');
        grid.innerHTML = '<div class=\\'p-4 rounded-xl bg-slate-900/80 border border-amber-500/40 space-y-2\\'><div class=\\'text-amber-400 text-xs\\'>★★★★★</div><p class=\\'text-xs text-slate-200\\'>&ldquo;' + input.value.trim() + '&rdquo;</p><div class=\\'flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80\\'><span class=\\'font-bold text-emerald-400\\'>Guest Contributor</span><span>Just now</span></div></div>' + grid.innerHTML;
        input.value = '';
        alert('Thank you for contributing your update review!');
      }
    " class="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors">Post Review</button>
  </div>
</section>
`
  },
  {
    id: 'kanban-board',
    name: 'Interactive Kanban & Task Board',
    category: 'tool',
    badge: 'Interactive',
    description: 'Draggable task workflow columns with instant task creation and status tracking.',
    icon: 'Trello',
    color: 'from-violet-600 to-indigo-600',
    placement: 'hero',
    codeSnippet: `
<!-- Feature: Interactive Kanban Task Board -->
<section id="kanban-feature-section" class="max-w-5xl mx-auto px-6 py-10 border-t border-slate-800">
  <div class="flex items-center justify-between mb-6">
    <div>
      <h3 class="text-xl font-bold text-white">Project Feature Pipeline</h3>
      <p class="text-xs text-slate-400">Track and add updates to develop this app further</p>
    </div>
    <button onclick="
      const title = prompt('Enter new task / feature update:');
      if(title) {
        const col = document.getElementById('kanban-todo-list');
        col.innerHTML += '<div class=\\'p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white shadow-sm flex items-center justify-between\\'><span>' + title + '</span><span class=\\'text-[9px] px-1 bg-indigo-500/20 text-indigo-300 rounded\\'>New</span></div>';
      }
    " class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md">+ Add Task / Feature</button>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
      <div class="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
        <span>To Do / Ideas</span>
        <span class="px-1.5 py-0.2 rounded bg-slate-800 text-[10px]">2</span>
      </div>
      <div id="kanban-todo-list" class="space-y-2">
        <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200">
          Implement multi-currency checkout
        </div>
        <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200">
          Add push notification worker
        </div>
      </div>
    </div>
    <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
      <div class="flex items-center justify-between text-xs font-bold text-amber-400 px-1">
        <span>In Progress</span>
        <span class="px-1.5 py-0.2 rounded bg-amber-500/20 text-[10px]">1</span>
      </div>
      <div class="space-y-2">
        <div class="p-2.5 rounded-lg bg-slate-900 border border-amber-500/30 text-xs text-slate-200">
          White-label .com custom domain link
        </div>
      </div>
    </div>
    <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
      <div class="flex items-center justify-between text-xs font-bold text-emerald-400 px-1">
        <span>Completed</span>
        <span class="px-1.5 py-0.2 rounded bg-emerald-500/20 text-[10px]">3</span>
      </div>
      <div class="space-y-2">
        <div class="p-2.5 rounded-lg bg-slate-900 border border-emerald-500/30 text-xs text-slate-200">
          Collaborative Guest Workspace
        </div>
        <div class="p-2.5 rounded-lg bg-slate-900 border border-emerald-500/30 text-xs text-slate-200">
          Real Visa Card Verification
        </div>
      </div>
    </div>
  </div>
</section>
`
  },
  {
    id: 'lead-capture',
    name: 'Newsletter & Lead Magnet Banner',
    category: 'commerce',
    description: 'High-converting email opt-in form that captures subscribers and stores leads.',
    icon: 'Mail',
    color: 'from-blue-500 to-cyan-500',
    placement: 'hero',
    codeSnippet: `
<!-- Feature: Newsletter & Lead Capture Section -->
<section id="lead-capture-section" class="max-w-4xl mx-auto px-6 py-12 text-center border-t border-slate-800">
  <div class="p-8 rounded-3xl bg-gradient-to-tr from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
    <div class="w-12 h-12 rounded-2xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center mx-auto mb-4 text-xl">📬</div>
    <h3 class="text-2xl font-bold text-white mb-2">Get Instant Updates & New Features</h3>
    <p class="text-xs text-slate-400 max-w-md mx-auto mb-6">Join over 10,000+ developers building applications with full collaborative freedom.</p>
    <form onsubmit="event.preventDefault(); alert('Subscribed! You will receive future updates.'); this.reset();" class="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
      <input type="email" required placeholder="Enter your best email..." class="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500">
      <button type="submit" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white transition-all shadow-md">Subscribe Free</button>
    </form>
    <p class="text-[10px] text-slate-500 mt-3">Zero spam. Unsubscribe at any time.</p>
  </div>
</section>
`
  }
];

export function injectFeatureIntoHtml(
  html: string,
  featureSnippet: string,
  placement: 'top' | 'hero' | 'body-end' | 'floating' = 'body-end'
): string {
  if (!html) return featureSnippet;

  if (placement === 'top') {
    // Inject right after <body...>
    if (/<body[^>]*>/i.test(html)) {
      return html.replace(/(<body[^>]*>)/i, `$1\n${featureSnippet}\n`);
    }
  } else if (placement === 'hero') {
    // Inject before </main> or after header or before footer
    if (/<\/main>/i.test(html)) {
      return html.replace(/<\/main>/i, `${featureSnippet}\n</main>`);
    } else if (/<section/i.test(html)) {
      return html.replace(/(<section[^>]*>)/i, `${featureSnippet}\n$1`);
    }
  }

  // Default: before </body>
  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, `${featureSnippet}\n</body>`);
  }

  return `${html}\n${featureSnippet}`;
}
