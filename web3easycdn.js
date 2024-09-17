const supabaseUrl = 'https://ghataqmohtpgkzlxagyd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoYXRhcW1vaHRwZ2t6bHhhZ3lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYwODU1OTAsImV4cCI6MjA0MTY2MTU5MH0.nbckSGmfcmh-nG9Fozny8HI0Z8UgP3xvC4-mxbNHb-M';
const supabase = createClient(supabaseUrl, supabaseKey);


async function checkSubscriptionStatus() {
  const userId = localStorage.getItem('user_id');
  if (!userId) {
    window.location.href = '/buy-pro-plan';
    return;
  }

  try {
    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .select('status')
      .eq('user_id', userId)
      .single();

    if (error || !subscription || subscription.status === 'Expired') {
      window.location.href = '/buy-pro-plan';
    } else if (subscription.status === 'Active') {
      console.log('Access granted');
    }
  } catch (error) {
    console.error('Error checking subscription:', error);
    window.location.href = '/404';
  }
}

checkSubscriptionStatus();
