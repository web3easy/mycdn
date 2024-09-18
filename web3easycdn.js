// Инициализация Supabase
const getSupabaseClient = () => {
    if (typeof window !== "undefined" && window.supabase) {
        const SUPABASE_URL = "https://ghataqmohtpgkzlxagyd.supabase.co";
        const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoYXRhcW1vaHRwZ2t6bHhhZ3lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYwODU1OTAsImV4cCI6MjA0MTY2MTU5MH0.nbckSGmfcmh-nG9Fozny8HI0Z8UgP3xvC4-mxbNHb-M";

        return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    console.error("Supabase не загружен");
    return null;
};

// Список защищённых страниц
const protectedPages = ["/berachain"];

// HTML для колесика загрузки
const loadingSpinnerHTML = `
    <div id="loading-spinner" style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top: 4px solid #fff;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        z-index: 9999;
        display: none;
    "></div>

    <style>
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
`;

// Вставка колесика в DOM
const addLoadingSpinnerToDOM = () => {
    const div = document.createElement('div');
    div.innerHTML = loadingSpinnerHTML;
    document.body.appendChild(div);
    console.log("Колесико загрузки добавлено в DOM.");
};

// Показать колесико загрузки
const showLoadingSpinner = () => {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.style.display = 'block'; // Отображение спиннера
        console.log("Колесико загрузки отображено.");
    } else {
        console.log("Колесико загрузки не найдено в DOM.");
    }
};

// Скрыть колесико загрузки
const hideLoadingSpinner = () => {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.style.display = 'none'; // Скрытие спиннера
        console.log("Колесико загрузки скрыто.");
    }
};

// Скрыть содержимое страницы с черным фоном и показать колесико
const hidePageContent = () => {
    document.body.style.visibility = 'hidden';
    document.body.style.backgroundColor = '#000'; // Установка черного фона
    showLoadingSpinner(); // Показать спиннер
};

// После успешной проверки подписки скрыть спиннер и показать страницу
const checkSubscriptionStatus = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const userId = localStorage.getItem("user_id");
    if (!userId) {
        window.location.href = '/login';
        return;
    }

    try {
        // Проверка подписки пользователя
        const { data: subscription, error } = await supabase
            .from("user_subscriptions")
            .select("status")
            .eq("user_id", userId)
            .single();

        if (error || !subscription || subscription.status !== "Active") {
            window.location.href = '/subscription'; // Редирект на страницу продления подписки
        } else {
            hideLoadingSpinner(); // Скрыть спиннер
            document.body.style.visibility = 'visible'; // Показать содержимое страницы
        }
    } catch (error) {
        console.error("Ошибка при проверке подписки:", error);
        window.location.href = '/error'; // Редирект в случае ошибки
    }
};

// Проверка, находится ли пользователь на защищённой странице
const initPageCheck = () => {
    if (protectedPages.includes(window.location.pathname)) {
        hidePageContent(); // Скрываем страницу
        checkSubscriptionStatus(); // Проверяем подписку
    }
};

// Отслеживание переходов между страницами для сайтов с динамической навигацией (SPA)
const monitorUrlChanges = () => {
    const pushState = history.pushState;
    const replaceState = history.replaceState;

    history.pushState = function () {
        pushState.apply(history, arguments);
        initPageCheck();
    };

    history.replaceState = function () {
        replaceState.apply(history, arguments);
        initPageCheck();
    };

    window.addEventListener('popstate', initPageCheck); // При нажатии "Назад" или "Вперед"
};

// Запуск проверки
window.addEventListener('DOMContentLoaded', () => {
    addLoadingSpinnerToDOM(); // Добавить колесико на страницу
    initPageCheck(); // Инициализировать проверку страницы
    monitorUrlChanges(); // Отслеживать изменение URL
});
