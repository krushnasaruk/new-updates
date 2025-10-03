/**
 * Student Attendance Dashboard - JavaScript
 * 
 * This file contains all JavaScript functionality for the dashboard including:
 * - Toast notification system
 * - Search functionality
 * - Theme management
 * - Mobile navigation
 * - Performance monitoring
 * - Accessibility features
 * 
 * @author Krushna Saruk
 * @version 2.0
 */

/**
 * Toast Notification Manager
 * Handles display of success, error, warning, and info notifications
 */
class ToastManager {
  constructor() {
    this.container = document.getElementById('toastContainer');
    this.toasts = [];
  }
  
  /**
   * Show a toast notification
   * @param {string} message - The message to display
   * @param {string} type - Type of notification (success, error, warning, info)
   * @param {number} duration - Duration in milliseconds (default: 4000)
   */
  show(message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="flex: 1;">
          <div style="font-weight: 600; margin-bottom: 4px;">${this.getTypeTitle(type)}</div>
          <div style="font-size: 14px; opacity: 0.9;">${message}</div>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: var(--muted); cursor: pointer; padding: 4px; border-radius: 4px; font-size: 18px;">&times;</button>
      </div>
    `;
    
    this.container.appendChild(toast);
    this.toasts.push(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto remove after duration
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentElement) {
          toast.remove();
          this.toasts = this.toasts.filter(t => t !== toast);
        }
      }, 400);
    }, duration);
  }
  
  /**
   * Get the title for notification type
   * @param {string} type - Notification type
   * @returns {string} Title for the notification
   */
  getTypeTitle(type) {
    const titles = {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Information'
    };
    return titles[type] || 'Notification';
  }
}

/**
 * Search Manager
 * Handles search functionality with real-time filtering and navigation
 */
class SearchManager {
  constructor() {
    this.input = document.getElementById('searchInput');
    this.results = document.getElementById('searchResults');
    this.mobileInput = document.getElementById('mobileSearchInput');
    this.mobileResults = null;
    
    // Search data for filtering
    this.searchData = [
      { title: 'Attendance Insights', section: 'insights', icon: '📊' },
      { title: 'Records', section: 'records', icon: '📋' },
      { title: 'Location', section: 'location', icon: '📍' },
      { title: 'Extracurricular', section: 'extracurricular', icon: '⭐' },
      { title: 'Reports', section: 'reports', icon: '📈' },
      { title: 'Settings', section: 'settings', icon: '⚙️' },
      { title: 'Mathematics', section: 'class', icon: '📐' },
      { title: 'Physics', section: 'class', icon: '⚛️' },
      { title: 'Chemistry', section: 'class', icon: '🧪' },
      { title: 'Computer Science', section: 'class', icon: '💻' }
    ];
    
    this.init();
  }
  
  /**
   * Initialize search functionality
   */
  init() {
    if (this.input) {
      this.input.addEventListener('input', this.handleSearch.bind(this));
      this.input.addEventListener('focus', this.showResults.bind(this));
      this.input.addEventListener('blur', () => {
        setTimeout(() => this.hideResults(), 200);
      });
    }
    
    if (this.mobileInput) {
      this.mobileInput.addEventListener('input', this.handleSearch.bind(this));
    }
  }
  
  /**
   * Handle search input events
   * @param {Event} e - Input event
   */
  handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    
    if (query.length < 2) {
      this.hideResults();
      return;
    }
    
    const results = this.searchData.filter(item => 
      item.title.toLowerCase().includes(query)
    ).slice(0, 5);
    
    this.displayResults(results, e.target === this.input ? this.results : this.mobileResults);
  }
  
  /**
   * Display search results
   * @param {Array} results - Filtered search results
   * @param {HTMLElement} container - Container to display results in
   */
  displayResults(results, container) {
    if (!container) return;
    
    container.innerHTML = '';
    
    if (results.length === 0) {
      container.innerHTML = '<div class="search-result-item" style="color: var(--muted); font-style: italic;">No results found</div>';
    } else {
      results.forEach(result => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML = `
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 16px;">${result.icon}</span>
            <span>${result.title}</span>
          </div>
        `;
        item.addEventListener('click', () => {
          this.navigateToSection(result.section);
          container.style.display = 'none';
        });
        container.appendChild(item);
      });
    }
    
    container.style.display = 'block';
  }
  
  /**
   * Show search results
   */
  showResults() {
    if (this.input.value.length >= 2) {
      this.handleSearch({ target: this.input });
    }
  }
  
  /**
   * Hide search results
   */
  hideResults() {
    if (this.results) this.results.style.display = 'none';
    if (this.mobileResults) this.mobileResults.style.display = 'none';
  }
  
  /**
   * Navigate to a specific section
   * @param {string} section - Section to navigate to
   */
  navigateToSection(section) {
    const sectionMap = {
      insights: () => document.querySelector('[data-section="insights"]').click(),
      records: () => window.location.href = 'records.html',
      location: () => window.location.href = 'location.html',
      extracurricular: () => window.location.href = 'extracurricular.html',
      reports: () => window.location.href = 'reports.html',
      settings: () => window.location.href = 'settings.html'
    };
    
    if (sectionMap[section]) {
      sectionMap[section]();
    }
  }
}

/**
 * Loading State Manager
 * Handles loading skeletons and states
 */
class LoadingManager {
  /**
   * Show loading skeleton
   * @param {HTMLElement} element - Element to show skeleton in
   */
  static showSkeleton(element) {
    if (!element) return;
    
    element.innerHTML = `
      <div class="skeleton-text" style="width: 60%;"></div>
      <div class="skeleton-text" style="width: 40%;"></div>
      <div class="skeleton-text" style="width: 80%;"></div>
    `;
    element.classList.add('skeleton');
  }
  
  /**
   * Hide loading skeleton and show content
   * @param {HTMLElement} element - Element to hide skeleton from
   * @param {string} content - Content to display
   */
  static hideSkeleton(element, content) {
    if (!element) return;
    
    setTimeout(() => {
      element.classList.remove('skeleton');
      element.innerHTML = content;
      element.classList.add('animate-fadeInUp');
    }, 1000);
  }
}

/**
 * Theme Manager
 * Handles dark/light theme switching and persistence
 */
class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById('themeToggle');
    this.init();
  }
  
  /**
   * Initialize theme functionality
   */
  init() {
    this.applySavedTheme();
    window.addEventListener('pageshow', this.applySavedTheme.bind(this));
    
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', this.toggleTheme.bind(this));
    }
  }
  
  /**
   * Apply saved theme from localStorage
   */
  applySavedTheme() {
    try {
      const saved = localStorage.getItem('theme');
      const shouldBeLight = saved === 'light';
      document.body.classList.toggle('light-theme', shouldBeLight);
    } catch (e) {
      console.warn('localStorage not available');
    }
  }
  
  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    document.body.classList.toggle('light-theme');
    try {
      const isLight = document.body.classList.contains('light-theme');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    } catch (e) {
      console.warn('localStorage not available');
    }
  }
}

/**
 * Mobile Navigation Manager
 * Handles mobile sidebar and navigation
 */
class MobileNavManager {
  constructor() {
    this.hamburger = document.getElementById('hamburger');
    this.sidebar = document.getElementById('sidebar');
    this.mobileOpen = false;
    this.init();
  }
  
  /**
   * Initialize mobile navigation
   */
  init() {
    if (this.hamburger && this.sidebar) {
      this.hamburger.addEventListener('click', this.toggleSidebar.bind(this));
    }
  }
  
  /**
   * Toggle mobile sidebar
   */
  toggleSidebar() {
    this.mobileOpen = !this.mobileOpen;
    if (window.innerWidth <= 880) {
      this.sidebar.classList.toggle('mobile-open', this.mobileOpen);
      
      if (this.mobileOpen) {
        this.createBackdrop();
      } else {
        this.removeBackdrop();
      }
    }
  }
  
  /**
   * Create backdrop for mobile sidebar
   */
  createBackdrop() {
    const backdrop = document.createElement('div');
    backdrop.id = 'mobile-backdrop';
    backdrop.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.35);z-index:90';
    backdrop.addEventListener('click', () => {
      this.mobileOpen = false;
      this.sidebar.classList.remove('mobile-open');
      backdrop.remove();
    });
    document.body.appendChild(backdrop);
  }
  
  /**
   * Remove backdrop
   */
  removeBackdrop() {
    const existing = document.getElementById('mobile-backdrop');
    if (existing) existing.remove();
  }
}

/**
 * Profile Menu Manager
 * Handles user profile dropdown menu
 */
class ProfileMenuManager {
  constructor() {
    this.avatarBtn = document.getElementById('avatarBtn');
    this.profileMenu = document.getElementById('profileMenu');
    this.init();
  }
  
  /**
   * Initialize profile menu
   */
  init() {
    if (this.avatarBtn && this.profileMenu) {
      this.avatarBtn.addEventListener('click', this.toggleMenu.bind(this));
      window.addEventListener('click', this.handleOutsideClick.bind(this));
    }
  }
  
  /**
   * Toggle profile menu visibility
   */
  toggleMenu() {
    this.profileMenu.style.display = this.profileMenu.style.display === 'block' ? 'none' : 'block';
  }
  
  /**
   * Handle clicks outside the menu
   * @param {Event} e - Click event
   */
  handleOutsideClick(e) {
    if (!this.avatarBtn.contains(e.target) && !this.profileMenu.contains(e.target)) {
      this.profileMenu.style.display = 'none';
    }
  }
}

/**
 * Navigation Manager
 * Handles section navigation and routing
 */
class NavigationManager {
  constructor() {
    this.init();
  }
  
  /**
   * Initialize navigation
   */
  init() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', this.handleNavigation.bind(this, item));
    });
  }
  
  /**
   * Handle navigation item clicks
   * @param {HTMLElement} item - Navigation item clicked
   */
  handleNavigation(item) {
    const section = item.getAttribute('data-section');
    
    // Navigate to section pages
    const sectionRoutes = {
      extracurricular: 'extracurricular.html',
      records: 'records.html',
      location: 'location.html',
      reports: 'reports.html',
      settings: 'settings.html',
      moodle: () => window.open('https://dpesmoodle.com/dpcoe/', '_blank')
    };
    
    if (section === 'moodle') {
      sectionRoutes.moodle();
      return;
    }
    
    if (sectionRoutes[section]) {
      window.location.href = sectionRoutes[section];
      return;
    }
    
    // Handle insights section (current page)
    if (section === 'insights') {
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    }
  }
}

/**
 * Search Toggle Manager
 * Handles mobile search toggle
 */
class SearchToggleManager {
  constructor() {
    this.searchToggle = document.getElementById('searchToggle');
    this.mobileSearchBar = document.getElementById('mobileSearchBar');
    this.searchOpen = false;
    this.init();
  }
  
  /**
   * Initialize search toggle
   */
  init() {
    if (this.searchToggle && this.mobileSearchBar) {
      this.searchToggle.addEventListener('click', this.toggleSearch.bind(this));
      document.addEventListener('click', this.handleOutsideClick.bind(this));
    }
  }
  
  /**
   * Toggle mobile search bar
   */
  toggleSearch() {
    this.searchOpen = !this.searchOpen;
    this.mobileSearchBar.style.display = this.searchOpen ? 'block' : 'none';
    if (this.searchOpen) {
      document.getElementById('mobileSearchInput').focus();
    }
  }
  
  /**
   * Handle clicks outside search toggle
   * @param {Event} e - Click event
   */
  handleOutsideClick(e) {
    if (!this.searchToggle?.contains(e.target) && !this.mobileSearchBar?.contains(e.target)) {
      this.searchOpen = false;
      this.mobileSearchBar.style.display = 'none';
    }
  }
}

/**
 * Animation Manager
 * Handles page animations and transitions
 */
class AnimationManager {
  constructor() {
    this.init();
  }
  
  /**
   * Initialize animations
   */
  init() {
    this.setupPageLoadAnimations();
    this.setupScrollAnimations();
    this.setupProgressBarAnimations();
  }
  
  /**
   * Setup page load animations
   */
  setupPageLoadAnimations() {
    document.addEventListener('DOMContentLoaded', () => {
      // Animate cards on load
      const cards = document.querySelectorAll('.card');
      cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 100);
      });
    });
  }
  
  /**
   * Setup scroll-triggered animations
   */
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeInUp');
        }
      });
    }, observerOptions);
    
    // Observe cards for scroll animations
    document.querySelectorAll('.card, .class-timings, .extracurricular-section').forEach(el => {
      observer.observe(el);
    });
  }
  
  /**
   * Setup progress bar animations
   */
  setupProgressBarAnimations() {
    setTimeout(() => {
      const progressBars = document.querySelectorAll('.progress-bar');
      progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
          bar.style.width = width;
        }, 200);
      });
    }, 500);
  }
}

/**
 * Keyboard Manager
 * Handles keyboard shortcuts and accessibility
 */
class KeyboardManager {
  constructor() {
    this.init();
  }
  
  /**
   * Initialize keyboard functionality
   */
  init() {
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }
  
  /**
   * Handle keyboard events
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleKeydown(e) {
    // Ctrl/Cmd + K for search focus
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        searchInput.focus();
      }
    }
    
    // Escape to close modals/dropdowns
    if (e.key === 'Escape') {
      document.getElementById('profileMenu').style.display = 'none';
      if (window.searchManager) {
        window.searchManager.hideResults();
      }
    }
  }
}

/**
 * Performance Monitor
 * Monitors and reports performance metrics
 */
class PerformanceMonitor {
  constructor() {
    this.init();
  }
  
  /**
   * Initialize performance monitoring
   */
  init() {
    if ('performance' in window) {
      window.addEventListener('load', this.reportPerformance.bind(this));
    }
  }
  
  /**
   * Report performance metrics
   */
  reportPerformance() {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      if (perfData && perfData.loadEventEnd - perfData.loadEventStart < 1000) {
        if (window.toastManager) {
          window.toastManager.show(
            'Dashboard loaded in ' + Math.round(perfData.loadEventEnd - perfData.loadEventStart) + 'ms', 
            'success', 
            2000
          );
        }
      }
    }, 100);
  }
}

/**
 * Service Worker Manager
 * Handles PWA functionality
 */
class ServiceWorkerManager {
  constructor() {
    this.init();
  }
  
  /**
   * Initialize service worker
   */
  init() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        // Service worker would be registered here in a real implementation
        console.log('Service Worker support detected');
      });
    }
  }
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================

// Initialize all managers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize managers
  window.toastManager = new ToastManager();
  window.searchManager = new SearchManager();
  window.themeManager = new ThemeManager();
  window.mobileNavManager = new MobileNavManager();
  window.profileMenuManager = new ProfileMenuManager();
  window.navigationManager = new NavigationManager();
  window.searchToggleManager = new SearchToggleManager();
  window.animationManager = new AnimationManager();
  window.keyboardManager = new KeyboardManager();
  window.performanceMonitor = new PerformanceMonitor();
  window.serviceWorkerManager = new ServiceWorkerManager();
  
  // Set current year
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.innerText = new Date().getFullYear();
  }
  
  // Setup logout functionality
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      window.location.href = 'login.html';
    });
  }
  
  // Enhanced button handlers with toast notifications
  const notifBtn = document.getElementById('notifBtn');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      window.toastManager.show('No new notifications', 'info', 2000);
    });
  }
  
  const calendarBtn = document.getElementById('calendarBtn');
  if (calendarBtn) {
    calendarBtn.addEventListener('click', () => {
      window.toastManager.show('Calendar feature coming soon!', 'info', 3000);
    });
  }
  
  // Enhanced mobile button handlers
  const mobileCalendarBtn = document.getElementById('mobileCalendarBtn');
  if (mobileCalendarBtn) {
    mobileCalendarBtn.addEventListener('click', () => {
      window.toastManager.show('Calendar feature coming soon!', 'info', 3000);
    });
  }
  
  const mobileNotifBtn = document.getElementById('mobileNotifBtn');
  if (mobileNotifBtn) {
    mobileNotifBtn.addEventListener('click', () => {
      window.toastManager.show('No new notifications', 'info', 2000);
    });
  }
  
  // Show welcome toast
  setTimeout(() => {
    window.toastManager.show('Welcome back, Krushna! Dashboard loaded successfully.', 'success', 4000);
  }, 1000);
});

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
