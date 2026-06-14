const sidebar = document.querySelector('.sidebar');
const sidebarToogleBtn = document.querySelectorAll('.sidebar-toggle');
const themeToogleBtn = document.querySelector('.theme-toggle');
const ThemeIcon = themeToogleBtn.querySelector('.theme-icon');

//Actualizacion de iconos en el sidebar
const updateThemeIcon = () => {
    const isDark = document.body.classList.contains('dark-theme');
    ThemeIcon.textContent = sidebar.classList.contains('collapsed')? (isDark ? 'light_mode':'dark_mode'): 'dark_mode';
}

//Aplicar preferencias y salvar tema oscuro
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme:dark)').matches;
const shouldUseDarkTheme = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);

document.body.classList.toggle('dark-theme', shouldUseDarkTheme);
updateThemeIcon();

//Toggle collapsed Ocultar Sidebar
sidebarToogleBtn.forEach((btn) =>{
    btn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    updateThemeIcon()
});
})

//Cambio de tema con un click del boton
themeToogleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem ('theme', isDark? 'dark': 'light');
    updateThemeIcon();
})

if(window.innerWidth > 768)sidebar.classList.add('collapsed');