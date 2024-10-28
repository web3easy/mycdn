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
const protectedPages = ["/story", "/ithaca", "/soneium", "/eclipse"]; 

// Скрыть содержимое страницы перед проверкой
const hidePageContent = () => {
    document.body.style.visibility = 'hidden';
    document.body.style.backgroundColor = '#000'; // Черный фон вместо белого
};

// Показать содержимое страницы после проверки
const showPageContent = () => {
    document.body.style.visibility = 'visible';
};

// Функция для проверки подписки
const checkSubscriptionStatus = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const userId = localStorage.getItem("user_id");
    if (!userId) {
        window.location.href = '/login'; // Редирект на страницу логина, если user_id отсутствует
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
            window.location.href = '/pricing'; // Редирект на страницу продления подписки
        } else {
            showPageContent(); // Показать содержимое страницы после успешной проверки
        }
    } catch (error) {
        console.error("Ошибка при проверке подписки:", error);
        window.location.href = '/404'; // Редирект в случае ошибки
    }
};

// Проверка, находится ли пользователь на защищённой странице
const initPageCheck = () => {
    if (protectedPages.includes(window.location.pathname)) {
        hidePageContent(); // Скрываем страницу до проверки
        checkSubscriptionStatus(); // Проверяем подписку
    }
};

// Отслеживание изменения URL с помощью popstate и pushState
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

// Инициализация проверки страницы при первой загрузке
window.addEventListener('load', () => {
    initPageCheck();
    monitorUrlChanges();
});
