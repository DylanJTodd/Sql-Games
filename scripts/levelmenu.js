function toggleMenu() {
    const menu = document.getElementById('levelMenu');
    if (menu.style.display === 'none') {
        menu.style.display = 'block';
        if (localStorage.getItem('currentLevel') === null) { localStorage.setItem('currentLevel', 1);}
        const currentLevel = parseInt(localStorage.getItem('currentLevel'), 10) || 0;
        const levels = [
            { num: 1, link: 'play.html?caller=1'},
            { num: 2, link: 'play.html?caller=2'},
            { num: 3, link: 'play.html?caller=3'},
            { num: 4, link: 'play.html?caller=4'},
            { num: 5, link: 'play.html?caller=5'},
            { num: 6, link: 'play.html?caller=6'},
            { num: 7, link: 'play.html?caller=7'},
            { num: 8, link: 'play.html?caller=8'},
            { num: 9, link: 'play.html?caller=9'},
            { num: 10, link: 'play.html?caller=10'}
        ];
        
        menu.innerHTML = levels.map(level => {
            const isDisabled = level.num > currentLevel;
            return `<a href="${isDisabled ? '#' : level.link}" style="text-decoration: none; color: inherit; pointer-events: ${isDisabled ? 'none' : 'auto'};">
                <div style="padding: 12px 16px; cursor: ${isDisabled ? 'not-allowed' : 'pointer'}; transition: all 0.2s ease; border-radius: 8px; margin: 2px 0; background: ${isDisabled ? 'white' : 'white'}; color: ${isDisabled ? '#a0a0a0' : 'inherit'};"
                     onmouseover="if(!${isDisabled}) { this.style.background='#f5f5f5'; this.style.color='#ED1C24'; }" 
                     onmouseout="if(!${isDisabled}) { this.style.background='white'; this.style.color='inherit'; }">
                    Level ${level.num}
                </div>
            </a>`;
        }).join('');
    } else {
        menu.style.display = 'none';
    }
}

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