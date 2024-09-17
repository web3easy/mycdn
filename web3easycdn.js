// Функция для отображения индикатора загрузки
function showLoadingIndicator() {
    const loader = document.createElement('div');
    loader.id = 'loading-indicator';
    loader.style.position = 'fixed';
    loader.style.top = '50%';
    loader.style.left = '50%';
    loader.style.transform = 'translate(-50%, -50%)';
    loader.style.fontSize = '20px';
    loader.innerText = 'Загрузка...';
    document.body.appendChild(loader);
}

// Функция для скрытия индикатора загрузки
function hideLoadingIndicator() {
    const loader = document.getElementById('loading-indicator');
    if (loader) {
        loader.remove();
    }
}

// Функция для инициализации Supabase клиента
const getSupabaseClient = () => {
    if (typeof window !== "undefined" && window.supabase) {
        const SUPABASE_URL = "https://ghataqmohtpgkzlxagyd.supabase.co";
        const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoYXRhcW1vaHRwZ2t6bHhhZ3lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYwODU1OTAsImV4cCI6MjA0MTY2MTU5MH0.nbckSGmfcmh-nG9Fozny8HI0Z8UgP3xvC4-mxbNHb-M";

        return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    console.error("Supabase не загружен");
    return null;
};

// Функция для проверки статуса подписки
async function checkSubscriptionStatus() {
    showLoadingIndicator();  // Показать индикатор загрузки
    const supabase = getSupabaseClient();
    if (!supabase) {
        hideLoadingIndicator();
        return; // Прерываем выполнение, если Supabase не инициализирован
    }

    const userId = localStorage.getItem("user_id");
    if (!userId) {
        window.location.href = '/buy-pro-plan'; // Редирект на страницу подписки
        hideLoadingIndicator();
        return;
    }

    try {
        // Запрос к таблице user_subscriptions для проверки статуса
        const { data: subscription, error } = await supabase
            .from("user_subscriptions")
            .select("status")
            .eq("user_id", userId)
            .single();

        hideLoadingIndicator();  // Скрыть индикатор загрузки

        if (error || !subscription || subscription.status === "Expired") {
            window.location.href = '/buy-pro-plan'; // Редирект на страницу с продлением подписки
        } else if (subscription.status === "Active") {
            console.log("Доступ разрешен");
            document.body.style.display = 'block'; // Показать содержимое страницы
        }
    } catch (error) {
        console.error("Ошибка при проверке подписки:", error);
        window.location.href = '/404'; // Редирект в случае ошибки
        hideLoadingIndicator();
    }
}

// Прячем содержимое страницы до завершения проверки
document.body.style.display = 'none';
checkSubscriptionStatus();  // Вызов функции проверки подписки
