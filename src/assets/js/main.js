/**
 * GullStack Client Starter - JavaScript
 * Handles mobile menu, smooth scrolling, and form submission with spam protection
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize timestamp for spam protection
  initializeTimestamp();
  
  // Mobile menu functionality
  initializeMobileMenu();
  
  // Contact form submission
  initializeContactForm();
  
  // Smooth scrolling for anchor links
  initializeSmoothScrolling();
  
  // Fade-in animation on scroll (optional enhancement)
  initializeFadeInAnimation();
});

/**
 * Initialize timestamp token for spam protection
 * Forms must be submitted at least 3 seconds after page load
 */
function initializeTimestamp() {
  const timestampField = document.getElementById('timestampField');
  if (timestampField) {
    timestampField.value = Date.now();
  }
}

/**
 * Mobile hamburger menu toggle
 */
function initializeMobileMenu() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', function() {
      const isActive = navLinks.classList.contains('active');
      
      // Toggle menu
      navLinks.classList.toggle('active');
      mobileToggle.classList.toggle('active');
      
      // Update aria-expanded for accessibility
      mobileToggle.setAttribute('aria-expanded', !isActive);
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = isActive ? 'auto' : 'hidden';
    });
    
    // Close menu when clicking on nav links
    const navLinkItems = navLinks.querySelectorAll('a');
    navLinkItems.forEach(link => {
      link.addEventListener('click', function() {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = 'auto';
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = 'auto';
      }
    });
  }
}

/**
 * Contact form submission with spam protection
 */
function initializeContactForm() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const formMessage = document.getElementById('formMessage');
      
      // Spam protection checks
      if (!validateSpamProtection(formData)) {
        showFormMessage('Please wait a few seconds before submitting the form.', 'error');
        return;
      }
      
      // Show loading state
      showLoadingState(submitButton, true);
      hideFormMessage();
      
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          showFormMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
          contactForm.reset();
          initializeTimestamp(); // Reset timestamp for potential resubmission
        } else {
          const errorData = await response.json().catch(() => ({}));
          showFormMessage(
            errorData.message || 'There was an error sending your message. Please try again or call us directly.',
            'error'
          );
        }
      } catch (error) {
        showFormMessage(
          'There was an error sending your message. Please try again or call us directly.',
          'error'
        );
      } finally {
        showLoadingState(submitButton, false);
      }
    });
  }
}

/**
 * Validate spam protection (honeypot + timestamp)
 */
function validateSpamProtection(formData) {
  // Check honeypot field
  const honeypot = formData.get('fax_number');
  if (honeypot && honeypot.trim() !== '') {
    console.log('Spam detected: honeypot filled');
    return false;
  }
  
  // Check timestamp (minimum 3 seconds)
  const timestamp = formData.get('_timestamp');
  if (timestamp) {
    const submissionTime = Date.now();
    const formLoadTime = parseInt(timestamp);
    const timeDiff = submissionTime - formLoadTime;
    
    if (timeDiff < 3000) { // 3 seconds minimum
      console.log('Spam detected: too fast submission');
      return false;
    }
  }
  
  return true;
}

/**
 * Show/hide form loading state
 */
function showLoadingState(button, isLoading) {
  if (!button) return;
  
  const btnText = button.querySelector('.btn-text');
  const btnLoading = button.querySelector('.btn-loading');
  
  if (isLoading) {
    button.classList.add('loading');
    button.disabled = true;
    if (btnText) btnText.style.display = 'none';
    if (btnLoading) btnLoading.style.display = 'inline';
  } else {
    button.classList.remove('loading');
    button.disabled = false;
    if (btnText) btnText.style.display = 'inline';
    if (btnLoading) btnLoading.style.display = 'none';
  }
}

/**
 * Show form message
 */
function showFormMessage(message, type) {
  const formMessage = document.getElementById('formMessage');
  if (formMessage) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/**
 * Hide form message
 */
function hideFormMessage() {
  const formMessage = document.getElementById('formMessage');
  if (formMessage) {
    formMessage.style.display = 'none';
  }
}

/**
 * Smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip empty anchors
      if (href === '#' || href === '#!') {
        e.preventDefault();
        return;
      }
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        
        // Account for fixed header
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Fade-in animation on scroll (optional enhancement)
 */
function initializeFadeInAnimation() {
  const fadeElements = document.querySelectorAll('.fade-in');
  
  if (fadeElements.length === 0) return;
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );
  
  fadeElements.forEach(element => {
    element.style.animationPlayState = 'paused';
    observer.observe(element);
  });
}

/**
 * Utility function to debounce rapid function calls
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
 * Utility function to throttle function calls
 */
function throttle(func, wait) {
  let time = Date.now();
  return function executedFunction(...args) {
    if ((time + wait - Date.now()) < 0) {
      func(...args);
      time = Date.now();
    }
  };
}