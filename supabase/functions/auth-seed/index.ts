import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔧 Starting admin user seed process...')
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('📊 Supabase URL:', Deno.env.get('SUPABASE_URL'))
    console.log('🔑 Service Role Key configured:', !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'))

    const adminEmail = 'sayde.jabbour04@hotmail.com'
    const tempPassword = 'TempPass123!'

    // Check if admin user exists
    console.log(`🔍 Checking for existing admin user: ${adminEmail}`)
    
    const { data: existingUser, error: selectError } = await supabaseClient
      .from('users')
      .select('*')
      .eq('email', adminEmail)
      .single()

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('❌ Error checking for existing user:', selectError)
      throw selectError
    }

    if (existingUser) {
      console.log('✅ Admin user already exists:', {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
        created_at: existingUser.created_at
      })
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Admin user already exists',
          user: {
            id: existingUser.id,
            email: existingUser.email,
            role: existingUser.role
          }
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Hash the temporary password
    console.log('🔐 Hashing temporary password...')
    const hashedPassword = await bcrypt.hash(tempPassword, 10)
    console.log('✅ Password hashed successfully')

    // Insert admin user
    console.log('👤 Creating admin user...')
    const { data: newUser, error: insertError } = await supabaseClient
      .from('users')
      .insert({
        email: adminEmail,
        password_hash: hashedPassword,
        role: 'admin'
      })
      .select()
      .single()

    if (insertError) {
      console.error('❌ Error creating admin user:', insertError)
      throw insertError
    }

    console.log('🎉 Admin user created successfully:', {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      created_at: newUser.created_at
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Admin user created successfully',
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role
        },
        tempPassword: tempPassword
      }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('💥 Seed process error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Seed process failed', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})