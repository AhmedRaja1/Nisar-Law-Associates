/**
 * NISAR LAW ASSOCIATES - MODERN JAVASCRIPT APPLICATION
 * Handles Theme Toggling, Interactivity, Contact Modals, Copy Tools, vCard generation & Forms
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initPracticeFilters();
  initFaqAccordion();
  initCopyButtons();
  initVCardDownload();
  initCaseForm();
  initScrollSpy();
});

/* ---------------- Theme Management ---------------- */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('nla_theme');

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon(true);
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    updateThemeIcon(false);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const isDark = currentTheme === 'dark';
      const newTheme = isDark ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('nla_theme', newTheme);
      updateThemeIcon(!isDark);
      showToast(`Switched to ${newTheme} mode`);
    });
  }
}

function updateThemeIcon(isDark) {
  const iconSpan = document.getElementById('theme-icon');
  if (!iconSpan) return;
  
  if (isDark) {
    // Sun icon
    iconSpan.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
  } else {
    // Moon icon
    iconSpan.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  }
}

/* ---------------- Navbar & Navigation ---------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking links
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }
}

/* ---------------- Practice Areas Filter & Modals ---------------- */
function initPracticeFilters() {
  const tabBtns = document.querySelectorAll('.filter-tabs .tab-btn');
  const practiceCards = document.querySelectorAll('.practice-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      practiceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* Practice Area Consultation Inquire Modal / Pre-fill */
window.inquirePractice = function(practiceName) {
  const practiceSelect = document.getElementById('form-practice');
  const contactSection = document.getElementById('contact');
  
  if (practiceSelect) {
    for (let i = 0; i < practiceSelect.options.length; i++) {
      if (practiceSelect.options[i].text.toLowerCase().includes(practiceName.toLowerCase()) || 
          practiceSelect.options[i].value.toLowerCase().includes(practiceName.toLowerCase())) {
        practiceSelect.selectedIndex = i;
        break;
      }
    }
  }

  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
    showToast(`Selected practice area: ${practiceName}`);
  }
};

/* ---------------- FAQ Accordion ---------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    questionBtn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      if (!isActive) {
        item.classList.add('active');
        if (answer) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      } else {
        item.classList.remove('active');
        if (answer) {
          answer.style.maxHeight = null;
        }
      }
    });
  });
}

/* ---------------- Copy to Clipboard ---------------- */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('[data-copy]');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!`;
        showToast(`Copied to clipboard: ${textToCopy}`);

        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2000);
      }).catch(err => {
        console.error('Clipboard copy failed:', err);
      });
    });
  });
}

/* ---------------- Toast Notifications ---------------- */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  let iconSvg = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1e8e3e" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
  
  toast.innerHTML = `${iconSvg} <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/* ---------------- Digital vCard (.vcf) Generator ---------------- */
function initVCardDownload() {
  const vcardBtns = document.querySelectorAll('.download-vcard-btn');

  vcardBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      generateVCard();
    });
  });
}

function generateVCard() {
  const vCardData = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:Ahmed;Sardar Nisar;;Advocate High Court;',
    'FN:Sardar Nisar Ahmed (Advocate High Court)',
    'ORG:Nisar Law Associates - Advocates & Legal Consultants',
    'TITLE:Advocate High Court / Senior Partner',
    'TEL;TYPE=CELL,VOICE:+923335644634',
    'TEL;TYPE=CELL,VOICE:+923135644634',
    'EMAIL;TYPE=PREF,INTERNET:sardarnisar72@yahoo.com',
    'ADR;TYPE=WORK,POSTAL,PARCEL:;;Flat No. 4, First Floor, Block No. 31, D-Type, FGEHA, Sector G-11/3;Islamabad;;;Pakistan',
    'NOTE:Practicing at Islamabad High Court & District Courts. Specializing in Civil, Criminal, Corporate & Labor Jurisprudence.',
    'URL:https://nisarlawassociates.com',
    'END:VCARD'
  ].join('\r\n');

  const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Sardar_Nisar_Ahmed_Nisar_Law_Associates.vcf');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('Digital Business Card (.vcf) downloaded!');
}

