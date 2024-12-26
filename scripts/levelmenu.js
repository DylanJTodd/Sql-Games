function toggleMenu() {
    const menu = document.getElementById('levelMenu');
    if (menu.style.display === 'none') {
        menu.style.display = 'block';
        const levels = [
            { num: 1, link: 'level1.html'},
            { num: 2, link: 'level2.html'},
            { num: 3, link: 'level3.html'},
            { num: 4, link: 'level4.html'},
            { num: 5, link: 'level5.html'},
            { num: 6, link: 'level6.html'},
            { num: 7, link: 'level7.html'},
            { num: 8, link: 'level8.html'},
            { num: 9, link: 'level9.html'},
            { num: 10, link: 'level10.html'}
        ];
        
        menu.innerHTML = levels.map(level => 
            `<a href="${level.link}" style="text-decoration: none; color: inherit;">
                <div style="padding: 12px 16px; cursor: pointer; transition: all 0.2s ease; border-radius: 4px; margin: 2px 0;"
                     onmouseover="this.style.background='#f5f5f5'; this.style.color='#ED1C24';" 
                     onmouseout="this.style.background='white'; this.style.color='inherit'">
                    Level ${level.num}
                </div>
            </a>`
        ).join('');
    } else {
        menu.style.display = 'none';
    }
}

// Add media query in JavaScript
function updateMenuWidth() {
    const menu = document.getElementById('levelMenu');
    if (window.innerWidth <= 768) {
        menu.style.width = '100px';
        menu.style.right = '22px';
    } else {
        menu.style.width = '240px';
        menu.style.right = '22px';
    }
}

window.addEventListener('resize', updateMenuWidth);
document.addEventListener('click', (e) => {
    if (!e.target.closest('#levelMenu') && !e.target.closest('a')) {
        document.getElementById('levelMenu').style.display = 'none';
    }
});