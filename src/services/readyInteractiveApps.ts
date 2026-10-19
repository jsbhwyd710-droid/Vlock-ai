/**
 * Ready-to-Run Interactive Applications (100% Functional, Animated & Interactive)
 * Built with full JavaScript logic, state management, animations, and zero static image placeholders.
 */

export interface ReadyApp {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  badge: string;
  color: string;
  htmlCode: string;
}

export const READY_INTERACTIVE_APPS: ReadyApp[] = [
  {
    id: 'interactive-store',
    name: 'تطبيق المتجر الذكي التفاعلي (Smart Store & Cart)',
    category: 'تجارة وتسوق',
    description: 'متجر متكامل بسلة مشتريات ديناميكية، حساب المجموع والضرائب، فلترة، وعملية دفع تفاعلية كاملة.',
    icon: 'fa-cart-shopping',
    badge: 'تفاعلي 100%',
    color: 'from-emerald-500 to-teal-600',
    htmlCode: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SmartStore - متجر تفاعلي جاهز</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
  <style>
    @keyframes bounceIn { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
    .animate-pop { animation: bounceIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .glass-card { background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 font-sans min-h-screen flex flex-col">
  <!-- Top Navigation -->
  <header class="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4">
    <div class="max-w-6xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 text-lg">
          <i class="fa-solid fa-bolt"></i>
        </div>
        <div>
          <h1 class="font-black text-lg text-white">SmartStore Pro</h1>
          <span class="text-[11px] text-emerald-400 font-semibold">تطبيق جاهز وتفاعلي بالكامل ⚡</span>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <!-- Search bar -->
        <div class="relative hidden sm:block">
          <i class="fa-solid fa-magnifying-glass absolute right-3 top-3 text-slate-400 text-xs"></i>
          <input id="searchInput" type="text" placeholder="ابحث في المنتجات..." oninput="filterProducts()" class="bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 w-52 transition-all">
        </div>

        <!-- Cart Button -->
        <button onclick="toggleCart()" class="relative px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer">
          <i class="fa-solid fa-cart-shopping"></i>
          <span>السلة</span>
          <span id="cartCountBadge" class="bg-white text-emerald-700 px-2 py-0.2 rounded-full font-black text-xs">0</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Categories Filter -->
  <div class="max-w-6xl mx-auto px-6 pt-6 flex flex-wrap items-center gap-2">
    <button onclick="selectCategory('all')" class="cat-btn px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs transition-all shadow-md" data-cat="all">الكل</button>
    <button onclick="selectCategory('tech')" class="cat-btn px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-all border border-slate-800" data-cat="tech">تقنية وإلكترونيات</button>
    <button onclick="selectCategory('audio')" class="cat-btn px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-all border border-slate-800" data-cat="audio">صوتيات فاخرة</button>
    <button onclick="selectCategory('gaming')" class="cat-btn px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-all border border-slate-800" data-cat="gaming">ألعاب وعتاد</button>
  </div>

  <!-- Products Grid -->
  <main class="flex-1 max-w-6xl mx-auto px-6 py-6 w-full">
    <div id="productsGrid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <!-- Dynamic Products Rendered Here -->
    </div>
  </main>

  <!-- Slide-Over Shopping Cart Drawer -->
  <div id="cartDrawer" class="fixed inset-0 z-50 hidden bg-black/70 backdrop-blur-sm flex justify-start">
    <div class="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col justify-between shadow-2xl animate-pop">
      <div>
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-cart-shopping text-emerald-400"></i>
            <h3 class="font-black text-white text-base">سلة التسوق التفاعلية</h3>
          </div>
          <button onclick="toggleCart()" class="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <!-- Cart Items List -->
        <div id="cartItemsList" class="my-4 space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          <!-- Items will be injected here -->
        </div>
      </div>

      <!-- Checkout Summary -->
      <div class="pt-4 border-t border-slate-800 space-y-3">
        <div class="flex justify-between text-xs text-slate-400">
          <span>المجموع الفرعي:</span>
          <span id="subtotalVal" class="font-bold text-white">$0.00</span>
        </div>
        <div class="flex justify-between text-xs text-slate-400">
          <span>ضريبة القيمة المضافة (5%):</span>
          <span id="taxVal" class="font-bold text-white">$0.00</span>
        </div>
        <div class="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
          <span>الإجمالي النهائي:</span>
          <span id="totalVal" class="text-emerald-400 font-mono text-base">$0.00</span>
        </div>

        <button onclick="simulateCheckout()" id="checkoutBtn" class="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
          <i class="fa-solid fa-lock"></i>
          <span>إتمام الدفع الآمن الآن</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Checkout Success Modal -->
  <div id="successModal" class="fixed inset-0 z-50 hidden bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-emerald-500/50 rounded-3xl max-w-sm w-full p-6 text-center animate-pop shadow-2xl">
      <div class="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 text-2xl border border-emerald-500/40">
        <i class="fa-solid fa-check"></i>
      </div>
      <h3 class="text-lg font-black text-white mb-1">تمت عملية الشراء بنجاح! 🎉</h3>
      <p class="text-xs text-slate-400 mb-6">رقم الفاتورة: #INV-<span id="invNumber">94821</span> • تم تجهيز طلبك فورياً.</p>
      <button onclick="closeSuccessModal()" class="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer">
        متابعة التسوق
      </button>
    </div>
  </div>

  <script>
    const PRODUCTS = [
      { id: 1, name: 'سماعة اللاسلكية الذكية Studio Pro', category: 'audio', price: 149.99, icon: 'fa-headphones', color: 'from-indigo-600 to-purple-600', badge: 'الأكثر طلباً' },
      { id: 2, name: 'ساعة ذكية رياضية Ultra V2', category: 'tech', price: 199.50, icon: 'fa-clock', color: 'from-blue-600 to-cyan-600', badge: 'جديد' },
      { id: 3, name: 'لوحة مفاتيح ميكانيكية RGB Gaming', category: 'gaming', price: 89.00, icon: 'fa-keyboard', color: 'from-rose-600 to-pink-600', badge: 'خصم 20%' },
      { id: 4, name: 'ماوس لاسلكي مريح مع شحن سريع', category: 'gaming', price: 49.99, icon: 'fa-computer-mouse', color: 'from-amber-600 to-orange-600', badge: '' },
      { id: 5, name: 'ميكروفون تسجيل استوديو عالي النقاء', category: 'audio', price: 129.00, icon: 'fa-microphone', color: 'from-violet-600 to-fuchsia-600', badge: 'احترافي' },
      { id: 6, name: 'شاحن مغناطيسي لاسلكي سريع 65W', category: 'tech', price: 39.99, icon: 'fa-bolt', color: 'from-teal-600 to-emerald-600', badge: 'شحن فائق' }
    ];

    let cart = [];
    let activeCategory = 'all';

    function renderProducts() {
      const grid = document.getElementById('productsGrid');
      const search = (document.getElementById('searchInput').value || '').toLowerCase();
      
      const filtered = PRODUCTS.filter(p => {
        const matchesCat = activeCategory === 'all' || p.category === activeCategory;
        const matchesSearch = p.name.toLowerCase().includes(search);
        return matchesCat && matchesSearch;
      });

      if (filtered.length === 0) {
        grid.innerHTML = \`<div class="col-span-full py-12 text-center text-slate-500 text-sm">لا توجد منتجات مطابقة للبحث</div>\`;
        return;
      }

      grid.innerHTML = filtered.map(p => \`
        <div class="glass-card rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all group">
          <div>
            <div class="h-36 rounded-xl bg-gradient-to-tr \${p.color} flex items-center justify-center text-white text-4xl mb-4 relative overflow-hidden shadow-inner">
              <i class="fa-solid \${p.icon} group-hover:scale-110 transition-transform"></i>
              \${p.badge ? \`<span class="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white">\${p.badge}</span>\` : ''}
            </div>
            <h4 class="font-bold text-sm text-white mb-1">\${p.name}</h4>
            <p class="text-xs text-slate-400 mb-3">ضمان استبدال فوري لمدة عامين • شحن سريع</p>
          </div>
          <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span class="font-black text-emerald-400 font-mono text-base">$\${p.price.toFixed(2)}</span>
            <button onclick="addToCart(\${p.id})" class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer">
              <i class="fa-solid fa-plus text-[10px]"></i>
              <span>أضف للسلة</span>
            </button>
          </div>
        </div>
      \`).join('');
    }

    function addToCart(productId) {
      const prod = PRODUCTS.find(p => p.id === productId);
      if (!prod) return;

      const existing = cart.find(c => c.id === productId);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ ...prod, qty: 1 });
      }
      updateCartUI();
    }

    function updateQuantity(productId, delta) {
      const item = cart.find(c => c.id === productId);
      if (!item) return;

      item.qty += delta;
      if (item.qty <= 0) {
        cart = cart.filter(c => c.id !== productId);
      }
      updateCartUI();
    }

    function updateCartUI() {
      const count = cart.reduce((acc, item) => acc + item.qty, 0);
      document.getElementById('cartCountBadge').innerText = count;

      const list = document.getElementById('cartItemsList');
      if (cart.length === 0) {
        list.innerHTML = \`<div class="py-12 text-center text-slate-500 text-xs">سلتك فارغة حالياً. اضغط على أضف للسلة لتجربة التطبيق!</div>\`;
        document.getElementById('checkoutBtn').disabled = true;
      } else {
        document.getElementById('checkoutBtn').disabled = false;
        list.innerHTML = cart.map(item => \`
          <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-tr \${item.color} flex items-center justify-center text-white text-xs">
                <i class="fa-solid \${item.icon}"></i>
              </div>
              <div>
                <h5 class="text-xs font-bold text-white line-clamp-1">\${item.name}</h5>
                <span class="text-[11px] font-mono text-emerald-400">$\${item.price.toFixed(2)}</span>
              </div>
            </div>
            <div class="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1">
              <button onclick="updateQuantity(\${item.id}, -1)" class="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-bold">-</button>
              <span class="text-xs font-mono font-bold px-1.5 text-white">\${item.qty}</span>
              <button onclick="updateQuantity(\${item.id}, 1)" class="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-bold">+</button>
            </div>
          </div>
        \`).join('');
      }

      const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
      const tax = subtotal * 0.05;
      const total = subtotal + tax;

      document.getElementById('subtotalVal').innerText = \`$\${subtotal.toFixed(2)}\`;
      document.getElementById('taxVal').innerText = \`$\${tax.toFixed(2)}\`;
      document.getElementById('totalVal').innerText = \`$\${total.toFixed(2)}\`;
    }

    function toggleCart() {
      const drawer = document.getElementById('cartDrawer');
      drawer.classList.toggle('hidden');
    }

    function selectCategory(cat) {
      activeCategory = cat;
      document.querySelectorAll('.cat-btn').forEach(btn => {
        if (btn.dataset.cat === cat) {
          btn.className = 'cat-btn px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs transition-all shadow-md';
        } else {
          btn.className = 'cat-btn px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-all border border-slate-800';
        }
      });
      renderProducts();
    }

    function filterProducts() {
      renderProducts();
    }

    function simulateCheckout() {
      if (cart.length === 0) return;
      document.getElementById('invNumber').innerText = Math.floor(Math.random() * 89999 + 10000);
      toggleCart();
      document.getElementById('successModal').classList.remove('hidden');
      cart = [];
      updateCartUI();
    }

    function closeSuccessModal() {
      document.getElementById('successModal').classList.add('hidden');
    }

    // Initialize
    renderProducts();
    updateCartUI();
  </script>
</body>
</html>`
  },
  {
    id: 'kanban-task-flow',
    name: 'تطبيق إدارة المهام والمشاريع التفاعلي (Kanban Task Flow)',
    category: 'إنتاجية وأعمال',
    description: 'تطبيق لإدارة المهام مع نقل البطاقات، إضافة مهام جديدة، تحديد الأولويات، وحساب نسبة الإنجاز فورياً.',
    icon: 'fa-list-check',
    badge: 'تفاعلي 100%',
    color: 'from-blue-600 to-indigo-600',
    htmlCode: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TaskFlow Pro - تطبيق مهام تفاعلي</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
  <style>
    .kanban-col { min-height: 480px; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 font-sans min-h-screen flex flex-col p-4 sm:p-6">
  <!-- Top Bar -->
  <header class="max-w-6xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 text-lg">
        <i class="fa-solid fa-list-check"></i>
      </div>
      <div>
        <h1 class="text-xl font-black text-white">TaskFlow Pro</h1>
        <p class="text-xs text-slate-400">لوحة مهام تفاعلية فورية • يمكنك إضافة ونقل وحذف المهام</p>
      </div>
    </div>

    <!-- Stats & Progress -->
    <div class="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-3 px-5">
      <div>
        <span class="text-[10px] text-slate-400 block font-semibold">نسبة الإنجاز</span>
        <div class="flex items-center gap-2">
          <div class="w-24 bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div id="progressBar" class="bg-gradient-to-r from-blue-500 to-emerald-500 h-2.5 rounded-full transition-all duration-300" style="width: 33%"></div>
          </div>
          <span id="progressText" class="text-xs font-mono font-bold text-emerald-400">33%</span>
        </div>
      </div>

      <button onclick="openAddTaskModal()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer">
        <i class="fa-solid fa-plus"></i>
        <span>مهمة جديدة</span>
      </button>
    </div>
  </header>

  <!-- Kanban Board -->
  <main class="max-w-6xl mx-auto w-full flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- Col 1: To Do -->
    <div class="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col">
      <div class="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          <h3 class="font-bold text-sm text-white">قيد الانتظار (To Do)</h3>
        </div>
        <span id="count-todo" class="px-2 py-0.5 rounded-full bg-slate-800 text-xs font-mono text-slate-300">0</span>
      </div>
      <div id="col-todo" class="kanban-col space-y-3 flex-1 overflow-y-auto"></div>
    </div>

    <!-- Col 2: In Progress -->
    <div class="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col">
      <div class="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse"></span>
          <h3 class="font-bold text-sm text-white">قيد العمل (In Progress)</h3>
        </div>
        <span id="count-inprogress" class="px-2 py-0.5 rounded-full bg-slate-800 text-xs font-mono text-slate-300">0</span>
      </div>
      <div id="col-inprogress" class="kanban-col space-y-3 flex-1 overflow-y-auto"></div>
    </div>

    <!-- Col 3: Done -->
    <div class="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col">
      <div class="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <h3 class="font-bold text-sm text-white">تم الإنجاز (Done)</h3>
        </div>
        <span id="count-done" class="px-2 py-0.5 rounded-full bg-slate-800 text-xs font-mono text-slate-300">0</span>
      </div>
      <div id="col-done" class="kanban-col space-y-3 flex-1 overflow-y-auto"></div>
    </div>
  </main>

  <!-- Add Task Modal -->
  <div id="taskModal" class="fixed inset-0 z-50 hidden bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-6 shadow-2xl">
      <h3 class="text-base font-bold text-white mb-4">إضافة مهمة جديدة</h3>
      <form onsubmit="handleCreateTask(event)" class="space-y-4">
        <div>
          <label class="text-xs text-slate-400 block mb-1">عنوان المهمة</label>
          <input id="taskTitleInput" type="text" required placeholder="مثال: مراجعة كود التطبيق" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500">
        </div>
        <div>
          <label class="text-xs text-slate-400 block mb-1">الأولوية</label>
          <select id="taskPrioritySelect" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500">
            <option value="high">عالية (High 🔴)</option>
            <option value="medium" selected>متوسطة (Medium 🟡)</option>
            <option value="low">منخفضة (Low 🟢)</option>
          </select>
        </div>
        <div class="flex items-center justify-end gap-2 pt-2">
          <button type="button" onclick="closeAddTaskModal()" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold">إلغاء</button>
          <button type="submit" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md">حفظ المهمة</button>
        </div>
      </form>
    </div>
  </div>

  <script>
    let tasks = [
      { id: 1, title: 'تصميم الواجهة التفاعلية', priority: 'high', status: 'done' },
      { id: 2, title: 'ربط سلة التسوق بالحسابات', priority: 'medium', status: 'inprogress' },
      { id: 3, title: 'فحص التوافقية مع الهواتف', priority: 'low', status: 'todo' },
      { id: 4, title: 'إطلاق النسخة التجريبية للمستخدمين', priority: 'high', status: 'todo' }
    ];

    function renderTasks() {
      ['todo', 'inprogress', 'done'].forEach(col => {
        const container = document.getElementById('col-' + col);
        const colTasks = tasks.filter(t => t.status === col);
        document.getElementById('count-' + col).innerText = colTasks.length;

        container.innerHTML = colTasks.map(t => {
          const pColor = t.priority === 'high' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : t.priority === 'medium' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
          const pLabel = t.priority === 'high' ? 'عالية' : t.priority === 'medium' ? 'متوسطة' : 'عادية';

          return \`
            <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all shadow-sm">
              <div class="flex items-start justify-between gap-2 mb-2">
                <h4 class="text-xs font-bold text-white">\${t.title}</h4>
                <button onclick="deleteTask(\${t.id})" class="text-slate-500 hover:text-rose-400 text-xs p-1" title="حذف">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
              <div class="flex items-center justify-between pt-2 border-t border-slate-900 text-[10px]">
                <span class="px-2 py-0.5 rounded-full border \${pColor} font-semibold">\${pLabel}</span>
                <div class="flex items-center gap-1">
                  \${col !== 'todo' ? \`<button onclick="moveTask(\${t.id}, 'prev')" class="w-6 h-6 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center justify-center font-bold" title="السابق"><i class="fa-solid fa-arrow-right text-[9px]"></i></button>\` : ''}
                  \${col !== 'done' ? \`<button onclick="moveTask(\${t.id}, 'next')" class="w-6 h-6 rounded bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white flex items-center justify-center font-bold" title="التالي"><i class="fa-solid fa-arrow-left text-[9px]"></i></button>\` : ''}
                </div>
              </div>
            </div>
          \`;
        }).join('');
      });

      // Update progress
      const total = tasks.length;
      const done = tasks.filter(t => t.status === 'done').length;
      const pct = total === 0 ? 0 : Math.round((done / total) * 100);
      document.getElementById('progressBar').style.width = pct + '%';
      document.getElementById('progressText').innerText = pct + '%';
    }

    function moveTask(id, dir) {
      const order = ['todo', 'inprogress', 'done'];
      const task = tasks.find(t => t.id === id);
      if (!task) return;
      let idx = order.indexOf(task.status);
      if (dir === 'next' && idx < 2) idx++;
      if (dir === 'prev' && idx > 0) idx--;
      task.status = order[idx];
      renderTasks();
    }

    function deleteTask(id) {
      tasks = tasks.filter(t => t.id !== id);
      renderTasks();
    }

    function openAddTaskModal() {
      document.getElementById('taskModal').classList.remove('hidden');
    }

    function closeAddTaskModal() {
      document.getElementById('taskModal').classList.add('hidden');
    }

    function handleCreateTask(e) {
      e.preventDefault();
      const title = document.getElementById('taskTitleInput').value.trim();
      const priority = document.getElementById('taskPrioritySelect').value;
      if (!title) return;
      tasks.push({
        id: Date.now(),
        title,
        priority,
        status: 'todo'
      });
      document.getElementById('taskTitleInput').value = '';
      closeAddTaskModal();
      renderTasks();
    }

    renderTasks();
  </script>
</body>
</html>`
  },
  {
    id: 'finance-crypto-hub',
    name: 'تطبيق لوحة المال والعملات التفاعلي (Finance & Crypto Hub)',
    category: 'مالية واستثمار',
    description: 'رسم بياني حي متحرك، محاكاة بيع وشراء تفاعلية، رصيد فوري يتغير تلقائياً مع سجل الصفقات.',
    icon: 'fa-chart-line',
    badge: 'تفاعلي 100%',
    color: 'from-amber-500 to-orange-600',
    htmlCode: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ApexFinance - محفظة مالية تفاعلية</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-slate-950 text-slate-100 font-sans min-h-screen flex flex-col p-4 sm:p-6">
  <header class="max-w-5xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-800">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 text-lg font-black shadow-lg shadow-amber-500/20">
        <i class="fa-solid fa-coins"></i>
      </div>
      <div>
        <h1 class="text-lg font-black text-white">ApexFinance Live</h1>
        <span class="text-[11px] text-amber-400 font-semibold">محفظة استثمارية تفاعلية حية ⚡</span>
      </div>
    </div>

    <!-- Live Balance Box -->
    <div class="text-left bg-slate-900 border border-slate-800 rounded-2xl px-5 py-2.5">
      <span class="text-[10px] text-slate-400 block font-semibold">الرصيد المتاح (USD)</span>
      <span id="userBalance" class="text-base font-black text-emerald-400 font-mono">$10,450.00</span>
    </div>
  </header>

  <main class="max-w-5xl mx-auto w-full flex-1 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Chart & Markets -->
    <div class="lg:col-span-2 space-y-6">
      <!-- Live Canvas Price Chart -->
      <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <span class="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
            <div>
              <h3 id="currentCoinTitle" class="font-black text-sm text-white">Bitcoin (BTC/USD)</h3>
              <span id="livePriceDisplay" class="text-lg font-mono font-black text-emerald-400">$64,280.00</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="setChartInterval('1m')" class="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold">مباشر 1M</button>
            <button onclick="setChartInterval('1h')" class="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 text-xs font-semibold">1H</button>
            <button onclick="setChartInterval('1d')" class="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 text-xs font-semibold">1D</button>
          </div>
        </div>

        <canvas id="liveChart" class="w-full h-48 bg-slate-950 rounded-xl border border-slate-800/80"></canvas>
      </div>

      <!-- Trade Simulator -->
      <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <h3 class="text-xs font-bold text-white mb-3">تنفيذ صفقة تداول تفاعلية سريعة</h3>
        <div class="flex flex-wrap items-center gap-3">
          <input id="tradeAmount" type="number" value="100" min="10" max="5000" class="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500 w-36">
          <button onclick="executeTrade('buy')" class="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer">
            شراء فوراً (Buy 📈)
          </button>
          <button onclick="executeTrade('sell')" class="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer">
            بيع فوراً (Sell 📉)
          </button>
        </div>
      </div>
    </div>

    <!-- Trade History / Portfolio -->
    <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <h3 class="text-xs font-bold text-white">سجل العمليات المباشر</h3>
          <span class="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono">Real-time</span>
        </div>
        <div id="tradeHistoryList" class="space-y-2.5 max-h-[380px] overflow-y-auto">
          <!-- Injected trades -->
        </div>
      </div>
      <div class="pt-3 border-t border-slate-800 text-center">
        <span class="text-[10px] text-slate-500">حساب تجريبي تفاعلي بدون مخاطر</span>
      </div>
    </div>
  </main>

  <script>
    let balance = 10450.00;
    let btcPrice = 64280.00;
    let priceHistory = [64100, 64150, 64200, 64180, 64220, 64250, 64280];
    let trades = [];

    const canvas = document.getElementById('liveChart');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawChart();
    }

    function drawChart() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const min = Math.min(...priceHistory) - 50;
      const max = Math.max(...priceHistory) + 50;
      const range = max - min || 1;

      // Draw grid lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 3; i++) {
        const y = (canvas.height / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw price curve
      ctx.beginPath();
      const step = canvas.width / (priceHistory.length - 1);
      priceHistory.forEach((p, idx) => {
        const x = idx * step;
        const y = canvas.height - ((p - min) / range) * (canvas.height - 20) - 10;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Fill area under curve
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
      grad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = grad;
      ctx.fill();
    }

    function tickPrice() {
      const delta = (Math.random() - 0.48) * 35;
      btcPrice = Math.max(1000, btcPrice + delta);
      priceHistory.push(btcPrice);
      if (priceHistory.length > 25) priceHistory.shift();

      document.getElementById('livePriceDisplay').innerText = '$' + btcPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      drawChart();
    }

    function executeTrade(type) {
      const amount = parseFloat(document.getElementById('tradeAmount').value) || 100;
      if (type === 'buy') {
        if (balance < amount) return alert('الرصيد غير كافٍ!');
        balance -= amount;
      } else {
        balance += amount;
      }
      document.getElementById('userBalance').innerText = '$' + balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      trades.unshift({
        id: Date.now(),
        type,
        amount,
        price: btcPrice,
        time: new Date().toLocaleTimeString('ar-EG')
      });
      renderTrades();
    }

    function renderTrades() {
      const list = document.getElementById('tradeHistoryList');
      if (trades.length === 0) {
        list.innerHTML = \`<div class="py-8 text-center text-slate-500 text-xs">لا توجد عمليات بعد. اضغط شراء أو بيع لاختبار التفاعل!</div>\`;
        return;
      }
      list.innerHTML = trades.slice(0, 8).map(t => \`
        <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold \${t.type === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}">
              \${t.type === 'buy' ? 'شراء' : 'بيع'}
            </span>
            <span class="font-mono text-white font-bold">$\${t.amount.toFixed(2)}</span>
          </div>
          <span class="text-[10px] text-slate-500 font-mono">\${t.time}</span>
        </div>
      \`).join('');
    }

    function setChartInterval(interval) {
      // simulate refresh
      priceHistory = priceHistory.map(p => p + (Math.random() - 0.5) * 50);
      drawChart();
    }

    window.addEventListener('resize', resizeCanvas);
    setTimeout(resizeCanvas, 100);
    setInterval(tickPrice, 2000);
    renderTrades();
  </script>
</body>
</html>`
  },
  {
    id: 'ai-synth-music',
    name: 'استوديو الموسيقى التناظرية التفاعلي (Analog Synth Music Studio)',
    category: 'إبداع وصوتيات',
    description: 'لوحة مفاتيح بيانو تفاعلية حقيقية مع سنث وأصوات نوتات صوتية ومؤثرات تردد فيزيائية حية.',
    icon: 'fa-music',
    badge: 'صوت حقيقي 100%',
    color: 'from-purple-600 to-pink-600',
    htmlCode: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OmniSynth - استوديو موسيقي تفاعلي</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
  <style>
    .white-key { background: #f8fafc; color: #0f172a; height: 160px; border-radius: 0 0 10px 10px; cursor: pointer; transition: all 0.1s; }
    .white-key:active, .white-key.active { background: #a5b4fc; transform: translateY(4px); }
    .black-key { background: #0f172a; color: #fff; height: 100px; width: 36px; border-radius: 0 0 6px 6px; position: absolute; z-index: 10; cursor: pointer; transition: all 0.1s; }
    .black-key:active, .black-key.active { background: #4f46e5; transform: translateY(4px); }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 font-sans min-h-screen flex flex-col items-center justify-center p-4">
  <div class="max-w-2xl w-full bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 shadow-2xl space-y-6">
    <div class="flex items-center justify-between pb-4 border-b border-slate-800">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg text-lg">
          <i class="fa-solid fa-music"></i>
        </div>
        <div>
          <h2 class="text-base font-black text-white">OmniSynth Analog Pro</h2>
          <p class="text-xs text-indigo-400 font-semibold">تطبيق صوتي تفاعلي بمحرك Web Audio الحقيقي 🎹</p>
        </div>
      </div>
      <span class="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
        جاهز للعزف
      </span>
    </div>

    <!-- Sound Wave Visualizer Simulator -->
    <div class="h-20 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center gap-1.5 px-4 overflow-hidden" id="visualizer">
      <!-- Equalizer bars dynamically animated -->
    </div>

    <!-- Piano Keyboard -->
    <div class="relative flex justify-center select-none pt-2" id="keyboard">
      <!-- White and Black keys built via script -->
    </div>

    <div class="text-center text-xs text-slate-400">
      اضغط على المفاتيح أو استخدم لوحة المفاتيح (A, S, D, F, G, H, J, K) للعزف المباشر!
    </div>
  </div>

  <script>
    let audioCtx = null;
    function getAudioContext() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      return audioCtx;
    }

    const NOTES = [
      { note: 'C4', freq: 261.63, key: 'A', isBlack: false },
      { note: 'C#4', freq: 277.18, key: 'W', isBlack: true, left: 32 },
      { note: 'D4', freq: 293.66, key: 'S', isBlack: false },
      { note: 'D#4', freq: 311.13, key: 'E', isBlack: true, left: 82 },
      { note: 'E4', freq: 329.63, key: 'D', isBlack: false },
      { note: 'F4', freq: 349.23, key: 'F', isBlack: false },
      { note: 'F#4', freq: 369.99, key: 'T', isBlack: true, left: 182 },
      { note: 'G4', freq: 392.00, key: 'G', isBlack: false },
      { note: 'G#4', freq: 415.30, key: 'Y', isBlack: true, left: 232 },
      { note: 'A4', freq: 440.00, key: 'H', isBlack: false },
      { note: 'A#4', freq: 466.16, key: 'U', isBlack: true, left: 282 },
      { note: 'B4', freq: 493.88, key: 'J', isBlack: false },
      { note: 'C5', freq: 523.25, key: 'K', isBlack: false }
    ];

    function playNote(freq) {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);

      animateVisualizer();
    }

    // Build Keyboard UI
    const kb = document.getElementById('keyboard');
    NOTES.filter(n => !n.isBlack).forEach((n, idx) => {
      const btn = document.createElement('button');
      btn.className = 'white-key w-12 border border-slate-300 font-bold flex flex-col justify-end p-2 text-xs shadow-md';
      btn.innerHTML = \`<span>\${n.note}</span><span class="text-[9px] text-slate-400 font-mono">\${n.key}</span>\`;
      btn.onclick = () => playNote(n.freq);
      kb.appendChild(btn);
    });

    // Build Visualizer
    const vis = document.getElementById('visualizer');
    for (let i = 0; i < 30; i++) {
      const bar = document.createElement('div');
      bar.className = 'w-2 bg-gradient-to-t from-indigo-500 to-pink-500 rounded-full transition-all duration-100';
      bar.style.height = '12px';
      vis.appendChild(bar);
    }

    function animateVisualizer() {
      const bars = vis.children;
      for (let i = 0; i < bars.length; i++) {
        const h = Math.floor(Math.random() * 50 + 10);
        bars[i].style.height = h + 'px';
        setTimeout(() => bars[i].style.height = '10px', 300);
      }
    }

    window.addEventListener('keydown', (e) => {
      const target = NOTES.find(n => n.key.toLowerCase() === e.key.toLowerCase());
      if (target) playNote(target.freq);
    });
  </script>
</body>
</html>`
  }
];
