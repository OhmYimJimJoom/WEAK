<template>
  <div class="min-h-screen bg-[#050814] text-slate-100 font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden" @click="triggerFirstPlay">
    
    <!-- ❄️ เอฟเฟกต์หิมะตกต่อเนื่องแบบนุ่มนวลสมูท ไม่รีเซ็ตตอนกดแอ็คชั่น -->
    <div class="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      <div v-for="(flake, index) in snowFlakes" :key="index" class="snowflake" :style="flake">❄</div>
    </div>

    <!-- 🎵 เครื่องเล่นเพลง MP3 สไตล์หรูหรา -->
    <div class="fixed bottom-5 right-5 z-50 bg-black/85 border-2 border-blue-500/40 p-4 rounded-3xl shadow-[0_0_25px_rgba(59,130,246,0.3)] backdrop-blur-2xl text-white w-72 transition-all duration-300 hover:border-blue-400 hover:scale-105" @click.stop>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600/40 to-cyan-600/40 border border-blue-400/60 flex items-center justify-center text-blue-300 font-bold text-xl shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-transform duration-300 hover:rotate-12">
            🎵
          </div>
          <div class="text-xs">
            <p class="font-bold text-blue-200 text-sm tracking-wide">มันก็เป็นแค่ครั้งหนึ่ง</p>
          </div>
        </div>
        <button 
          @click="togglePlay"
          class="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 flex items-center justify-center font-black text-sm tracking-tighter transition-all duration-200 shadow-lg shadow-blue-950/50 active:scale-90 border border-blue-400/40 hover:scale-105 cursor-pointer text-white">
          {{ isPlaying ? '❚❚' : '▶' }}
        </button>
      </div>

      <!-- ส่วนปรับระดับเสียง MP3 -->
      <div class="flex items-center gap-3 pt-3 mt-3 border-t border-blue-900/40 text-xs text-blue-300">
        <span class="text-sm">🔈</span>
        <input 
          type="range" 
          min="0" 
          max="100" 
          v-model="volume" 
          @input="updateVolume"
          class="w-full accent-blue-500 cursor-pointer h-2 bg-slate-900 rounded-lg border border-blue-900/50 transition-all"
        />
        <span class="w-9 text-right font-bold text-blue-300">{{ volume }}%</span>
      </div>

      <audio ref="audioPlayer" src="/gang-song.mp3" loop preload="auto" @timeupdate="saveAudioTime"></audio>
    </div>

    <!-- 1. หน้า Login -->
    <div v-if="!user" class="flex items-center justify-center min-h-screen p-4 relative z-20 transition-all duration-500">
      <div class="w-full max-w-md p-8 bg-black/85 border-2 border-blue-600/50 rounded-[2.5rem] shadow-[0_0_60px_rgba(59,130,246,0.25)] backdrop-blur-2xl transition-all duration-500 hover:shadow-[0_0_80px_rgba(59,130,246,0.4)]">
        <div class="text-center mb-8 flex flex-col items-center">
          
          <div class="relative group mb-3 transition-transform duration-500 hover:scale-105">
            <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl blur-lg opacity-70 group-hover:opacity-100 transition duration-500"></div>
            <img 
              src="/logo-3fb.png" 
              alt="Gang Crown Logo" 
              class="relative w-32 h-32 object-contain rounded-2xl filter drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]"
              @error="(e) => e.target.style.display='none'"
            />
          </div>

          <h1 class="text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-slate-100 to-cyan-300 mt-2">WEAK</h1>
          <p class="text-xs text-blue-300/60 mt-1">ระบบเช็คคลังแก๊ง</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">ชื่อในเมือง (IC Name)</label>
            <input 
              v-model="loginIcName" 
              type="text" 
              required
              placeholder="เช่น GIORNO LE"
              class="w-full px-4 py-3.5 bg-slate-950/80 border border-blue-900/60 rounded-2xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 text-sm transition-all duration-300 text-white placeholder-slate-600 shadow-inner"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">รหัส</label>
            <input 
              v-model="loginPhone" 
              type="text" 
              required
              placeholder="ส่วนมากจะเป็นเบอร์โทรศัพท์"
              class="w-full px-4 py-3.5 bg-slate-950/80 border border-blue-900/60 rounded-2xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 text-sm transition-all duration-300 text-white placeholder-slate-600 shadow-inner"
            />
          </div>
          <button 
            type="submit" 
            class="w-full py-4 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 hover:from-blue-600 hover:to-cyan-500 font-extrabold text-base rounded-2xl shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all duration-200 border border-blue-400/35 active:scale-95 hover:scale-[1.01] cursor-pointer">
            เข้าสู่ระบบคลังแก๊ง
          </button>
        </form>

        <div v-if="loginError" class="mt-4 p-3 bg-rose-950/80 border border-rose-500 rounded-2xl text-xs text-center text-rose-300 font-bold transition-all duration-300">
          {{ loginError }}
        </div>
      </div>
    </div>

    <!-- 2. หน้า Dashboard คลังแก๊ง (ค่อยๆ เฟดไล่ระดับอย่างนุ่มนวลทีละส่วน) -->
    <div v-else class="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 relative z-25">
      
      <!-- Header Bar (ลำดับที่ 1) -->
      <header class="smooth-reveal-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-black/75 border-2 border-blue-600/40 p-6 sm:p-8 rounded-[2.5rem] backdrop-blur-2xl mb-8 shadow-[0_0_40px_rgba(59,130,246,0.18)] transition-all duration-300 hover:border-blue-500/60">
        <div class="flex items-center gap-5">
          <img 
            src="/logo-text.png" 
            alt="WEAK Logo" 
            class="h-14 sm:h-18 object-contain rounded-2xl filter drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] transition-transform duration-300 hover:scale-105"
            @error="(e) => e.target.style.display='none'"
          />
          
          <div>
            <div class="flex items-center gap-3 flex-wrap">
              <span v-if="userRole === 'boss'" class="bg-amber-500/20 text-amber-300 border border-amber-500/60 px-4 py-1.5 text-xs font-extrabold rounded-full uppercase tracking-wider shadow-[0_0_12px_rgba(245,158,11,0.3)] transition-all duration-300 hover:scale-105">
                👑 หัวหน้าแก๊ง
              </span>
              <span v-else class="bg-blue-500/20 text-blue-300 border border-blue-400/60 px-4 py-1.5 text-xs font-extrabold rounded-full uppercase tracking-wider shadow-[0_0_12px_rgba(59,130,246,0.3)] transition-all duration-300 hover:scale-105">
                👥 สมาชิกแก๊ง
              </span>
            </div>
            <p class="text-xs font-black tracking-widest text-blue-300/80 mt-1.5 uppercase">WEAK STORAGE</p>
            <div class="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-blue-200/70 mt-2">
              <p>ชื่อในเมือง: <span class="text-blue-300 font-bold text-base">{{ user.ic_name }}</span></p>
              <p>ชื่อ: <span class="text-slate-200 font-medium">{{ user.real_name || '-' }}</span></p>
              <p>เบอร์โทร: <span class="text-emerald-400 font-bold">{{ user.phone_number }}</span></p>
            </div>
          </div>
        </div>
        <button 
          @click="handleLogout"
          class="px-5 py-2.5 bg-rose-900/60 hover:bg-rose-600 border border-rose-500/60 text-rose-100 text-xs font-bold rounded-2xl transition-all duration-200 shadow-lg active:scale-95 hover:scale-105 cursor-pointer">
          ออกจากระบบ
        </button>
      </header>

      <!-- Stats Overview & Money Management (ลำดับที่ 2) -->
      <div class="smooth-reveal-2 grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-black/70 border border-blue-800/40 p-6 sm:p-8 rounded-[2.5rem] backdrop-blur-2xl flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-blue-600/60 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
          <div>
            <p class="text-xs font-bold text-blue-300/70 uppercase tracking-widest">เงินแก๊งทั้งหมด</p>
            <h2 class="text-4xl sm:text-5xl font-black text-emerald-400 mt-3 tracking-tight">$ {{ gangMoney.toLocaleString() }}</h2>
          </div>
          <div v-if="userRole === 'boss'" class="mt-6 pt-5 border-t border-blue-900/40 flex flex-wrap gap-3 items-center">
            <input v-model.number="inputMoney" type="number" placeholder="จำนวนเงิน" class="custom-number-input w-36 px-4 py-2.5 bg-slate-950 border border-blue-800/60 rounded-2xl text-sm text-white focus:outline-none focus:border-blue-400 transition-all duration-300" />
            <button @click="modifyMoney('add')" class="px-5 py-2.5 bg-emerald-600/90 hover:bg-emerald-500 border border-emerald-400/50 font-bold text-xs rounded-2xl transition-all duration-200 shadow-md active:scale-95 hover:scale-105 cursor-pointer flex items-center gap-1.5 text-white">
              <span>💵</span> เติมเงิน
            </button>
            <button @click="modifyMoney('withdraw')" class="px-5 py-2.5 bg-rose-600/90 hover:bg-rose-500 border border-rose-400/50 font-bold text-xs rounded-2xl transition-all duration-200 shadow-md active:scale-95 hover:scale-105 cursor-pointer flex items-center gap-1.5 text-white">
              <span>💸</span> ถอนเงิน
            </button>
          </div>
        </div>

        <div class="bg-black/70 border border-blue-800/40 p-6 sm:p-8 rounded-[2.5rem] backdrop-blur-2xl flex flex-col justify-between text-center shadow-xl transition-all duration-300 hover:border-blue-600/60 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
          <div>
            <p class="text-xs font-bold text-blue-300/70 uppercase tracking-widest">จำนวนไอเทมทั้งหมดในคลัง</p>
            <div class="flex items-baseline justify-center gap-2 mt-4 mb-2">
              <span class="text-5xl sm:text-6xl font-black text-blue-300 tracking-tight">{{ inventory.length }}</span>
              <span class="text-xl sm:text-2xl font-bold text-blue-400/80">รายการ</span>
            </div>
          </div>
          <p class="text-xs text-blue-400/50 mt-4">ระบบจัดการแก๊ง WEAK</p>
        </div>
      </div>

      <!-- Inventory Management Section (ลำดับที่ 3) -->
      <div class="smooth-reveal-3 bg-black/70 border-2 border-blue-600/30 rounded-[2.5rem] p-6 sm:p-8 backdrop-blur-2xl shadow-[0_0_35px_rgba(59,130,246,0.15)] transition-all duration-300 hover:border-blue-500/50">
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <h3 class="text-xl font-black text-white flex items-center gap-2">
            📦 รายการไอเทมและราคา
          </h3>
          
          <div v-if="userRole === 'boss'" class="bg-slate-950/90 border border-blue-800/50 p-4 rounded-3xl w-full lg:w-auto space-y-3 transition-all duration-300 shadow-inner">
            <div class="flex flex-wrap gap-2">
              <input v-model="newItem.name" placeholder="ชื่อไอเทม" class="px-4 py-2.5 bg-slate-900 border border-blue-900/60 rounded-2xl text-sm flex-1 lg:w-40 text-white focus:outline-none focus:border-blue-400 transition-all duration-300" />
              <input v-model.number="newItem.quantity" type="number" placeholder="จำนวน" class="custom-number-input w-24 px-3 py-2.5 bg-slate-900 border border-blue-900/60 rounded-2xl text-sm text-white focus:outline-none focus:border-blue-400 transition-all duration-300" />
              <input v-model.number="newItem.price" type="number" placeholder="ราคา (บาท/$)" class="custom-number-input w-28 px-3 py-2.5 bg-slate-900 border border-blue-900/60 rounded-2xl text-sm text-white focus:outline-none focus:border-blue-400 transition-all duration-300" />
            </div>

            <div class="flex flex-col sm:flex-row gap-2 items-center">
              <div class="flex bg-slate-900 p-1 rounded-2xl border border-blue-900/60 text-xs w-full sm:w-auto">
                <button @click="imageMode = 'url'" :class="imageMode === 'url' ? 'bg-blue-600 text-white shadow-md' : 'text-blue-300/60'" class="flex-1 sm:flex-none px-3.5 py-2 rounded-xl font-bold transition-all duration-200 cursor-pointer">🔗 URL รูป</button>
                <button @click="imageMode = 'file'" :class="imageMode === 'file' ? 'bg-blue-600 text-white shadow-md' : 'text-blue-300/60'" class="flex-1 sm:flex-none px-3.5 py-2 rounded-xl font-bold transition-all duration-200 cursor-pointer">💻 อัปโหลดรูป</button>
              </div>

              <input v-if="imageMode === 'url'" v-model="newItem.image_url" placeholder="วางลิงก์รูปภาพ (https://...)" class="px-4 py-2.5 bg-slate-900 border border-blue-900/60 rounded-2xl text-sm flex-1 text-white w-full focus:outline-none focus:border-blue-400 transition-all duration-300" />
              <input v-else type="file" accept="image/*" @change="handleFileUpload" class="px-3 py-2 bg-slate-900 border border-blue-900/60 rounded-2xl text-xs flex-1 text-slate-300 w-full file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-500 transition-all duration-300 cursor-pointer" />

              <button @click="addItem" :disabled="isUploading" class="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:bg-slate-800 text-xs font-extrabold rounded-2xl transition-all duration-200 whitespace-nowrap shadow-md active:scale-95 hover:scale-105 border border-blue-400/30 cursor-pointer">
                {{ isUploading ? 'กำลังอัปโหลด...' : '➕ เพิ่มไอเทม' }}
              </button>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-blue-900/50 text-xs font-bold text-blue-300/70 uppercase tracking-widest">
                <th class="py-4 px-5 w-24">รูปภาพ</th>
                <th class="py-4 px-5">ชื่อไอเทม</th>
                <th class="py-4 px-5">จำนวน</th>
                <th class="py-4 px-5">ราคาต่อชิ้น</th>
                <th class="py-4 px-5 text-right" v-if="userRole === 'boss'">จัดการ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-blue-900/30 text-base">
              <tr v-for="item in inventory" :key="item.id" class="hover:bg-blue-950/40 transition-all duration-300 group">
                <td class="py-4 px-5">
                  <div class="w-16 h-16 rounded-2xl bg-slate-950 border-2 border-blue-700/50 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-300 group-hover:scale-105 group-hover:border-blue-400">
                    <img v-if="item.image_url" :src="item.image_url" alt="item" class="w-full h-full object-cover rounded-xl" @error="item.image_url = ''" />
                    <span v-else class="text-2xl">📦</span>
                  </div>
                </td>
                <td class="py-4 px-5 font-bold text-blue-100 text-lg sm:text-xl transition-colors duration-300 group-hover:text-blue-300">{{ item.name }}</td>
                <td class="py-4 px-5">
                  <span class="px-4 py-2 bg-blue-950/80 border border-blue-500/50 text-blue-300 rounded-2xl font-black text-base shadow-[0_0_12px_rgba(59,130,246,0.2)] inline-block transition-all duration-300 group-hover:scale-105">
                    {{ item.quantity.toLocaleString() }} ชิ้น
                  </span>
                </td>
                <!-- คอลัมน์แสดงราคา (สมาชิกและหัวหน้าแก๊งมองเห็นได้) -->
                <td class="py-4 px-5">
                  <div class="flex items-center gap-2">
                    <span class="text-emerald-400 font-black text-lg">
                      $ {{ (item.price || 0).toLocaleString() }}
                    </span>
                    <!-- หากเป็น Boss สามารถแก้ไขราคาได้ทันทีในตาราง -->
                    <div v-if="userRole === 'boss'" class="flex items-center gap-1.5 ml-2">
                      <input 
                        type="number" 
                        v-model.number="item.editPrice" 
                        placeholder="ราคาใหม่" 
                        class="custom-number-input w-24 px-2.5 py-1.5 bg-slate-950 border border-blue-800/60 rounded-xl text-xs text-center text-white focus:outline-none focus:border-blue-400"
                      />
                      <button @click="updateItemPrice(item)" class="px-2.5 py-1.5 bg-blue-900/60 hover:bg-blue-600 border border-blue-400/50 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md">ตั้งราคา</button>
                    </div>
                  </div>
                </td>
                <!-- ส่วนจัดการเฉพาะ Boss -->
                <td class="py-4 px-5 text-right" v-if="userRole === 'boss'">
                  <div class="flex items-center justify-end gap-2">
                    <input 
                      type="number" 
                      v-model.number="item.adjustAmount" 
                      @keyup.enter="adjustQuantityCustom(item, 'add')"
                      placeholder="จำนวน" 
                      class="custom-number-input w-20 px-3 py-2 bg-slate-950 border border-blue-800/60 rounded-xl text-xs text-center text-white focus:outline-none focus:border-blue-400 transition-all"
                    />
                    <button @click="adjustQuantityCustom(item, 'add')" class="w-9 h-9 bg-blue-900/60 hover:bg-blue-600 border border-blue-400/50 rounded-xl text-sm font-black transition-all duration-200 active:scale-90 hover:scale-110 flex items-center justify-center text-white shadow-md cursor-pointer" title="เพิ่มจำนวน">+</button>
                    <button @click="adjustQuantityCustom(item, 'subtract')" class="w-9 h-9 bg-blue-900/60 hover:bg-blue-600 border border-blue-400/50 rounded-xl text-sm font-black transition-all duration-200 active:scale-90 hover:scale-110 flex items-center justify-center text-white shadow-md cursor-pointer" title="ลดจำนวน">-</button>
                    <button @click="deleteItem(item.id)" class="px-3.5 h-9 bg-rose-600/80 hover:bg-rose-600 border border-rose-400/50 text-white rounded-xl text-xs font-bold transition-all duration-200 active:scale-90 hover:scale-105 shadow-md cursor-pointer">ลบ</button>
                  </div>
                </td>
              </tr>
              <tr v-if="inventory.length === 0">
                <td :colspan="userRole === 'boss' ? 5 : 4" class="text-center py-12 text-blue-300/40 text-base">ยังไม่มีไอเทมในคลังแก๊ง</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const supabase = useSupabaseClient()

