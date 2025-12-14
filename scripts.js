// ===== PORTFOLIO DATA =====
let portfolioData = null;

// ===== DOM ELEMENTS =====
const elements = {
  nameOutput: document.getElementById('nameOutput'),
  roleTyping: document.getElementById('roleTyping'),
  taglineOutput: document.getElementById('taglineOutput'),
  resumeBtn: document.getElementById('resumeBtn'),
  skillsContainer: document.getElementById('skillsContainer'),
  projectsGrid: document.getElementById('projectsGrid'),
  experienceTimeline: document.getElementById('experienceTimeline'),
  educationTimeline: document.getElementById('educationTimeline'),
  contactLinks: document.getElementById('contactLinks'),
  skillModal: document.getElementById('skillModal'),
  modalIcon: document.getElementById('modalIcon'),
  modalTitle: document.getElementById('modalTitle'),
  modalLevel: document.getElementById('modalLevel'),
  modalExperience: document.getElementById('modalExperience'),
  modalProjects: document.getElementById('modalProjects'),
  modalProjectsSection: document.getElementById('modalProjectsSection'),
  navLinks: document.getElementById('navLinks'),
  hamburger: document.getElementById('hamburger')
};

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', async () => {
  await loadPortfolioData();
  initTypingAnimation();
  initFadeInAnimations();
});

// ===== LOAD JSON DATA =====
async function loadPortfolioData() {
  try {
    const response = await fetch('./data/portfolio.json');
    portfolioData = await response.json();
    renderAll();
  } catch (error) {
    console.error('Error loading portfolio data:', error);
    showFallbackContent();
  }
}

// ===== RENDER ALL SECTIONS =====
function renderAll() {
  renderHero();
  renderApiDemo();
  renderExperienceTimeline();
  renderEducationTimeline();
  renderSkills();
  renderProjects();
  renderContact();
}

// ===== HERO SECTION =====
function renderHero() {
  const { personal } = portfolioData;

  elements.nameOutput.textContent = `> ${personal.name}`;
  elements.taglineOutput.textContent = `"${personal.tagline}"`;

  if (personal.resume && personal.resume !== '#') {
    elements.resumeBtn.href = personal.resume;
    elements.resumeBtn.addEventListener('click', (e) => {
      if (personal.resume && personal.resume !== '#') {
        window.open(personal.resume, '_blank');
        e.preventDefault();
      }
    });
  }
}

// ===== API DEMO MOCKUP =====
const apiEndpoints = {
  developer: {
    title: 'Get Developer',
    description: 'Returns information about this developer',
    method: 'GET',
    path: '/api/developer',
    url: 'api.ritiksharma.dev/developer',
    response: () => ({
      name: portfolioData.personal.name,
      title: portfolioData.personal.roles[0],
      skills: ['Python', 'FastAPI', 'Django', 'PostgreSQL', 'REST APIs'],
      available: true,
      status: 'Open to work'
    })
  },
  skills: {
    title: 'Get Skills',
    description: 'Returns list of technical skills',
    method: 'GET',
    path: '/api/skills',
    url: 'api.ritiksharma.dev/skills',
    response: () => ({
      total: portfolioData.skills.length,
      categories: ['Languages', 'Frameworks', 'Databases', 'DevOps'],
      skills: portfolioData.skills.slice(0, 6).map(s => ({
        name: s.name,
        level: s.level
      }))
    })
  },
  projects: {
    title: 'Get Projects',
    description: 'Returns featured projects',
    method: 'GET',
    path: '/api/projects',
    url: 'api.ritiksharma.dev/projects',
    response: () => ({
      count: portfolioData.projects.length,
      projects: portfolioData.projects.map(p => ({
        name: p.name,
        tech: p.tech.slice(0, 3)
      }))
    })
  },
  education: {
    title: 'Get Education',
    description: 'Returns educational background',
    method: 'GET',
    path: '/api/education',
    url: 'api.ritiksharma.dev/education',
    response: () => {
      const edu = portfolioData.education[0];
      return {
        degree: edu.degree,
        institution: edu.institution,
        period: edu.period,
        cgpa: 8.06,
        university: 'RGPV University'
      };
    }
  }
};

