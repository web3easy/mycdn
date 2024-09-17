window.onload = function() {
    console.log("window.supabase:", window.supabase);

    if (typeof window.supabase === "undefined" || !window.supabase.createClient) {
        console.error("Supabase не загружен");
        return;
    }
    const getSupabaseClient = () => {
        const SUPABASE_URL = "https://ghataqmohtpgkzlxagyd.supabase.co";
        const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoYXRhcW1vaHRwZ2t6bHhhZ3lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYwODU1OTAsImV4cCI6MjA0MTY2MTU5MH0.nbckSGmfcmh-nG9Fozny8HI0Z8UgP3xvC4-mxbNHb-M";

        return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    };

    console.log("Supabase клиент инициализирован");
    // Вызов функции для проверки подписки
    checkSubscriptionStatus();
};