const user = ref(null)
const userRole = ref('member')
const loginIcName = ref('')
const loginPhone = ref('')
const loginError = ref('')

const gangMoney = ref(0)
const inputMoney = ref(0)
const inventory = ref([])

const imageMode = ref('url')
const selectedFile = ref(null)
const isUploading = ref(false)
const newItem = ref({ name: '', quantity: 1, price: 0, image_url: '' })

// ตัวควบคุมเพลง MP3
const audioPlayer = ref(null)
const isPlaying = ref(false)
const volume = ref(30)

// สร้างสไตล์หิมะแบบสุ่มคงที่ครั้งเดียว เพื่อป้องกันการรีเซ็ตหรือกระตุกเวลาหน้าเว็บอัปเดตข้อมูล
const snowFlakes = ref([])
if (import.meta.client) {
  snowFlakes.value = Array.from({ length: 35 }, (_, index) => {
    let startTime = sessionStorage.getItem(`snow_start_${index}`)
    if (!startTime) {
      startTime = Date.now().toString()
      sessionStorage.setItem(`snow_start_${index}`, startTime)
    }
    const elapsed = (Date.now() - Number(startTime)) / 1000
    const duration = 7 + (index % 5) * 2
    const delay = -(elapsed % duration)
    const left = (index * 2.8) % 100
    const size = 12 + (index % 4) * 3
    const opacity = 0.4 + (index % 5) * 0.1

    return {
      left: `${left}%`,
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`,
      fontSize: `${size}px`,
      opacity: opacity,
    }
  })
}

const loadGangData = async () => {
  const { data: moneyData, error: moneyError } = await supabase
    .from('gang_money')
    .select('balance')
    .eq('id', 1)
    .maybeSingle()

  if (!moneyError && moneyData) {
    gangMoney.value = moneyData.balance
  } else {
    await supabase.from('gang_money').upsert({ id: 1, balance: 0 })
    gangMoney.value = 0
  }

  const { data: items } = await supabase.from('inventory').select('*').order('id', { ascending: true })
  if (items) {
    inventory.value = items.map(item => ({ 
      ...item, 
      price: item.price || 0,
      adjustAmount: null,
      editPrice: null 
    }))
  }
}

onMounted(async () => {
  const savedUser = localStorage.getItem('gang_user')
  if (savedUser) {
    user.value = JSON.parse(savedUser)
    userRole.value = user.value.role
    await loadGangData()
  }

  const savedVolume = localStorage.getItem('gang_music_volume')
  if (savedVolume !== null) {
    volume.value = Number(savedVolume)
  }

  const savedTime = localStorage.getItem('gang_music_time')
  const savedPlayState = localStorage.getItem('gang_music_playing')

  await nextTick()
  if (audioPlayer.value) {
    audioPlayer.value.volume = volume.value / 100
    if (savedTime) {
      audioPlayer.value.currentTime = parseFloat(savedTime)
    }

    if (savedPlayState === 'true') {
      try {
        await audioPlayer.value.play()
        isPlaying.value = true
      } catch (e) {
        isPlaying.value = false
      }
    }
  }
})

const saveAudioTime = () => {
  if (audioPlayer.value) {
    localStorage.setItem('gang_music_time', audioPlayer.value.currentTime)
  }
}

const triggerFirstPlay = async () => {
  if (!isPlaying.value && audioPlayer.value) {
    try {
      audioPlayer.value.volume = volume.value / 100
      await audioPlayer.value.play()
      isPlaying.value = true
      localStorage.setItem('gang_music_playing', 'true')
    } catch (e) {
      console.log("Play prevented", e)
    }
  }
}

const togglePlay = async () => {
  await nextTick()
  if (!audioPlayer.value) return

  if (isPlaying.value) {
    audioPlayer.value.pause()
    isPlaying.value = false
    localStorage.setItem('gang_music_playing', 'false')
  } else {
    try {
      audioPlayer.value.volume = volume.value / 100
      await audioPlayer.value.play()
      isPlaying.value = true
      localStorage.setItem('gang_music_playing', 'true')
    } catch (e) {
      console.log("Audio play blocked", e)
    }
  }
}

const updateVolume = () => {
  localStorage.setItem('gang_music_volume', volume.value)
  if (audioPlayer.value) {
    audioPlayer.value.volume = volume.value / 100
  }
}

const handleLogin = async () => {
  loginError.value = ''
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .ilike('ic_name', loginIcName.value.trim())
    .eq('phone_number', loginPhone.value.trim())

  if (error || !data || data.length === 0) {
    loginError.value = 'ไม่พบชื่อในเมือง หรือเบอร์โทรศัพท์นี้ในระบบ'
  } else {
    user.value = data[0]
    userRole.value = data[0].role
    localStorage.setItem('gang_user', JSON.stringify(data[0]))
    await loadGangData()
  }
}

const handleLogout = () => {
  localStorage.removeItem('gang_user')
  user.value = null
  userRole.value = 'member'
  loginIcName.value = ''
  loginPhone.value = ''
}

const modifyMoney = async (type) => {
  if (!inputMoney.value || inputMoney.value <= 0) return
  let newBalance = Number(gangMoney.value)
  if (type === 'add') {
    newBalance += Number(inputMoney.value)
  } else {
    newBalance -= Number(inputMoney.value)
    if (newBalance < 0) newBalance = 0
  }

  const { error } = await supabase.from('gang_money').update({ balance: newBalance }).eq('id', 1)
  if (!error) {
    gangMoney.value = newBalance
    inputMoney.value = 0
  } else {
    alert('เกิดข้อผิดพลาดในการจัดการเงิน: ' + error.message)
  }
}

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0]
}

const addItem = async () => {
  if (!newItem.value.name) return
  isUploading.value = true

  let finalImageUrl = newItem.value.image_url

  if (imageMode.value === 'file' && selectedFile.value) {
    const file = selectedFile.value
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('item-images')
      .upload(filePath, file)

    if (uploadError) {
      alert('อัปโหลดรูปภาพไม่สำเร็จ: ' + uploadError.message)
      isUploading.value = false
      return
    }

    const { data: publicUrlData } = supabase.storage
      .from('item-images')
      .getPublicUrl(filePath)

    finalImageUrl = publicUrlData.publicUrl
  }

  const { data, error } = await supabase
    .from('inventory')
    .insert([{ 
      name: newItem.value.name, 
      quantity: newItem.value.quantity || 1,
      price: newItem.value.price || 0,
      image_url: finalImageUrl || ''
    }])
    .select()

  isUploading.value = false

  if (!error && data) {
    inventory.value.push({ ...data[0], adjustAmount: null, editPrice: null })
    newItem.value.name = ''
    newItem.value.quantity = 1
    newItem.value.price = 0
    newItem.value.image_url = ''
    selectedFile.value = null
  } else {
    alert('ไม่สามารถเพิ่มไอเทมได้: ' + error?.message)
  }
}

const updateItemPrice = async (item) => {
  const newPrice = Number(item.editPrice)
  if (isNaN(newPrice) || newPrice < 0) {
    alert('กรุณากรอกราคาให้ถูกต้อง')
    return
  }

  const { error } = await supabase.from('inventory').update({ price: newPrice }).eq('id', item.id)
  if (!error) {
    item.price = newPrice
    item.editPrice = null
  } else {
    alert('ไม่สามารถอัปเดตราคาได้: ' + error.message)
  }
}

const adjustQuantityCustom = async (item, mode) => {
  const val = Number(item.adjustAmount)
  const amountToAdd = (!val || val <= 0) ? 1 : val
  const newQty = mode === 'add' 
    ? item.quantity + amountToAdd 
    : Math.max(0, item.quantity - amountToAdd)

  const { error } = await supabase.from('inventory').update({ quantity: newQty }).eq('id', item.id)
  if (!error) {
    item.quantity = newQty
    item.adjustAmount = null
  } else {
    alert('เกิดข้อผิดพลาดในการปรับจำนวน: ' + error.message)
  }
}

const deleteItem = async (id) => {
  const { error } = await supabase.from('inventory').delete().eq('id', id)
  if (!error) inventory.value = inventory.value.filter(i => i.id !== id)
}
</script>

<style scoped>
@keyframes snowfall {
  0% {
    transform: translateY(-20px) rotate(0deg);
  }
  100% {
    transform: translateY(105vh) rotate(360deg);
  }
}

/* เอฟเฟกต์ Fade In แบบช้าและนุ่มนวล ไล่ระดับจากบนลงล่าง */
@keyframes smoothBlurFade {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.98);
    filter: blur(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0px);
  }
}

.smooth-reveal-1 {
  animation: smoothBlurFade 1.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.smooth-reveal-2 {
  opacity: 0;
  animation: smoothBlurFade 1.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s forwards;
}

.smooth-reveal-3 {
  opacity: 0;
  animation: smoothBlurFade 1.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.6s forwards;
}

.snowflake {
  position: absolute;
  top: -20px;
  color: #bfdbfe;
  user-select: none;
  animation: snowfall linear infinite;
  text-shadow: 0 0 10px rgba(59, 130, 246, 0.9);
  will-change: transform;
}

html {
  scroll-behavior: smooth;
}

/* ซ่อนปุ่มลูกศรขึ้นลง (Spinner) ของช่องกรอกตัวเลขแบบเดิมให้หมดไป */
.custom-number-input::-webkit-outer-spin-button,
.custom-number-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.custom-number-input {
  -moz-appearance: textfield;
}
</style>