import { ref, onMounted } from 'vue';

const theme = ref('dark');

export function useTheme() {
    const initTheme = () => {
        const saved = localStorage.getItem('admin-theme');
        theme.value = saved || 'dark';
        applyTheme(theme.value);
    };

    const applyTheme = (mode) => {
        if (mode === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const toggleTheme = () => {
        theme.value = theme.value === 'dark' ? 'light' : 'dark';
        localStorage.setItem('admin-theme', theme.value);
        applyTheme(theme.value);
    };

    const isDark = () => theme.value === 'dark';

    onMounted(() => {
        initTheme();
    });

    return { theme, toggleTheme, isDark };
}