function renderApiDemo() {
  const apiCode = document.getElementById('apiCode');
  const apiSidebar = document.getElementById('apiSidebar');

  if (!apiCode || !apiSidebar) return;

  // Render initial endpoint
  updateApiDisplay('developer');

  // Add click listeners to sidebar items
  apiSidebar.querySelectorAll('.browser-sidebar-item[data-endpoint]').forEach(item => {
    item.addEventListener('click', () => {
      const endpoint = item.dataset.endpoint;

      // Update active state
      apiSidebar.querySelectorAll('.browser-sidebar-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Update display
      updateApiDisplay(endpoint);
    });
  });
}

function updateApiDisplay(endpointKey) {
  const endpoint = apiEndpoints[endpointKey];
  if (!endpoint) return;

  const apiTitle = document.getElementById('apiTitle');
  const apiDescription = document.getElementById('apiDescription');
  const apiMethod = document.getElementById('apiMethod');
  const apiPath = document.getElementById('apiPath');
  const urlPath = document.getElementById('urlPath');
  const apiCode = document.getElementById('apiCode');

  // Update info
  if (apiTitle) apiTitle.textContent = endpoint.title;
  if (apiDescription) apiDescription.textContent = endpoint.description;
  if (apiMethod) {
    apiMethod.textContent = endpoint.method;
    apiMethod.className = `api-method ${endpoint.method.toLowerCase()}`;
  }
  if (apiPath) apiPath.textContent = endpoint.path;
  if (urlPath) urlPath.textContent = endpoint.url;

  // Update JSON response with syntax highlighting
  if (apiCode) {
    const response = endpoint.response();
    apiCode.innerHTML = renderJson(response);
  }
}

function renderJson(obj, indent = 0) {
  const spaces = '  '.repeat(indent);
  let html = '';

  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return '<span class="code-line">[]</span>';
    }
    html += '<span class="code-line">[</span>';
    obj.forEach((item, i) => {
      const comma = i < obj.length - 1 ? ',' : '';
      if (typeof item === 'object') {
        html += renderJson(item, indent + 1);
        if (comma) html = html.slice(0, -14) + ',' + '</span>';
      } else {
        html += `<span class="code-line">${spaces}  ${formatValue(item)}${comma}</span>`;
      }
    });
    html += `<span class="code-line">${spaces}]</span>`;
  } else if (typeof obj === 'object' && obj !== null) {
    const keys = Object.keys(obj);
    html += `<span class="code-line">${indent > 0 ? spaces : ''}{</span>`;
    keys.forEach((key, i) => {
      const comma = i < keys.length - 1 ? ',' : '';
      const value = obj[key];
      if (Array.isArray(value)) {
        html += `<span class="code-line">${spaces}  <span class="code-property">"${key}"</span>: [</span>`;
        value.forEach((item, j) => {
          const itemComma = j < value.length - 1 ? ',' : '';
          if (typeof item === 'object') {
            html += renderJsonCompact(item, spaces + '    ') + itemComma;
          } else {
            html += `<span class="code-line">${spaces}    ${formatValue(item)}${itemComma}</span>`;
          }
        });
        html += `<span class="code-line">${spaces}  ]${comma}</span>`;
      } else if (typeof value === 'object' && value !== null) {
        html += `<span class="code-line">${spaces}  <span class="code-property">"${key}"</span>: {</span>`;
        Object.keys(value).forEach((subKey, j) => {
          const subComma = j < Object.keys(value).length - 1 ? ',' : '';
          html += `<span class="code-line">${spaces}    <span class="code-property">"${subKey}"</span>: ${formatValue(value[subKey])}${subComma}</span>`;
        });
        html += `<span class="code-line">${spaces}  }${comma}</span>`;
      } else {
        html += `<span class="code-line">${spaces}  <span class="code-property">"${key}"</span>: ${formatValue(value)}${comma}</span>`;
      }
    });
    html += `<span class="code-line">${indent > 0 ? spaces : ''}}</span>`;
  }

  return html;
}

function renderJsonCompact(obj, spaces) {
  let parts = [];
  Object.keys(obj).forEach(key => {
    parts.push(`<span class="code-property">"${key}"</span>: ${formatValue(obj[key])}`);
  });
  return `<span class="code-line">${spaces}{ ${parts.join(', ')} }</span>`;
}

