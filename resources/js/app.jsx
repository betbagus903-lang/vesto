import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './Context/ThemeContext';
import { LanguageProvider } from './Context/LanguageContext';
import { ToastProvider } from './Components/ToastProvider';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeProvider>
                <LanguageProvider>
                    <ToastProvider>
                        <App {...props} />
                    </ToastProvider>
                </LanguageProvider>
            </ThemeProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
