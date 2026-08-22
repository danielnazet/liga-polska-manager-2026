import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sateazutrhtjdzareblw.supabase.co';
const supabaseKey = 'sb_publishable_bFQezKL0rXmZz9NaWiy-1g_gvNhx83i';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  const { data, error } = await supabase.from('clubs').select('count');
  if (error) {
    console.log('Status message:', error.message);
    if (error.code === '42P01' || error.message.includes('relation') || error.message.includes('not find')) {
      console.log('Połączenie udane! Tabele nie zostały jeszcze utworzone w PostgreSQL.');
    }
  } else {
    console.log('Połączenie udane! Dane z tabeli:', data);
  }
}

testConnection();
