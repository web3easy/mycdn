// Добавляем CSS для скрытия содержимого
const style = document.createElement("style");
style.innerHTML = "body { visibility: hidden; }";
document.head.appendChild(style);

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
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const userId = localStorage.getItem("user_id");
    if (!userId) {
        window.location.href = '/buy-pro-plan'; 
        return;
    }

    try {
        const { data: subscription, error } = await supabase
            .from("user_subscriptions")
            .select("status")
            .eq("user_id", userId)
            .single();

        if (error || !subscription || subscription.status === "Expired") {
            window.location.href = '/buy-pro-plan'; 
        } else if (subscription.status === "Active") {
            document.body.style.visibility = "visible"; // Показываем содержимое после успешной проверки
        }
    } catch (error) {
        console.error("Ошибка при проверке подписки:", error);
        window.location.href = '/404'; 
    }
}

// Вызов функции для проверки подписки
checkSubscriptionStatus();