/* ---------------- Case Consultation Form ---------------- */
function initCaseForm() {
  const form = document.getElementById('consultation-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name')?.value.trim();
    const phone = document.getElementById('form-phone')?.value.trim();
    const email = document.getElementById('form-email')?.value.trim();
    const practice = document.getElementById('form-practice')?.value;
    const urgency = document.getElementById('form-urgent')?.checked ? 'URGENT / Within 24-48 Hours' : 'Standard Routine Review';
    const message = document.getElementById('form-message')?.value.trim();

    if (!name || !phone || !message) {
      showToast('Please fill in your name, contact phone, and case summary.', 'error');
      return;
    }

    // Compose formatted WhatsApp & Email messages
    const formattedText = `*New Case Consultation Request - Nisar Law Associates*\n\n` +
      `*Client Name:* ${name}\n` +
      `*Phone:* ${phone}\n` +
      `*Email:* ${email || 'N/A'}\n` +
      `*Practice Area:* ${practice}\n` +
      `*Matter Urgency:* ${urgency}\n\n` +
      `*Case Summary / Details:*\n${message}\n\n` +
      `_Submitted via Nisar Law Associates Web Portal_`;

    // Show Confirmation Modal
    openSubmissionModal({
      name,
      phone,
      email,
      practice,
      urgency,
      message,
      formattedText
    });
  });
}

function openSubmissionModal(data) {
  let modal = document.getElementById('submission-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'submission-modal';
    modal.className = 'modal-backdrop';
    document.body.appendChild(modal);
  }

  const encodedWa = encodeURIComponent(data.formattedText);
  const waUrl = `https://wa.me/923335644634?text=${encodedWa}`;
  
  const mailtoSubject = encodeURIComponent(`Legal Consultation Request: ${data.name} - ${data.practice}`);
  const mailtoBody = encodeURIComponent(data.formattedText);
  const mailtoUrl = `mailto:sardarnisar72@yahoo.com?subject=${mailtoSubject}&body=${mailtoBody}`;

  modal.innerHTML = `
    <div class="modal-dialog">
      <button class="modal-close-btn" onclick="closeSubmissionModal()">&times;</button>
      <div style="text-align:center; margin-bottom: 20px;">
        <div style="width:56px; height:56px; border-radius:50%; background:var(--google-green-light); color:var(--google-green-dark); display:inline-flex; align-items:center; justify-content:center; margin-bottom:12px;">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h3 style="font-family:var(--font-heading); font-size:1.4rem; color:var(--text-primary);">Consultation Request Prepared</h3>
        <p style="font-size:0.9rem; color:var(--text-secondary); margin-top:4px;">How would you like to transmit your inquiry to Sardar Nisar Ahmed?</p>
      </div>

      <div style="background:var(--bg-secondary); padding:16px; border-radius:var(--radius-md); font-size:0.875rem; margin-bottom:20px; border:1px solid var(--border-subtle);">
        <p><strong>Client:</strong> ${data.name} (${data.phone})</p>
        <p><strong>Practice:</strong> ${data.practice}</p>
        <p><strong>Priority:</strong> <span style="color:${data.urgency.includes('URGENT') ? 'var(--google-red)' : 'var(--google-green)'}">${data.urgency}</span></p>
      </div>

      <div style="display:flex; flex-direction:column; gap:10px;">
        <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-green btn-lg" style="width:100%;">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          Send via WhatsApp Directly
        </a>
        <a href="${mailtoUrl}" class="btn btn-outline-blue btn-lg" style="width:100%;">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          Send via Official Email
        </a>
        <button onclick="closeSubmissionModal()" class="btn btn-outline" style="width:100%;">
          Close Window
        </button>
      </div>
    </div>
  `;

  modal.classList.add('open');
}

window.closeSubmissionModal = function() {
  const modal = document.getElementById('submission-modal');
  if (modal) {
    modal.classList.remove('open');
  }
};

/* ---------------- Business Card Modal ---------------- */
window.openCardModal = function() {
  let modal = document.getElementById('card-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'card-modal';
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal-dialog card-modal-dialog">
        <button class="modal-close-btn" onclick="closeCardModal()">&times;</button>
        <h3 style="font-family:var(--font-heading); font-size:1.35rem; color:var(--text-primary); margin-top:6px;">Official Visiting Card</h3>
        <p style="font-size:0.875rem; color:var(--text-secondary); margin-top:4px;">Nisar Law Associates • Sardar Nisar Ahmed (Advocate High Court)</p>
        <img src="assets/images/card.jpg" alt="Sardar Nisar Ahmed Advocate High Court Business Card" class="business-card-img-preview" loading="lazy">
        <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
          <button onclick="generateVCard()" class="btn btn-green btn-sm">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download vCard File
          </button>
          <a href="tel:+923335644634" class="btn btn-primary btn-sm">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            Dial 0333-5644634
          </a>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  modal.classList.add('open');
};

window.closeCardModal = function() {
  const modal = document.getElementById('card-modal');
  if (modal) {
    modal.classList.remove('open');
  }
};

/* ---------------- Scroll Spy for Nav Highlighting ---------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 160;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
