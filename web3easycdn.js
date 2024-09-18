// Инициализация Supabase
const getSupabaseClient = () => {
    if (typeof window !== "undefined" && window.supabase) {
        const SUPABASE_URL = "https://ghataqmohtpgkzlxagyd.supabase.co";
        const SUPABASE_ANON_KEY = "ваш_anon_key";

        return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    console.error("Supabase не загружен");
    return null;
};

// Список защищённых страниц
const protectedPages = ["/protected", "/account", "/settings"]; 

// Скрыть содержимое страницы перед проверкой
const hidePageContent = () => {
    document.body.style.visibility = 'hidden';
    document.body.style.backgroundColor = '#000'; // Черный фон
};

// Показать содержимое страницы после проверки
const showPageContent = () => {
    document.body.style.visibility = 'visible';
};

// Функция для проверки подписки с задержкой рендеринга
const checkSubscriptionStatus = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const userId = localStorage.getItem("user_id");
    if (!userId) {
        window.location.href = '/login'; // Редирект на страницу логина
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
            setTimeout(() => { // Задержка отображения контента
                showPageContent(); // Показать содержимое страницы после успешной проверки
            }, 500); // Задержка в 500 мс для плавности
        }
    } catch (error) {
        console.error("Ошибка при проверке подписки:", error);
        window.location.href = '/error'; // Редирект в случае ошибки
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
