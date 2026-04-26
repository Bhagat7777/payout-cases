import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupAdmin() {
  const email = 'bigwinner986@gmail.com'
  const password = 'Hanuman@543'

  console.log('Creating admin user...')

  // Create the user using Supabase Admin API
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role: 'admin'
    }
  })

  if (authError) {
    if (authError.message.includes('already been registered')) {
      console.log('User already exists, checking profile...')
      
      // Get existing user
      const { data: users } = await supabase.auth.admin.listUsers()
      const existingUser = users?.users.find(u => u.email === email)
      
      if (existingUser) {
        // Check if profile exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', existingUser.id)
          .single()
        
        if (!profile) {
          // Create profile for existing user
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: existingUser.id,
              handle: 'admin',
              role: 'admin'
            })
          
          if (profileError) {
            console.error('Error creating profile:', profileError)
          } else {
            console.log('Profile created for existing user')
          }
        } else {
          // Update role to admin
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', existingUser.id)
          
          if (updateError) {
            console.error('Error updating profile:', updateError)
          } else {
            console.log('Profile updated to admin')
          }
        }
      }
      return
    }
    
    console.error('Error creating user:', authError)
    process.exit(1)
  }

  if (!authData.user) {
    console.error('No user data returned')
    process.exit(1)
  }

  console.log('Auth user created:', authData.user.id)

  // Create profile with admin role
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      handle: 'admin',
      role: 'admin'
    })

  if (profileError) {
    console.error('Error creating profile:', profileError)
    process.exit(1)
  }

  console.log('Admin user created successfully!')
  console.log('Email:', email)
  console.log('Password:', password)
}

setupAdmin()
