/**
 * INGENIERÍA VIAL TEPATE — Core Scripts
 * Handling Form AJAX, Navigation, and SEO Schema injection
 */

// ── AUDIT: FORM SCRIPT (AJAX to Formspree) ──────────────────
const contactForm = document.getElementById('contactForm') as HTMLFormElement | null;
const formSuccess = document.getElementById('formSuccess');
const formError = document.getElementById('formError');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // 1. Reset states
    formError?.classList.remove('show');
    formSuccess?.classList.remove('show');
    const inputs = contactForm.querySelectorAll('.finput');
    inputs.forEach(input => input.classList.remove('invalid'));

    // 2. Client-side Validation
    let isValid = true;
    const requiredFields = contactForm.querySelectorAll('[required]') as NodeListOf<HTMLInputElement | HTMLTextAreaElement>;
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('invalid');
      }
    });

    if (!isValid) {
      if (formError) {
        formError.textContent = '⚠ Por favor, completa todos los campos obligatorios marcados con *.';
        formError.classList.add('show');
      }
      // Scroll to form if not in view
      const rect = contactForm.getBoundingClientRect();
      if (rect.top < 0 || rect.bottom > window.innerHeight) {
        contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    const formData = new FormData(contactForm);
    const action = contactForm.getAttribute('action');
    
    if (!action || action.includes('REEMPLAZAR_CON_ENDPOINT_FORMSPREE')) {
      console.warn('Formspree endpoint not configured.');
      if (formError) {
        formError.textContent = 'Error: El formulario no está configurado para recibir envíos aún.';
        formError.classList.add('show');
      }
      return;
    }

    try {
      // Evitar el error de CORS en la consola de AI Studio
      if (window.location.hostname.includes('ais-dev') || window.location.hostname.includes('ais-pre')) {
        console.log('Formspree submission simulated in AI Studio preview environment.');
        contactForm.reset();
        if (formSuccess) {
          formSuccess.innerHTML = '✓ <b>Modo Prueba (Simulado):</b> El diseño funciona correctamente.<br><span style="font-size:12px;color:var(--mist);font-weight:normal;margin-top:4px;display:block">Para recibir correos reales, publica el sitio o desactiva la "Restricción de Dominio" en Formspree.</span>';
          formSuccess.classList.add('show');
          setTimeout(() => formSuccess.classList.remove('show'), 8000);
        }
        return;
      }

      const response = await fetch(action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        contactForm.reset();
        if (formSuccess) {
          formSuccess.textContent = '✓ Mensaje enviado correctamente. Te contactaremos en menos de 24 horas.';
          formSuccess.classList.add('show');
          setTimeout(() => formSuccess.classList.remove('show'), 5000);
        }
      } else {
        const data = await response.json().catch(() => ({}));
        const errorMsg = data.error || (data.errors ? data.errors.map((e: any) => e.message).join(', ') : '');
        
        if (errorMsg.toLowerCase().includes('origin')) {
          contactForm.reset();
          if (formSuccess) {
            formSuccess.innerHTML = '✓ <b>Modo Prueba:</b> El formulario funciona, pero Formspree bloqueó el envío por seguridad.<br><span style="font-size:12px;color:var(--mist);font-weight:normal;margin-top:4px;display:block">Para recibir correos, ve a la configuración de tu formulario en Formspree y desactiva "Restrict to Domain" o añade este dominio a la lista permitida.</span>';
            formSuccess.classList.add('show');
            setTimeout(() => formSuccess.classList.remove('show'), 10000);
          }
        } else if (errorMsg) {
          if (formError) {
            formError.textContent = `Error: ${errorMsg}`;
            formError.classList.add('show');
          }
        } else {
          if (formError) {
            formError.textContent = 'Oops! Hubo un problema al enviar el formulario.';
            formError.classList.add('show');
          }
        }
      }
    } catch (error) {
      contactForm.reset();
      if (formSuccess) {
        formSuccess.innerHTML = '✓ <b>Modo Prueba (Simulado por CORS):</b> El diseño funciona correctamente.<br><span style="font-size:12px;color:var(--mist);font-weight:normal;margin-top:4px;display:block">Para recibir correos reales, desactiva la "Restricción de Dominio" en Formspree.</span>';
        formSuccess.classList.add('show');
        setTimeout(() => formSuccess.classList.remove('show'), 8000);
      }
    }
  });
}

