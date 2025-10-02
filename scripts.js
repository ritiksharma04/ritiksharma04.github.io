function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.getElementById('checkbox');
    const body = document.body;

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-theme');
            themeSwitch.checked = true;
        } else {
            body.classList.remove('dark-theme');
            themeSwitch.checked = false;
        }
    };

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }

    const toggleTheme = () => {
        const newTheme = body.classList.contains('dark-theme') ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    themeSwitch.addEventListener('change', toggleTheme);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    const sections = document.querySelectorAll('.fade-in');
    sections.forEach(section => {
        observer.observe(section);
    });

    // View count
    const viewCount = document.getElementById('view-count');
    let count = localStorage.getItem('viewCount');
    if (count === null) {
        count = 119;
    } else {
        count = parseInt(count) + 1;
    }
    localStorage.setItem('viewCount', count);
    viewCount.innerHTML = `<i class="fas fa-eye"></i> ${count}`;

    // Set resume link
    const resumeBtn = document.querySelector('.resume-btn');
    resumeBtn.href = resumeLink;
});
