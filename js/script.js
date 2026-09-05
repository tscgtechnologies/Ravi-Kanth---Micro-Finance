/**
 * Ravi Kanth Finance - Main JavaScript
 * Microfinance & Small Business Finance (Telangana, India)
 * Clean Vanilla JavaScript - Pure & Lightweight
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNavigation();
  initFaqAccordion();
  initLoanCalculator();
  initForms();
  initBackToTop();
  initActiveNavLink();
});

/* --------------------------------------------------------------------------
   1. Sticky Header
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.mobile-backdrop');
  const closeBtn = document.querySelector('.drawer-close');

  if (!hamburger || !drawer || !backdrop) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  // Close drawer on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Close drawer when a navigation link is clicked
  const drawerLinks = drawer.querySelectorAll('a');
  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });
}

/* --------------------------------------------------------------------------
   3. Active Navigation Link Detection
   -------------------------------------------------------------------------- */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .drawer-link, .dropdown-item, .drawer-sublink');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Normalize href (remove query params or hash if any)
    const linkPath = href.split('#')[0];
    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
      
      // If it is inside dropdown, mark parent active as well
      const parentDropdown = link.closest('.has-dropdown');
      if (parentDropdown) {
        const parentLink = parentDropdown.querySelector('.nav-link');
        if (parentLink) parentLink.classList.add('active');
      }
    }
  });
}

/* --------------------------------------------------------------------------
   4. FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other active items for clean single-accordion feel
      faqItems.forEach((other) => {
        if (other !== item && other.classList.contains('active')) {
          other.classList.remove('active');
          const otherAnswer = other.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
          const otherBtn = other.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. Interactive Repayment Estimator / Calculator
   -------------------------------------------------------------------------- */
function initLoanCalculator() {
  const amountSlider = document.getElementById('calc-amount-slider');
  const amountValue = document.getElementById('calc-amount-val');
  const tenureSlider = document.getElementById('calc-tenure-slider');
  const tenureValue = document.getElementById('calc-tenure-val');
  const resultEmi = document.getElementById('calc-monthly-emi');
  const resultTotal = document.getElementById('calc-total-repay');

  if (!amountSlider || !amountValue || !tenureSlider || !tenureValue || !resultEmi) return;

  const updateCalculation = () => {
    const principal = parseFloat(amountSlider.value);
    const months = parseInt(tenureSlider.value, 10);

    // Format currency string for display
    amountValue.textContent = '₹' + Number(principal).toLocaleString('en-IN');
    tenureValue.textContent = months + ' Months';

    // Illustrative sample interest rate for demo calculator (e.g. sample flat 12% p.a. for transparent visual demonstration)
    // Note: Marked clearly on UI as sample illustrative calculation only, subject to eligibility & company terms
    const annualRate = 0.12;
    const totalInterest = principal * annualRate * (months / 12);
    const totalRepay = principal + totalInterest;
    const monthlyEmi = Math.round(totalRepay / months);

    resultEmi.textContent = '₹' + Number(monthlyEmi).toLocaleString('en-IN');
    if (resultTotal) {
      resultTotal.textContent = '₹' + Number(Math.round(totalRepay)).toLocaleString('en-IN');
    }
  };

  amountSlider.addEventListener('input', updateCalculation);
  tenureSlider.addEventListener('input', updateCalculation);
  updateCalculation();
}

/* --------------------------------------------------------------------------
   6. Form Validation & Submission Handling (Demo Mode)
   -------------------------------------------------------------------------- */