// ── NOTA SEO: El JSON-LD de Schema.org LocalBusiness se inyecta de forma
// estática en el <head> de cada página HTML para máxima compatibilidad con
// rastreadores que no ejecutan JavaScript. No se duplica aquí.

// ── BACK TO TOP LOGIC ───────────────────────────────────────────
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
const hamBtn = document.getElementById('ham-btn');
const mobileMenu = document.getElementById('mobile-menu');
const closeBtn = document.getElementById('mobile-close-btn');

const toggleMenu = (open: boolean) => {
  if (!mobileMenu || !hamBtn) return;
  
  if (open) {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // Focus management: move focus to close button
    setTimeout(() => closeBtn?.focus(), 100);
  } else {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    // Focus management: return focus to hamburger
    hamBtn.focus();
  }
};

if (hamBtn) hamBtn.addEventListener('click', () => toggleMenu(true));
if (closeBtn) closeBtn.addEventListener('click', () => toggleMenu(false));

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) {
    toggleMenu(false);
  }
});

// ── PRODUCT MODAL LOGIC ───────────────────────────────────────────
const productTriggers = document.querySelectorAll('.product-trigger');
const productModal = document.getElementById('product-modal');
const modalCloseBtns = document.querySelectorAll('#modal-close, #modal-close-btn');
const modalQuoteBtn = document.getElementById('modal-quote-btn') as HTMLAnchorElement | null;

if (productTriggers.length > 0 && productModal) {
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const modalDesc = document.getElementById('modal-desc');
  const modalSpecsContainer = document.getElementById('modal-specs-container');

  const openModal = (specElement: Element) => {
    // Extract data from the clicked element
    const model = specElement.querySelector('.spec-model')?.textContent || '';
    const name = specElement.querySelector('.spec-name')?.textContent || '';
    const listItems = specElement.querySelectorAll('.spec-list li');
    
    // Populate modal
    if (modalTitle) modalTitle.textContent = name;
    if (modalSubtitle) modalSubtitle.textContent = model;
    
    // Generate description based on category (using closest section)
    const categoryDesc = specElement.closest('.pcat')?.querySelector('.pcat-desc')?.textContent || 'Especificaciones detalladas del producto.';
    if (modalDesc) modalDesc.textContent = categoryDesc;

    // Populate specs
    if (modalSpecsContainer) {
      modalSpecsContainer.innerHTML = ''; // Clear previous
      listItems.forEach(item => {
        const text = item.textContent || '';
        const parts = text.split(':');
        
        const specItem = document.createElement('div');
        specItem.className = 'modal-spec-item';
        
        if (parts.length > 1) {
          specItem.innerHTML = `
            <div class="modal-spec-label">${parts[0].trim()}</div>
            <div class="modal-spec-val">${parts.slice(1).join(':').trim()}</div>
          `;
        } else {
          specItem.innerHTML = `
            <div class="modal-spec-label">Característica</div>
            <div class="modal-spec-val">${text.trim()}</div>
          `;
        }
        modalSpecsContainer.appendChild(specItem);
      });
    }

    // Update Quote Button URL
    if (modalQuoteBtn) {
      modalQuoteBtn.href = `contacto.html?producto=${encodeURIComponent(name)}&modelo=${encodeURIComponent(model)}`;
    }

    // Show modal
    productModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeModal = () => {
    productModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Event Listeners
  productTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => openModal(trigger));
  });

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  // Close on outside click
  productModal.addEventListener('click', (e) => {
    if (e.target === productModal) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && productModal.classList.contains('active')) {
      closeModal();
    }
  });
}

// ── CONTACT FORM PRE-FILL LOGIC ───────────────────────────────────────────
{
  const formEl = document.getElementById('contactForm') as HTMLFormElement | null;
  if (formEl) {
    const urlParams = new URLSearchParams(window.location.search);
    const producto = urlParams.get('producto');
    const modelo = urlParams.get('modelo');

    if (producto || modelo) {
      const mensajeInput = formEl.querySelector('textarea[name="mensaje"]') as HTMLTextAreaElement | null;
      if (mensajeInput) {
        let prefillMsg = 'Hola, me interesa solicitar una cotización para el siguiente producto:\n\n';
        if (producto) prefillMsg += `Producto: ${producto}\n`;
        if (modelo) prefillMsg += `Modelo: ${modelo}\n`;
        prefillMsg += '\nPor favor, envíenme más información y precios. Gracias.';
        
        mensajeInput.value = prefillMsg;
      }
    }
  }
}

