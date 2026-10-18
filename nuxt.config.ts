export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase'],
  supabase: {
    redirect: false
  },
  app: {
    head: {
      title: 'WEAK - คลังแก๊ง', // ชื่อที่จะแสดงบนแท็บเบราว์เซอร์
      link: [
        { rel: 'icon', type: 'image/png', href: '/logo-text.png' } // ใช้ไฟล์โลโก้ที่คุณมีอยู่แล้วในโฟลเดอร์ public เป็นไอคอนแท็บเว็บ
      ]
    }
  }
})