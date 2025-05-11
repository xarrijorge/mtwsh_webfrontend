import { createClient } from '@supabase/supabase-js'

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create Supabase client
const supabase = createClient(supabaseURL, supabaseKey)

// Upload file using standard upload
async function uploadFile(file) {
  // First upload the file
  const { data, error } = await supabase.storage.from('images').upload(file.name, file)
  console.log('Upload data:', data)
  
  if (error) {
    console.error('Error uploading file:', error)
    throw error
  }
  
  // Then get the public URL
  const { data: urlData } = supabase.storage.from('images').getPublicUrl(file.name)
  
  // Return an object with both the path and public URL
  return {
    Key: file.name,
    publicUrl: urlData.publicUrl
  }
}

export default uploadFile