function formatValue(val) {
  if (typeof val === 'string') {
    return `<span class="code-string">"${val}"</span>`;
  } else if (typeof val === 'number') {
    return `<span class="code-number">${val}</span>`;
  } else if (typeof val === 'boolean') {
    return `<span class="code-keyword">${val}</span>`;
  } else if (val === null) {
    return `<span class="code-keyword">null</span>`;
  }
  return String(val);
}

// ===== TYPING ANIMATION =====
function initTypingAnimation() {
  const { personal } = portfolioData;
  const roles = personal.roles;
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      elements.roleTyping.textContent = '> ' + currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      elements.roleTyping.textContent = '> ' + currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 1000);
}

// ===== EXPERIENCE TIMELINE =====
function renderExperienceTimeline() {
  const { experience } = portfolioData;

  elements.experienceTimeline.innerHTML = experience.map((exp, index) => `
    <div class="timeline-item ${index === 0 ? 'expanded' : 'collapsed'}" data-index="${index}">
      <div class="timeline-date">
        <span class="date-range">${exp.period}</span>
      </div>
      <div class="timeline-content">
        <div class="timeline-card" data-date="${exp.period}">
          <div class="timeline-header" onclick="toggleExperience(${index})">
            <div class="timeline-header-info">
              <h3 class="timeline-role">${exp.role}</h3>
              <p class="timeline-company">${exp.company}</p>
            </div>
            <span class="timeline-toggle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </div>
          <div class="timeline-details">
            <ul class="timeline-highlights">
              ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// ===== TOGGLE EXPERIENCE ITEM =====
function toggleExperience(index) {
  const items = elements.experienceTimeline.querySelectorAll('.timeline-item');
  const clickedItem = items[index];

  if (clickedItem.classList.contains('expanded')) {
    // If clicking on already expanded item, collapse it
    clickedItem.classList.remove('expanded');
    clickedItem.classList.add('collapsed');
  } else {
    // Expand clicked item
    clickedItem.classList.remove('collapsed');
    clickedItem.classList.add('expanded');
  }
}

// ===== EDUCATION TIMELINE =====
function renderEducationTimeline() {
  const { education } = portfolioData;

  elements.educationTimeline.innerHTML = education.map(edu => `
    <div class="timeline-item">
      <div class="timeline-date">
        <span class="date-range">${edu.period || ''}</span>
      </div>
      <div class="timeline-content">
        <div class="timeline-card" data-date="${edu.period || ''}">
          <h3 class="timeline-role">${edu.degree}</h3>
          <p class="timeline-company">${edu.institution}</p>
          <p class="education-details">${edu.details}</p>
          ${edu.courses ? `
            <div class="education-courses">
              <span class="courses-label">Relevant Coursework:</span>
              <div class="courses-list">
                ${edu.courses.map(course => `<span class="course-tag">${course}</span>`).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

// ===== SKILLS SECTION =====
function renderSkills() {
  const { skills, skillCategories } = portfolioData;
  const skillsContainer = document.getElementById('skillsContainer');

  if (!skillsContainer) return;

  // Render tabs
  const tabsHtml = skillCategories.map((cat, index) => `
    <button class="skill-tab ${index === 0 ? 'active' : ''}" data-category="${cat}">
      ${cat}
    </button>
  `).join('');

  // Group skills by category
  const skillsByCategory = {};
  skillCategories.forEach(cat => {
    skillsByCategory[cat] = skills.filter(s => s.category === cat);
  });

  // Render skill grids for each category
  const gridsHtml = skillCategories.map((cat, index) => `
    <div class="skill-category-grid ${index === 0 ? 'active' : ''}" data-category="${cat}">
      ${skillsByCategory[cat].map(skill => `
        <div class="skill-card" onclick="openSkillModal('${skill.id}')">
          <img src="${skill.icon}" alt="${skill.name}" class="skill-icon" loading="lazy" onerror="this.src='https://cdn.jsdelivr.net/gh/devicons/devicon/icons/devicon/devicon-original.svg'">
          <div class="skill-name">${skill.name}</div>
          <div class="skill-level">${skill.level}</div>
        </div>
      `).join('')}
    </div>
  `).join('');

  skillsContainer.innerHTML = `
    <div class="skill-tabs">${tabsHtml}</div>
    <div class="skill-grids">${gridsHtml}</div>
  `;

  // Add tab click handlers
  skillsContainer.querySelectorAll('.skill-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.category;

      // Update active tab
      skillsContainer.querySelectorAll('.skill-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update active grid
      skillsContainer.querySelectorAll('.skill-category-grid').forEach(grid => {
        grid.classList.toggle('active', grid.dataset.category === category);
      });
    });
  });
}

// ===== SKILL MODAL =====
function openSkillModal(skillId) {
  const skill = portfolioData.skills.find(s => s.id === skillId);
  if (!skill) return;

  elements.modalIcon.src = skill.icon;
  elements.modalIcon.alt = skill.name;
  elements.modalTitle.textContent = skill.name;
  elements.modalLevel.textContent = skill.level;

  elements.modalExperience.innerHTML = skill.experience
    .map(exp => `<li>${exp}</li>`)
    .join('');

  if (skill.projects && skill.projects.length > 0) {
    const projectNames = skill.projects.map(projectId => {
      const project = portfolioData.projects.find(p => p.id === projectId);
      return project ? `<span class="modal-project-tag" onclick="scrollToProject('${projectId}')">${project.name}</span>` : '';
    }).filter(Boolean).join('');

    elements.modalProjects.innerHTML = projectNames;
    elements.modalProjectsSection.style.display = 'block';
  } else {
    elements.modalProjectsSection.style.display = 'none';
  }

  elements.skillModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  elements.skillModal.classList.remove('active');
  document.body.style.overflow = '';
}

elements.skillModal.addEventListener('click', (e) => {
  if (e.target === elements.skillModal) {
    closeModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

function scrollToProject(projectId) {
  closeModal();
  setTimeout(() => {
    const projectElement = document.querySelector(`[data-project-id="${projectId}"]`);
    if (projectElement) {
      projectElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      projectElement.style.animation = 'pulse 0.5s ease';
    }
  }, 300);
}

// ===== PROJECTS SECTION WITH PREVIEW =====
function renderProjects() {
  const { projects } = portfolioData;

  elements.projectsGrid.innerHTML = projects.map(project => `
    <div class="project-card" data-project-id="${project.id}">
      <div class="project-preview">
        ${project.image
          ? `<img src="${project.image}" alt="${project.name} preview" loading="lazy">`
          : `<div class="project-preview-placeholder">${project.emoji || '🚀'}</div>`
        }
      </div>
      <div class="project-content">
        <h3 class="project-title">${project.name}</h3>
        <p class="project-description">${project.description}</p>
        <ul class="project-highlights">
          ${project.highlights.map(h => `<li>${h}</li>`).join('')}
        </ul>
        <div class="project-tech">
          ${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
        <div class="project-links">
          ${project.github ? `
            <a href="${project.github}" target="_blank" rel="noopener" class="btn btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              View Code
            </a>
          ` : ''}
          ${project.live ? `
            <a href="${project.live}" target="_blank" rel="noopener" class="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Live Demo
            </a>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

// ===== CONTACT SECTION (SCALAR STYLE) =====
function renderContact() {
  const { personal } = portfolioData;

  elements.contactLinks.innerHTML = `
    <div class="contact-link-item">
      <a href="mailto:${personal.email}">Send me an Email</a>
      <span>${personal.email}</span>
    </div>
    <div class="contact-link-item">
      <a href="https://linkedin.com/in/${personal.linkedin}" target="_blank" rel="noopener">Connect on LinkedIn</a>
      <span>linkedin.com/in/${personal.linkedin}</span>
    </div>
    <div class="contact-link-item">
      <a href="https://github.com/${personal.github}" target="_blank" rel="noopener">Check my GitHub</a>
      <span>github.com/${personal.github}</span>
    </div>
  `;
}

// ===== MOBILE MENU =====
function toggleMenu() {
  elements.navLinks.classList.toggle('active');
  elements.hamburger.classList.toggle('active');
}

elements.navLinks.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    elements.navLinks.classList.remove('active');
    elements.hamburger.classList.remove('active');
  }
});

// ===== FADE IN ANIMATIONS =====
function initFadeInAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });
}

// ===== FALLBACK CONTENT =====
function showFallbackContent() {
  elements.nameOutput.textContent = '> Ritik Sharma';
  elements.taglineOutput.textContent = '"Building efficient solutions through clean code"';
  elements.roleTyping.textContent = '> Python Developer';

  elements.skillsContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Loading skills...</p>';
  elements.projectsGrid.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Loading projects...</p>';
  elements.experienceTimeline.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Loading experience...</p>';
}

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});