function initForms() {
  // Modal references
  const modal = document.getElementById('success-modal');
  const modalClose = document.getElementById('modal-close-btn');

  const showModal = (title, message) => {
    if (!modal) {
      alert(message);
      return;
    }
    const titleEl = modal.querySelector('.modal-title');
    const descEl = modal.querySelector('.modal-text');
    if (titleEl && title) titleEl.textContent = title;
    if (descEl && message) descEl.textContent = message;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // A. Loan Enquiry Form
  const enquiryForm = document.getElementById('loan-enquiry-form');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const fullName = enquiryForm.querySelector('#enquiry-name');
      const phone = enquiryForm.querySelector('#enquiry-phone');
      const location = enquiryForm.querySelector('#enquiry-location');
      const service = enquiryForm.querySelector('#enquiry-service');
      const amount = enquiryForm.querySelector('#enquiry-amount');

      // Helper validation
      const validateField = (field, condition) => {
        if (!field) return;
        const errSpan = field.parentElement.querySelector('.error-text');
        if (!condition) {
          field.classList.add('error');
          if (errSpan) errSpan.style.display = 'block';
          isValid = false;
        } else {
          field.classList.remove('error');
          if (errSpan) errSpan.style.display = 'none';
        }
      };

      // Full Name check (at least 2 letters)
      validateField(fullName, fullName && fullName.value.trim().length >= 2);

      // Indian 10-digit mobile check
      const phoneVal = phone ? phone.value.replace(/\s+/g, '').replace('+91', '') : '';
      const phoneValid = /^[6-9]\d{9}$/.test(phoneVal);
      validateField(phone, phoneValid);

      // Location check
      validateField(location, location && location.value.trim().length >= 2);

      // Service selected
      validateField(service, service && service.value !== '');

      // Amount selected
      validateField(amount, amount && amount.value !== '');

      if (isValid) {
        const nameVal = fullName.value.trim();
        const phoneValClean = phone.value.trim();
        const emailEl = enquiryForm.querySelector('#enquiry-email');
        const emailVal = emailEl ? emailEl.value.trim() : '';
        const locationVal = location.value.trim();
        const serviceText = service.options[service.selectedIndex] ? service.options[service.selectedIndex].text : service.value;
        const amountText = amount.options[amount.selectedIndex] ? amount.options[amount.selectedIndex].text : amount.value;
        const purposeEl = enquiryForm.querySelector('#enquiry-purpose');
        const purposeVal = purposeEl ? purposeEl.value.trim() : '';
        const messageEl = enquiryForm.querySelector('#enquiry-message');
        const messageVal = messageEl ? messageEl.value.trim() : '';

        let waMessage = `Hello Ravi Kanth Finance,\n` +
          `I would like to submit a Loan Enquiry:\n\n` +
          `• Name: ${nameVal}\n` +
          `• Phone: ${phoneValClean}\n` +
          `• Location: ${locationVal}, Telangana\n` +
          `• Finance Service: ${serviceText}\n` +
          `• Amount Needed: ${amountText}\n` +
          `• Purpose: ${purposeVal}`;

        if (emailVal) {
          waMessage += `\n• Email: ${emailVal}`;
        }
        if (messageVal) {
          waMessage += `\n• Message: ${messageVal}`;
        }

        const whatsappNumber = '919000000000';
        const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`;

        // Redirect directly to WhatsApp
        window.location.href = waUrl;
      }
    });
  }

  // B. Contact Us Form
  const contactForm = document.getElementById('contact-us-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const name = contactForm.querySelector('#contact-name');
      const phone = contactForm.querySelector('#contact-phone');
      const message = contactForm.querySelector('#contact-message');

      const validateField = (field, condition) => {
        if (!field) return;
        const errSpan = field.parentElement.querySelector('.error-text');
        if (!condition) {
          field.classList.add('error');
          if (errSpan) errSpan.style.display = 'block';
          isValid = false;
        } else {
          field.classList.remove('error');
          if (errSpan) errSpan.style.display = 'none';
        }
      };

      validateField(name, name && name.value.trim().length >= 2);
      
      const phoneVal = phone ? phone.value.replace(/\s+/g, '').replace('+91', '') : '';
      const phoneValid = /^[6-9]\d{9}$/.test(phoneVal);
      validateField(phone, phoneValid);

      validateField(message, message && message.value.trim().length >= 5);

      if (isValid) {
        const contactName = name.value.trim();
        const contactPhone = phone.value.trim();
        const contactEmail = contactForm.querySelector('#contact-email')?.value.trim() || '';
        const contactMsg = message.value.trim();

        let waText = `Hello Ravi Kanth Finance,\n` +
          `I would like to send a message:\n\n` +
          `• Name: ${contactName}\n` +
          `• Phone: ${contactPhone}`;
        if (contactEmail) {
          waText += `\n• Email: ${contactEmail}`;
        }
        waText += `\n• Message: ${contactMsg}`;

        const whatsappNumber = '919000000000';
        const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waText)}`;

        // Redirect directly to WhatsApp
        window.location.href = waUrl;
      }
    });
  }
}

/* --------------------------------------------------------------------------
   7. Back To Top Floating Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const topBtn = document.querySelector('.floating-top');
  if (!topBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      topBtn.classList.add('visible');
    } else {
      topBtn.classList.remove('visible');
    }
  }, { passive: true });

  topBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
