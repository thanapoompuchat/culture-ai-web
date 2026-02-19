// ไฟล์: lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js'

// ⚠️ ใส่ URL และ KEY ของพี่เองที่ได้จากเว็บ Supabase นะครับ
// (วิธีเอา Key: เข้าเว็บ Supabase -> Project Settings -> API)

const supabaseUrl = 'https://ivutfoyadhxsaxhikgje.supabase.co' 
const supabaseAnonKey = 'sb_publishable_2AsOsMyxiJvvMGt7f5sWoQ_rhajMGip'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)