document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const body = document.body;
  
  // --- Layout Toggle Logic ---
  const layoutButtons = document.querySelectorAll('[data-layout-set]');
  
  function setLayout(layout) {
    root.setAttribute('data-layout', layout);
    try {
      localStorage.setItem('mc-nav-layout', layout);
    } catch (e) {
      // ignore localStorage errors
    }
    
    layoutButtons.forEach(btn => {
      const isActive = btn.dataset.layoutSet === layout;
      btn.setAttribute('aria-pressed', isActive.toString());
    });

    // If switching to Layout B on desktop, ensure sidebar is closed
    if (layout === 'b' && window.innerWidth >= 768) {
      closeSidebar();
    }
  }

  layoutButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setLayout(btn.dataset.layoutSet);
    });
  });

  // --- Sidebar Logic ---
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const sidebarClose = document.getElementById('sidebarClose');

  function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    sidebar.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    sidebar.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
  }

  // Close sidebar on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      closeSidebar();
    }
  });

  // Close sidebar on resize if moving to Layout B on desktop
  window.addEventListener('resize', () => {
    if (root.getAttribute('data-layout') === 'b' && window.innerWidth >= 768) {
      closeSidebar();
    }
  });

  // --- Add to Cart Logic ---
  const cartCount = document.getElementById('cartCount');
  const cartStatus = document.getElementById('cartStatus');
  let count = 0;

  const addToCartButtons = document.querySelectorAll('[data-add-to-cart]');
  
  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productName = button.dataset.addToCart;
      count++;
      if (cartCount) cartCount.textContent = count;
      
      // Update button text temporarily
      const originalText = button.textContent;
      button.textContent = 'Added';
      button.disabled = true;
      
      if (cartStatus) {
        cartStatus.textContent = `${productName} added to cart.`;
      }

      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 1500);
    });
  });

  // --- Initialize Layout from localStorage (fallback to 'a') ---
  let savedLayout = 'a';
  try {
    savedLayout = localStorage.getItem('mc-nav-layout') || 'a';
  } catch (e) {
    savedLayout = 'a';
  }
  setLayout(savedLayout);
});