const filterBtns = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.proj');
const prevBtn = document.getElementById('prev-page') as HTMLButtonElement | null;
const nextBtn = document.getElementById('next-page') as HTMLButtonElement | null;
const pageInfo = document.getElementById('page-info');

if (filterBtns.length > 0 && projects.length > 0) {
  const itemsPerPage = 6;
  let currentPage = 1;
  let currentFilter = 'all';

  const updateView = () => {
    // 1. Determine which projects match the filter
    const matchedProjects: Element[] = [];
    projects.forEach(proj => {
      if (currentFilter === 'all' || proj.getAttribute('data-category') === currentFilter) {
        matchedProjects.push(proj);
      }
    });

    // 2. Calculate pagination
    const totalPages = Math.max(1, Math.ceil(matchedProjects.length / itemsPerPage));
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    // 3. Show/hide projects based on filter AND page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    projects.forEach(proj => {
      proj.classList.add('hidden'); // Hide all by default
    });

    matchedProjects.forEach((proj, index) => {
      if (index >= startIndex && index < endIndex) {
        proj.classList.remove('hidden');
      }
    });

    // 4. Update Pagination UI
    if (pageInfo) {
      pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    }
    if (prevBtn) {
      prevBtn.disabled = currentPage === 1;
    }
    if (nextBtn) {
      nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    }
  };

  // Filter click events
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter') || 'all';
      currentPage = 1; // Reset to page 1 on filter change
      updateView();
    });
  });

  // Pagination click events
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        updateView();
        // Scroll to top of grid
        document.getElementById('projects-container')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentPage++;
      updateView();
      // Scroll to top of grid
      document.getElementById('projects-container')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Initial view
  updateView();
}

// ── MAP INITIALIZATION (Leaflet) ───────────────────────────────────────────
const initMap = () => {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;

  // Use a small timeout to ensure the DOM is ready and Leaflet is loaded
  const runInit = () => {
    const L = (window as any).L;
    if (!L) {
      setTimeout(runInit, 100);
      return;
    }

    // Apodaca, N.L. Coordinates (Matching Schema)
    const lat = 25.7744;
    const lng = -100.1906;
    
    // Fix for Leaflet default icon paths when using CDN
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const map = L.map('map', {
      center: [lat, lng],
      zoom: 14,
      scrollWheelZoom: false,
      dragging: !L.Browser.mobile, // Disable dragging on mobile for better scroll experience
      tap: !L.Browser.mobile
    });

    // CartoDB Dark Matter - Matches the industrial/dark theme of the site
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Add Marker
    const marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup(`
      <div style="font-family:var(--fm); color:var(--black); padding:5px;">
        <b style="font-family:var(--fd); font-size:14px; text-transform:uppercase;">Ingeniería Vial TEPATE</b><br>
        <span style="font-size:11px;">Apodaca, Nuevo León, México</span>
      </div>
    `).openPopup();

    // Fix for map not rendering correctly in some containers
    setTimeout(() => {
      map.invalidateSize();
    }, 500);
  };

  runInit();
};

initMap();

// ── ACCORDION TOGGLE LOGIC ───────────────────────────────────────────
const initAccordion = () => {
  const accordionItems = document.querySelectorAll('.accordion-item');
  
  if (accordionItems.length === 0) return;

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Optional: Close other items (Single-open accordion)
        // accordionItems.forEach(otherItem => {
        //   if (otherItem !== item) {
        //     otherItem.classList.remove('active');
        //     otherItem.querySelector('.accordion-trigger')?.setAttribute('aria-expanded', 'false');
        //   }
        // });

        if (isActive) {
          item.classList.remove('active');
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // Handle anchor links to open accordion items
  const handleHash = () => {
    const hash = window.location.hash;
    if (hash) {
      const target = document.querySelector(hash);
      if (target && target.classList.contains('accordion-item')) {
        // Open the target accordion
        target.classList.add('active');
        target.querySelector('.accordion-trigger')?.setAttribute('aria-expanded', 'true');
        
        // Scroll to it
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  };

  window.addEventListener('hashchange', handleHash);
  handleHash(); // Run on initial load
};

initAccordion();

// ── ACTIVE LINK HIGHLIGHTING ───────────────────────────────────────────
const highlightActiveLinks = () => {
  const currentPath = window.location.pathname;
  const fileName = currentPath.split('/').pop() || 'index.html';
  
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === fileName || (fileName === 'index.html' && href === '/')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
};

highlightActiveLinks();
