/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Wallet, ListCheck, Info, MapPin, 
  CloudSun, Plus, Trash2, ChevronRight, Navigation, X, 
  Image as ImageIcon, Smartphone, Users, CheckCircle2, Circle, Clock, Ticket,
  ExternalLink, Sun, Cloud, CloudRain, Utensils, Plane, Car, Upload,
  LayoutGrid, StretchHorizontal, ChevronLeft, ChevronRight as ChevronRightIcon,
  PhoneCall, PlusCircle, Link
} from 'lucide-react';

const fontStyleSerif = {
  fontFamily: "'Noto Serif TC', serif",
};

const fontStyleSans = {
  fontFamily: "'Noto Sans TC', sans-serif",
};

const TYPE_CONFIG: Record<string, { icon: any, label: string }> = {
  flight: { icon: <Plane size={12} />, label: "航班" },
  transport: { icon: <Car size={12} />, label: "交通" },
  stay: { icon: <MapPin size={12} />, label: "住宿" },
  food: { icon: <Utensils size={12} />, label: "美食" },
  spot: { icon: <MapPin size={12} />, label: "景點" },
};

// --- Data ---
const ITINERARY_DATA = [
  { 
    day: 1, date: "2026-07-13", week: "MON", 
    items: [
      { 
        id: '1-1', time: "09:00", type: "transport", title: "桃園機場第一航廈會合", detail: "星宇航空櫃檯集合", address: "桃園市大園區航站南路15號", 
        content: "各位貴賓早安！我們即將展開期待已久的沖繩之旅。請大家再次確認護照、日文譯本以及最重要的心情都帶齊了嗎？第一站我們先在星宇櫃檯集合辦理登機。", 
        quickLinks: [
          { label: "機捷時刻表", url: "https://www.tymetro.com.tw/tymetro-new/tw/_pages/travel-guide/timetable.php" },
          { label: "路線圖", url: "https://www.tymetro.com.tw/tymetro-new/tw/_pages/travel-guide/road-map.php" }
        ] 
      },
      { 
        id: '1-2', time: "15:00", type: "flight", title: "抵達那霸空港 & 租車", detail: "預計抵達後分頭行動", address: "那霸機場", 
        content: "抵達後約 15:30 進行租車行程。請搭乘機場接駁車前往營業所辦理手續。\n\n【指引】Joy Jungle 娃娃機店：位於那霸機場國內線，從國際線入境後往單軌電車站方向步行即可經過。\n\n【連結】OTS 租車接駁資訊：https://www.otsrentacar.ne.jp/okinawa/shuttlebus.html" 
      },
      { 
        id: '1-3', time: "16:00", type: "stay", title: "那霸歌町大和roynet飯店premier", detail: "Check-in 放置行李", address: "那霸市安里1-1-1", 
        content: "飯店位於那霸新都心，地理位置極佳。對面就有百貨公司，周邊購物與餐飲選擇非常豐富。\n\n【步行指引】從單軌電車 Omoromachi 站步行約 5 分鐘即可抵達。\n\n【飯店官網】https://www.daiwaroynet.jp/naha-omoromachi-premier/\n\n【備註】兒童早餐券請於櫃檯辦理入住時確認領取。" 
      },
      { 
        id: '1-4', time: "17:30", type: "spot", title: "國際通散策", detail: "探索那霸最熱鬧的街道", address: "那霸市國際通", 
        content: "國際通是那霸的心臟地帶。\n\n【國際通 Top 10 推薦】\n1. 淳久堂書店 (那霸店)\n2. Pork Tamago Onigiri (第一牧志公設市場店)\n3. Blue Seal 冰淇淋\n4. Calbee+ 現炸薯條\n5. 御菓子御殿 (紅芋塔)\n6. 鹽屋 (雪鹽霜淇淋)\n7. 牧志公設市場 (新鮮海鮮)\n8. Don Quijote 驚安殿堂\n9. 琉球咖啡館\n10. 沖繩屋 (土產專賣)" 
      },
      { 
        id: '1-5', time: "17:30", type: "food", title: "晚餐：國際通美食", detail: "可分隊用餐", address: "那霸市國際通", 
        content: "國際通周邊餐廳選擇眾多，可依喜好分隊行動。\n\n【國際通 Top 10 餐廳】\n1. 暖暮拉麵 (那霸牧志店)\n2. 琉球新麵 通堂\n3. 碧 鐵板燒\n4. 88 牛排 (Steak House 88)\n5. ゆうなんぎい (琉球料理)\n6. 牧志公設市場 2F 食堂\n7. 琉球黑毛和牛 燒肉\n8. 嘉手納蕎麥麵\n9. 居酒屋 祭囃子\n10. 國際通屋台村 (多樣化小吃)" 
      }
    ]
  },
  { 
    day: 2, date: "2026-07-14", week: "TUE", 
    items: [
      { id: '2-0', time: "08:00", type: "food", title: "飯店早餐", detail: "享用飯店美味早餐", content: "開啟活力的一天。", noModal: true },
      { 
        id: '2-1', time: "08:30", type: "spot", title: "西來院達摩寺", detail: "祈福參拜", address: "那霸市首里赤田町1-5-1", 
        content: "西來院是首里著名的寺院，環境清幽。\n\n【口金包兌換】持相關憑證可於寺內指定處兌換精美口金包。\n\n【說明文件】https://example.com/daruma-temple-guide.pdf" 
      },
      { 
        id: '2-2', time: "10:00", type: "spot", title: "古宇利島", detail: "跨海大橋美景", address: "今歸仁村古宇利", 
        content: "古宇利島位於沖繩本島北部，以其絕美的「古宇利大橋」聞名。這座橋全長約 1960 公尺，橫跨在被稱為「古宇利藍」的清澈海面上，開車經過時彷彿在海上飛行。島上流傳著琉球版的亞當與夏娃傳說，因此也被稱為「神之島」或「戀島」。島北側的 Tinu 海灘有兩座著名的心形岩，是情侶必訪的打卡聖地。古宇利海洋塔則提供了俯瞰整座大橋與周邊海景的絕佳視角。在這裡，您可以品嚐著名的蝦蝦飯，或是坐在海邊咖啡廳享受悠閒的時光。清澈的海水非常適合戲水，白沙灘更是讓人流連忘返。無論是開車環島一圈（約 10 分鐘），還是停下來漫步沙灘，古宇利島都能讓您感受到沖繩最純粹的自然魅力與浪漫氣息。" 
      },
      { 
        id: '2-3', time: "12:00", type: "food", title: "午餐：名護周邊美食", detail: "詳見彈跳窗備案", address: "名護市", 
        content: "【原定餐廳】百年古家 大家 (阿古豬料理)\n\n【人氣午餐備案 (海鮮/牛肉)】\n1. 名護漁港食堂 (新鮮海鮮)\n2. 燒肉乃我那霸 (沖繩和牛)\n3. 幸ちゃんそば (沖繩蕎麥麵)\n4. Captain Kangaroo (漢堡)\n5. 岸本食堂 (百年蕎麥麵)" 
      },
      { 
        id: '2-4', time: "14:00", type: "spot", title: "美麗海水族館", detail: "觀賞黑潮之海", address: "本部町石川424", 
        content: "沖繩美麗海水族館是世界級的海洋主題公園，坐落於海洋博公園內。其最著名的「黑潮之海」大水槽，擁有高 8.2 公尺、寬 22.5 公尺的巨大壓克力面板，展示著巨大的鯨鯊與鬼蝠魟在深藍色水中優雅游動的壯觀景象。除了黑潮之海，水族館還展示了沖繩周邊豐富的珊瑚礁生態、深海生物以及各式各樣的熱帶魚類。戶外區還有精彩的海豚表演（Okichan Theater）、海龜館與海牛館，讓遊客能近距離觀察這些迷人的海洋生物。水族館的設計旨在讓遊客從淺灘一路探索到深海，體驗沖繩海洋的奧秘。每天下午的鯨鯊餵食秀更是不可錯過的亮點。這裡不僅是孩子們的樂園，也是大人們放鬆心情、感受海洋生命力的絕佳去處。建議預留至少 3 小時，才能完整體驗這座充滿驚奇的水中世界。\n\n【節目時刻表】https://churaumi.okinawa/program/" 
      },
      { 
        id: '2-5', time: "18:00", type: "food", title: "晚餐：燒肉/壽司", detail: "詳見彈跳窗備案", address: "名護市", 
        content: "【原定餐廳】燒肉五苑 (吃到飽燒肉)\n\n【晚餐備案】HAMA 濱壽司 (名護店) - 平價美味的迴轉壽司選擇。" 
      }
    ]
  },
  { 
    day: 3, date: "2026-07-15", week: "WED", 
    items: [
      { id: '3-0', time: "08:00", type: "food", title: "飯店早餐", detail: "享用飯店早餐", content: "開啟活力的一天。", noModal: true },
      { 
        id: '3-1', time: "09:00", type: "spot", title: "東南植物樂園", detail: "漫步熱帶植物園", address: "沖繩市知花2146", 
        content: "園區地圖：請參考入口處導覽圖。擁有豐富的熱帶植物，還有可愛動物互動。", 
        quickLinks: [{ label: "體驗活動連結", url: "https://www.southeast-botanical.jp/activity/" }] 
      },
      { id: '3-2', time: "12:00", type: "food", title: "午餐：海族工房", detail: "新鮮海鮮料理", address: "名護市", content: "菜單包含多樣化當地漁獲。必吃美食：海鮮丼、炸魚。" },
      { 
        id: '3-3', time: "13:30", type: "spot", title: "兒童沖繩王國", detail: "動物園與神奇博物館", address: "沖繩市胡屋5-7-1", 
        content: "【官網】https://www.okzm.jp/\n\n【園區分區簡介】\n1. 動物園區：展示琉球群島原生種及世界各地動物。\n2. 神奇博物館：互動式科學與藝術體驗館，適合親子。\n3. 乘物廣場：各式小型遊樂設施。\n4. 故鄉園：展示沖繩傳統建築。" 
      },
      { 
        id: '3-4', time: "17:30", type: "food", title: "晚餐：永旺夢客來 (AEON Mall)", detail: "營業時間 10:00 - 22:00", address: "北中城村比嘉", 
        content: "沖繩最大購物中心，店鋪清單包含美食街、各式餐廳及超市。\n\n【優惠券連結】https://www.aeon-okinawa.com.tw/coupon/\n\n【人氣品牌】Uniqlo, GU, H&M, Bic Camera, Sports Authority, 各式日系雜貨。" 
      }
    ]
  },
  { 
    day: 4, date: "2026-07-16", week: "THU", 
    items: [
      { id: '4-0', time: "08:00", type: "food", title: "飯店早餐", detail: "享用早餐", content: "最後一天的全日行程，吃飽再出發。", noModal: true },
      { 
        id: '4-1', time: "09:00", type: "spot", title: "DMM Kariyushi 水族館", detail: "沉浸式水族館體驗", address: "豐見城市豐崎3-35", 
        content: "【提醒】建議先購買餵食體驗券。\n\n結合影像技術與空間設計的現代水族館。\n\n【樓層指南】https://kariyushi-aquarium.com/floor/\n\n【餵食時刻表】10:00/11:00 樹懶；10:30 企鵝。\n\n【部落格介紹】https://example.com/dmm-aquarium-blog" 
      },
      { 
        id: '4-2', time: "12:00", type: "food", title: "午餐：iiAS 沖繩豐崎", detail: "購物中心用餐", address: "豐見城市豐崎3-35", 
        content: "iiAS 購物中心內有多樣化的美食街與餐廳選擇。", 
        noModal: true,
        quickLinks: [{ label: "豐崎 iias 官網連結", url: "https://toyosaki.iias.jp/" }] 
      },
      { 
        id: '4-3', time: "14:00", type: "spot", title: "沖繩世界文化王國", detail: "玉泉洞與傳統文化", address: "南城市玉城前川1336", 
        content: "沖繩世界文化王國（Okinawa World）是體驗琉球傳統文化與自然景觀的首選之地。園內最震撼的景點莫過於「玉泉洞」，這座歷經 30 萬年形成的鐘乳石洞，全長約 5 公里（開放參觀約 890 公尺），規模在日本名列前茅，洞內密密麻麻的鐘乳石與清澈的地下泉水交織出奇幻的地下世界。走出洞穴後，您將進入「王國村」，這裡搬遷並重建了多棟具有百年歷史的琉球古民家，被列為國家登錄有形文化財。在這些古宅中，您可以體驗傳統的織布、造紙、陶藝或是穿著琉球傳統服飾拍照。此外，精彩絕倫的「Eisa 太鼓舞」表演更是展現了沖繩人的熱情與活力。園內還有毒蛇博物館，介紹沖繩特有的波布蛇。無論是自然奇觀、歷史建築還是傳統工藝，文化王國都能讓您在短短幾小時內，深度領略琉球王國的輝煌歷史與獨特魅力。\n\n【官網體驗連結】https://www.gyokusendo.co.jp/okinawaworld/handson/",
        quickLinks: [{ label: "體驗時間表連結", url: "https://www.gyokusendo.co.jp/okinawaworld/event/" }] 
      },
      { 
        id: '4-4', time: "17:00", type: "food", title: "晚餐：中本天婦羅", detail: "營業時間 10:00 - 18:00", address: "南城市玉城奧武9", 
        content: "奧武島上著名的天婦羅店，現炸美味。推薦：鮮魚、花枝天婦羅。", 
        noModal: true,
        quickLinks: [{ label: "部落格連結", url: "https://example.com/nakamoto-tempura-blog" }] 
      }
    ]
  },
  { 
    day: 5, date: "2026-07-17", week: "FRI", 
    items: [
      { id: '5-0', time: "08:00", type: "food", title: "飯店早餐", detail: "最後一次享用早餐", content: "整理行李，準備退房。", noModal: true },
      { 
        id: '5-1', time: "08:30", type: "spot", title: "波上宮 & 逛街", detail: "懸崖上的神社", address: "那霸市若狹1-25-11", 
        content: "波上宮是琉球八社之首，建在懸崖之上。\n\n【小祿站 AEON 購物資訊】位於單軌電車小祿站旁，有大型超市與各式店鋪，適合最後採買。" 
      },
      { id: '5-2', time: "12:00", type: "food", title: "午餐", detail: "簡單午餐", content: "在前往機場前享用簡單的午餐。" },
      { id: '5-3', time: "12:30", type: "transport", title: "前往機場候機", detail: "辦理登機手續", address: "那霸機場", content: "請預留充足時間辦理退稅與登機手續。" },
      { id: '5-4', time: "18:00", type: "transport", title: "返家", detail: "平安回家", content: "結束愉快的 5 天 4 夜沖繩之旅。" }
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [currentDay, setCurrentDay] = useState(1);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDeclaration, setShowDeclaration] = useState(false);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [memo, setMemo] = useState('');
  const [exchangeRate, setExchangeRate] = useState(0.21);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/JPY');
        const data = await response.json();
        if (data && data.rates && data.rates.TWD) {
          setExchangeRate(data.rates.TWD);
        }
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
      }
    };
    fetchRate();
  }, []);

  useEffect(() => {
    const savedExp = localStorage.getItem('okinawa_expenses');
    if (savedExp) setExpenses(JSON.parse(savedExp));
    const savedMemo = localStorage.getItem('okinawa_memo');
    if (savedMemo) setMemo(savedMemo);
  }, []);

  useEffect(() => { localStorage.setItem('okinawa_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('okinawa_memo', memo); }, [memo]);

  const weatherForecast = useMemo(() => {
    const data = [];
    const conditions = ['sun', 'cloud-sun', 'cloud', 'rain'];
    for (let i = 0; i < 24; i++) {
      const hour = (new Date().getHours() + i) % 24;
      data.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        temp: 28 + Math.floor(Math.random() * 5),
        condition: conditions[Math.floor(Math.random() * conditions.length)]
      });
    }
    return data;
  }, []);

  return (
    <div style={fontStyleSans} className="max-w-[480px] mx-auto min-h-screen bg-morandi-bg relative pb-36 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700&family=Noto+Serif+TC:wght@400;700&display=swap');
        body { font-family: 'Noto Sans TC', sans-serif; background-color: #F0F4F7; }
        h1, h2, h3, h4, h5, h6, .font-serif { font-family: 'Noto Serif TC', serif !important; color: #4A5568; }
      `}</style>
      <header className="pt-12 pb-8 relative px-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-morandi-primary/5 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-6">
            <div className="space-y-1">
              <p className="text-[10px] tracking-[0.6em] text-morandi-primary font-bold uppercase opacity-60">Summer 2026</p>
              <h1 style={fontStyleSerif} className="text-5xl font-black tracking-tighter text-morandi-text leading-none">
                沖繩之旅
              </h1>
            </div>
            <button onClick={() => setShowDeclaration(true)} className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-morandi-primary active:scale-95 transition-all border border-morandi-primary/10">
              <Users size={22} />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-morandi-primary/30 to-transparent" />
            <span className="text-[10px] italic text-morandi-text-muted tracking-[0.3em] uppercase">Family Adventure</span>
            <div className="h-[1px] w-12 bg-morandi-accent/30" />
          </div>
        </div>
      </header>

      <AnimatePresence>
        {showDeclaration && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm p-6">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-[360px] bg-white rounded-[40px] p-10 shadow-2xl relative text-center">
              <button onClick={() => setShowDeclaration(false)} className="absolute top-6 right-6 text-gray-200"><X size={24} /></button>
              <div className="w-16 h-16 bg-morandi-sand rounded-full flex items-center justify-center mx-auto mb-6 text-morandi-blue"><Users size={32} /></div>
              <h3 className="text-2xl font-bold text-text-main mb-6">家族旅遊宣言</h3>
              <div className="space-y-4 text-base text-text-main leading-relaxed">
                <p>「累了就休息，肚子餓了就吃飯，想上廁所馬上說。」</p>
                <p>「每天一張合照：留下 7 人的沖繩記憶。」</p>
                <p>「四大三小，平安出門，快樂回家。」</p>
              </div>
              <button onClick={() => setShowDeclaration(false)} className="mt-10 w-full py-4 bg-morandi-blue text-white rounded-2xl font-bold tracking-widest text-lg">出發！</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="px-6">
        {activeTab === 'schedule' && <ScheduleTab currentDay={currentDay} setCurrentDay={setCurrentDay} setSelectedItem={setSelectedItem} weatherForecast={weatherForecast} />}
        {activeTab === 'budget' && <BudgetTab expenses={expenses} setExpenses={setExpenses} rate={exchangeRate} />}
        {activeTab === 'list' && <ShoppingTab memo={memo} setMemo={setMemo} />}
        {activeTab === 'info' && <InfoTab />}
      </main>

      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-[420px] bg-white/90 backdrop-blur-xl border border-white/50 rounded-[32px] p-1.5 flex justify-between items-center shadow-[0_20px_60px_rgba(132,155,179,0.15)] z-50">
        <NavButton active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} icon={<Calendar size={18} />} label="行程" />
        <NavButton active={activeTab === 'budget'} onClick={() => setActiveTab('budget')} icon={<Wallet size={18} />} label="記帳" />
        <NavButton active={activeTab === 'list'} onClick={() => setActiveTab('list')} icon={<ListCheck size={18} />} label="清單" />
        <NavButton active={activeTab === 'info'} onClick={() => setActiveTab('info')} icon={<Info size={18} />} label="資訊" />
      </nav>

      <AnimatePresence>{selectedItem && <GuideModal item={selectedItem} onClose={() => setSelectedItem(null)} />}</AnimatePresence>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick} 
      className={`relative flex-1 flex flex-col items-center justify-center py-3 rounded-[24px] transition-all duration-500 ${active ? 'text-white' : 'text-morandi-text-muted hover:text-morandi-primary'}`}
    >
      {active && (
        <motion.div 
          layoutId="nav-active-bg"
          className="absolute inset-0 bg-morandi-primary rounded-[24px] shadow-lg shadow-morandi-primary/20"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}
      <div className="relative z-10 flex flex-col items-center gap-1">
        {icon}
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase">{label}</span>
      </div>
    </button>
  );
}

function ScheduleTab({ currentDay, setCurrentDay, setSelectedItem, weatherForecast }: any) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sun': return <Sun size={28} className="text-amber-300" />;
      case 'cloud-sun': return <CloudSun size={28} className="text-morandi-primary-light" />;
      case 'cloud': return <Cloud size={28} className="text-morandi-accent" />;
      case 'rain': return <CloudRain size={28} className="text-morandi-primary" />;
      default: return <Sun size={28} className="text-amber-300" />;
    }
  };

  const dayLabels = ["第一天", "第二天", "第三天", "第四天", "第五天"];
  const dayImages = [
    "https://lh3.googleusercontent.com/d/15pp4dPtXN8cq0WcNCs0rbCgGnOseHuh1",
    "https://lh3.googleusercontent.com/d/10q5Q-XBped4Sf-PH6IwSjhJ9OoCO8nq-",
    "https://lh3.googleusercontent.com/d/1FxeezSyeHqx3iLI9M5zG0dBBOORbajoP",
    "https://lh3.googleusercontent.com/d/1ZDvg98HVNdQvHPFzo6FMsXYEo0mYZKJy",
    "https://lh3.googleusercontent.com/d/1MH9ecnGn76_EVVYTALYuKzWt_zjTx9eS"
  ];
  const dayLabel = dayLabels[currentDay - 1] || "第一天";
  const dayImage = dayImages[currentDay - 1] || dayImages[0];

  const items = ITINERARY_DATA.find(d => d.day === currentDay)?.items || [];
  const mainItems = items.filter(i => i.time !== '備案');
  const backupItems = items.filter(i => i.time === '備案');

  return (
    <div className="space-y-4 pb-10">
      <div className="flex justify-between px-2 py-1 gap-2 hide-scrollbar overflow-x-auto">
        {ITINERARY_DATA.map(d => (
          <button key={d.day} onClick={() => setCurrentDay(d.day)} className="flex flex-col items-center min-w-[60px]">
            <span style={fontStyleSerif} className={`text-[10px] font-bold tracking-[0.3em] uppercase ${currentDay === d.day ? 'text-morandi-primary' : 'text-morandi-accent/40'}`}>{d.week}</span>
            <span style={fontStyleSerif} className={`text-3xl mt-1 ${currentDay === d.day ? 'font-bold text-morandi-text' : 'text-morandi-accent/40'}`}>{d.date.split('-')[2]}</span>
            {currentDay === d.day && <div className="w-1 h-1 rounded-full bg-morandi-primary mt-2" />}
          </button>
        ))}
      </div>

      <div className="h-px bg-gray-200/40 mx-2" />

      {/* Visual Balance Section: Vertical Text + Photo */}
      <div className="flex items-center gap-6 px-4 py-6">
        {/* Left: Vertical Day Label */}
        <div 
          style={{ ...fontStyleSerif, writingMode: 'vertical-rl' }} 
          className="text-gray-400 text-xl font-bold tracking-[0.5em] py-2"
        >
          {dayLabel}
        </div>
        {/* Right: 16:9 Photo Frame */}
        <div className="flex-1 aspect-video rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 bg-gray-100">
          <img 
            key={dayImage}
            src={dayImage} 
            alt={dayLabel} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      <div className="h-px bg-gray-200/40 mx-2" />

      <div className="py-2">
        <div className="flex overflow-x-auto justify-between px-4 py-3 hide-scrollbar snap-x">
          {weatherForecast.slice(0, 6).map((w: any, i: number) => (
            <button 
              key={i} 
              onClick={() => {
                const hour = parseInt(w.time.split(':')[0]);
                const target = mainItems.find((item: any) => {
                  const itemHour = parseInt(item.time.split(':')[0]);
                  return itemHour >= hour;
                });
                if (target) {
                  const el = document.getElementById(`itinerary-item-${target.id}`);
                  if (el) {
                    const offset = 120; // Offset for header/weather bar
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = el.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }
              }}
              className="flex flex-col items-center gap-2 snap-start active:scale-95 transition-all group"
            >
              <span style={fontStyleSerif} className="text-sm font-bold text-gray-400 group-hover:text-morandi-blue transition-colors">
                {i === 0 ? "現在" : w.time}
              </span>
              <div className="flex items-center justify-center py-1 group-hover:scale-110 transition-transform">
                {getWeatherIcon(w.condition)}
              </div>
              <span style={fontStyleSerif} className="text-[15px] font-bold text-text-main group-hover:text-morandi-blue transition-colors">{w.temp}°</span>
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-200/40 mx-2" />

      <div className="relative px-2 pt-2">
        <div className="relative">
          {/* Timeline Line - Only for main items */}
          <div className="absolute left-[4.5rem] top-4 bottom-4 w-px bg-gray-200" />

          <div className="space-y-6 relative">
            {mainItems.map((item: any) => {
              const isNoModal = item.noModal || item.title.includes('早餐');
              return (
                <div 
                  key={item.id} 
                  id={`itinerary-item-${item.id}`}
                  onClick={() => !isNoModal && setSelectedItem(item)} 
                  className={`relative flex items-start gap-8 py-3 transition-all ${isNoModal ? 'cursor-default' : 'cursor-pointer group'}`}
                >
                  {/* Active Highlight Box */}
                  {!isNoModal && (
                    <div className="absolute inset-0 -mx-3 bg-white/60 border border-morandi-primary/10 rounded-2xl opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-all shadow-sm z-0" />
                  )}

                  {/* Time Column */}
                  <div className="w-14 text-right pt-0.5 relative z-10">
                    <span style={fontStyleSerif} className={`text-lg font-bold transition-colors ${isNoModal ? 'text-morandi-text/40' : 'text-morandi-text group-active:text-morandi-primary'}`}>
                      {item.time}
                    </span>
                  </div>

                  {/* Dot on line */}
                  <div className={`absolute left-[4.5rem] top-[1.15rem] -translate-x-1/2 w-2 h-2 rounded-full border-2 border-white z-10 transition-colors ${isNoModal ? 'bg-gray-300' : 'bg-morandi-accent group-active:bg-morandi-primary'}`} />

                  {/* Content Column */}
                  <div className="flex-1 flex items-center justify-between gap-6 relative z-10 min-w-0">
                    <div className="flex-1 min-w-0">
                      {/* Tag System - Moved to Top */}
                      <div className="flex items-center gap-2 mb-1">
                        {TYPE_CONFIG[item.type] && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500/70">
                            {TYPE_CONFIG[item.type].icon}
                            <span>{TYPE_CONFIG[item.type].label}</span>
                          </div>
                        )}
                      </div>

                      <h4 style={fontStyleSerif} className={`font-bold text-lg transition-colors truncate mb-0.5 ${isNoModal ? 'text-morandi-text/50' : 'text-morandi-text group-active:text-morandi-primary'}`}>
                        {item.title}
                      </h4>

                      <p className={`text-xs leading-relaxed line-clamp-1 opacity-80 ${isNoModal ? 'text-morandi-text-muted/50 italic' : 'text-morandi-text-muted'}`}>
                        {item.detail}
                      </p>
                    </div>

                    {/* QuickLinks - Vertically centered relative to content */}
                    {item.quickLinks && (
                      <div className="flex flex-col gap-2 shrink-0">
                        {item.quickLinks.map((ql: any, idx: number) => (
                          <button 
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(ql.url);
                            }}
                            style={fontStyleSerif}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-morandi-primary/5 hover:bg-morandi-primary/10 rounded-lg text-[10px] font-bold text-morandi-primary transition-colors border border-morandi-primary/10 whitespace-nowrap"
                          >
                            <Link size={10} /> {ql.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {backupItems.length > 0 && (
          <div className="mt-12 space-y-4">
            <h4 className="text-sm font-bold text-morandi-dark px-2 uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-morandi-pink" /> 備案行程
            </h4>
            {backupItems.map((item: any) => (
              <div 
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="glass-card p-6 border border-morandi-blue/20 bg-white/80 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-bold text-text-main text-xl">{item.title}</h5>
                  <span className="text-xs font-bold bg-morandi-sand px-2 py-0.5 rounded-full text-morandi-blue uppercase">Backup</span>
                </div>
                <p className="text-sm text-text-muted leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GuideModal({ item, onClose }: any) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/30 backdrop-blur-[2px] p-4">
      <motion.div 
        initial={{ y: '100%' }} 
        animate={{ y: 0 }} 
        exit={{ y: '100%' }} 
        className="w-full max-w-[480px] bg-white/85 backdrop-blur-2xl rounded-t-[40px] p-8 pb-12 shadow-2xl relative max-h-[90vh] overflow-y-auto hide-scrollbar border-t border-x border-white/50"
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-8 w-10 h-10 rounded-full bg-morandi-sand/80 flex items-center justify-center text-text-main shadow-sm active:scale-90 transition-all z-20"
        >
          <X size={20} />
        </button>
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2">
            {TYPE_CONFIG[item.type] && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500/60 uppercase tracking-widest">
                {TYPE_CONFIG[item.type].icon}
                <span>{TYPE_CONFIG[item.type].label}</span>
              </div>
            )}
            <h2 className="text-3xl font-bold text-text-main leading-tight">{item.title}</h2>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-morandi-sand/50 p-6 rounded-[32px] space-y-4 text-sm">
            <div className="flex items-center gap-3"><MapPin size={16} className="text-morandi-blue" /><span>{item.address || "詳見地圖"}</span></div>
            <div className="flex items-center gap-3"><Clock size={16} className="text-morandi-blue" /><span>{item.time}</span></div>
          </div>

          <div className="text-sm leading-relaxed text-text-main bg-white border border-morandi-sand p-6 rounded-[32px] shadow-sm whitespace-pre-wrap">{item.content}</div>
          
          {item.links && item.links.length > 0 && (
            <div className="space-y-3">
              {item.links.map((link: any, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => window.open(link.url)}
                  className="w-full py-4 bg-white border border-morandi-blue/30 text-morandi-blue rounded-2xl font-bold text-sm flex items-center justify-center gap-3 shadow-sm active:scale-[0.98] transition-all"
                >
                  <Ticket size={18} /> {link.label}
                </button>
              ))}
            </div>
          )}

          <button onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address || item.title)}`)} className="w-full py-5 bg-morandi-blue text-white rounded-2xl font-bold tracking-[0.4em] flex items-center justify-center gap-3 shadow-lg">
            <Navigation size={20} /> 開啟導航
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function BudgetTab({ expenses, setExpenses, rate }: any) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [calcInput, setCalcInput] = useState('');

  const totalJPY = expenses.reduce((sum: number, e: any) => sum + e.amount, 0);
  const totalTWD = Math.round(totalJPY * rate);

  const calcResult = useMemo(() => {
    try {
      const clean = calcInput.replace(/[^0-9+\-*/().]/g, '');
      if (!clean) return 0;
      // eslint-disable-next-line no-eval
      return eval(clean) || 0;
    } catch {
      return 0;
    }
  }, [calcInput]);

  const addExpense = () => {
    if (!title || !amount) return;
    setExpenses([{ 
      id: Date.now().toString(), 
      title, 
      amount: parseFloat(amount), 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }, ...expenses]);
    setTitle(''); setAmount('');
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter((e: any) => e.id !== id));
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Dashboard Style Conversion */}
      <div className="bg-white/40 rounded-[32px] p-8 border border-white/60 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-morandi-primary/10 rounded-full flex items-center justify-center text-morandi-primary">
              <Wallet size={16} />
            </div>
            <h3 className="text-lg font-bold text-morandi-text">即時匯率換算</h3>
          </div>
          <span className="text-[10px] font-bold text-morandi-primary/60 tracking-widest uppercase">1 JPY ≈ {rate.toFixed(4)} TWD</span>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <input 
              value={calcInput}
              onChange={(e) => setCalcInput(e.target.value)}
              placeholder="輸入金額或算式..." 
              inputMode="decimal"
              className="w-full bg-transparent text-4xl font-mono font-bold outline-none text-morandi-text/40 placeholder:text-morandi-primary/10"
            />
            <div className="h-[1px] w-full bg-morandi-primary/10 mt-2" />
          </div>
          
          <div className="flex justify-between items-end">
            <p className="text-[10px] text-morandi-text-muted uppercase tracking-widest font-bold">估算結果 (TWD)</p>
            <div className="text-right">
              <span className="text-xs text-morandi-primary/60 font-mono mr-1">$</span>
              <span className="text-3xl font-mono font-bold text-morandi-primary">
                {Math.round(calcResult * rate).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add Expense Form - Integrated below conversion */}
      <div className="bg-white/60 rounded-[32px] p-8 border border-white/80 shadow-sm space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-morandi-primary/10 rounded-full flex items-center justify-center text-morandi-primary">
              <PlusCircle size={16} />
            </div>
            <h3 className="text-lg font-bold text-morandi-text">新增支出項目</h3>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-morandi-text-muted uppercase tracking-widest ml-1">項目名稱</label>
            <input 
              style={fontStyleSerif}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：晚餐、交通..." 
              className="w-full bg-white/40 p-4 rounded-2xl text-lg font-bold outline-none text-morandi-text border border-transparent focus:border-morandi-primary/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-morandi-text-muted uppercase tracking-widest ml-1">金額 (JPY)</label>
            <div className="flex items-center gap-3 bg-white/40 p-4 rounded-2xl border border-transparent focus-within:border-morandi-primary/20 transition-all">
              <input 
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0" 
                className="flex-1 bg-transparent text-2xl font-mono font-bold outline-none text-morandi-text"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={addExpense}
          className="w-full py-4 bg-morandi-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-morandi-primary/10 active:scale-95 transition-all"
        >
          儲存支出
        </button>
      </div>

      {/* Totals Section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-morandi-primary/5 p-6 rounded-[28px] border border-morandi-primary/10">
          <p className="text-[10px] text-morandi-primary/60 mb-2 uppercase tracking-widest font-bold">總支出 (JPY)</p>
          <p className="text-2xl font-mono font-bold text-morandi-text">¥{totalJPY.toLocaleString()}</p>
        </div>
        <div className="bg-morandi-accent/10 p-6 rounded-[28px] border border-morandi-accent/20">
          <p className="text-[10px] text-morandi-text-muted mb-2 uppercase tracking-widest font-bold">總支出 (TWD)</p>
          <p className="text-2xl font-mono font-bold text-morandi-text">${totalTWD.toLocaleString()}</p>
        </div>
      </div>

      {/* Expense List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h4 className="text-xs font-bold text-morandi-text-muted uppercase tracking-[0.2em]">支出明細</h4>
          <span className="text-[10px] font-bold text-morandi-primary/40 bg-white px-2 py-0.5 rounded-full border border-morandi-primary/10">{expenses.length} 筆</span>
        </div>
        
        <div className="space-y-3">
          {expenses.length === 0 ? (
            <div className="bg-white/40 rounded-[24px] p-12 text-center border border-white/60">
              <p className="text-sm text-morandi-text-muted italic">尚無支出紀錄</p>
            </div>
          ) : (
            expenses.map((ex: any) => (
              <div key={ex.id} className="bg-white rounded-[24px] p-5 shadow-sm border border-white/80 flex items-center justify-between group">
                <div className="flex-1 min-w-0 pr-4">
                  <h5 style={fontStyleSerif} className="text-base font-bold text-morandi-text truncate">{ex.title}</h5>
                  <p className="text-[10px] text-morandi-text-muted font-mono mt-0.5 opacity-60">{ex.time}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-mono text-lg font-bold text-morandi-text">¥{ex.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-morandi-primary/60 font-bold mt-0.5">≈ ${Math.round(ex.amount * rate)}</p>
                  </div>
                  <button onClick={() => removeExpense(ex.id)} className="text-morandi-accent hover:text-red-400 transition-colors p-1 opacity-40 group-hover:opacity-100">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ShoppingTab({ memo, setMemo }: any) {
  const [predefined, setPredefined] = useState<any[]>(() => {
    const saved = localStorage.getItem('okinawa_prep');
    return saved ? JSON.parse(saved) : [
      { id: 'p1', text: '護照 & 簽證 (日文譯本)', done: false },
      { id: 'p2', text: 'VJW (Visit Japan Web) 截圖', done: false },
      { id: 'p3', text: '網卡 (eSIM) / 漫遊開通', done: false },
      { id: 'p4', text: '行動電源 & 多國轉接頭', done: false }
    ];
  });

  const [shoppingItems, setShoppingItems] = useState<any[]>(() => {
    const saved = localStorage.getItem('okinawa_shop_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [prepInput, setPrepInput] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [shopForm, setShopForm] = useState({ note: '', category: '藥妝', photo: '' });

  useEffect(() => { localStorage.setItem('okinawa_prep', JSON.stringify(predefined)); }, [predefined]);
  useEffect(() => { localStorage.setItem('okinawa_shop_v2', JSON.stringify(shoppingItems)); }, [shoppingItems]);

  const addPrep = () => {
    if (!prepInput.trim()) return;
    setPredefined([...predefined, { id: Date.now().toString(), text: prepInput, done: false }]);
    setPrepInput('');
  };

  const removePrep = (id: string) => setPredefined(predefined.filter(i => i.id !== id));
  const togglePrep = (id: string) => setPredefined(predefined.map(i => i.id === id ? { ...i, done: !i.done } : i));

  const handlePhotoUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setShopForm({ ...shopForm, photo: compressedBase64 });
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const addShopItem = () => {
    if (!shopForm.photo && !shopForm.note) return;
    const newItem = {
      id: Date.now().toString(),
      ...shopForm,
      done: false,
      order: shoppingItems.length
    };
    setShoppingItems([...shoppingItems, newItem]);
    setShopForm({ note: '', category: '藥妝', photo: '' });
  };

  const removeShopItem = (id: string) => setShoppingItems(shoppingItems.filter(i => i.id !== id));
  const toggleShopItem = (id: string) => setShoppingItems(shoppingItems.map(i => i.id === id ? { ...i, done: !i.done } : i));

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...shoppingItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newItems.length) {
      [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
      setShoppingItems(newItems);
    }
  };

  const categories = ['藥妝', '衣物', '食物', '伴手禮'];

  return (
    <div className="space-y-10 pb-20">
      {/* 行前準備 */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-lg font-bold text-morandi-text flex items-center gap-2">
            <ListCheck size={18} className="text-morandi-primary" /> 行前準備
          </h3>
        </div>
        <div className="bg-white/40 rounded-[32px] p-6 space-y-4 border border-white/60">
          <div className="space-y-3">
            {predefined.map(item => (
              <div key={item.id} className="flex items-center justify-between group py-1">
                <button onClick={() => togglePrep(item.id)} className="flex items-center gap-4 flex-1 text-left">
                  {item.done ? <CheckCircle2 size={22} className="text-morandi-primary" /> : <Circle size={22} className="text-morandi-accent/30" />}
                  <span className={`text-sm ${item.done ? 'text-morandi-accent line-through' : 'text-morandi-text font-medium'}`}>{item.text}</span>
                </button>
                <button onClick={() => removePrep(item.id)} className="p-2 text-morandi-accent hover:text-red-400 opacity-40 active:opacity-100 transition-opacity">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-4 border-t border-morandi-primary/5">
            <input 
              value={prepInput}
              onChange={(e) => setPrepInput(e.target.value)}
              placeholder="新增準備項目..."
              className="flex-1 bg-white/40 p-4 rounded-2xl text-sm outline-none border border-transparent focus:border-morandi-primary/20"
              onKeyPress={(e) => e.key === 'Enter' && addPrep()}
            />
            <button onClick={addPrep} className="w-12 h-12 bg-morandi-primary text-white rounded-2xl active:scale-90 transition-all flex items-center justify-center shrink-0 shadow-sm">
              <Plus size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* 購物清單 */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-lg font-bold text-morandi-text flex items-center gap-2">
            <ImageIcon size={18} className="text-morandi-primary" /> 購物清單
          </h3>
          <div className="flex bg-white/40 rounded-xl p-1 border border-white/60">
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-morandi-primary' : 'text-morandi-accent'}`}><StretchHorizontal size={14} /></button>
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-morandi-primary' : 'text-morandi-accent'}`}><LayoutGrid size={14} /></button>
          </div>
        </div>

        {/* 新增購物項目表單 */}
        <div className="bg-white/40 rounded-[32px] p-6 space-y-4 border border-white/60">
          <div className="flex gap-4">
            <label className="w-20 h-20 bg-white/40 rounded-2xl border border-dashed border-morandi-primary/20 flex flex-col items-center justify-center cursor-pointer hover:bg-white/60 transition-colors relative overflow-hidden shrink-0">
              {shopForm.photo ? (
                <img src={shopForm.photo} className="w-full h-full object-cover" />
              ) : (
                <>
                  <Upload size={20} className="text-morandi-primary/40" />
                  <span className="text-[10px] text-morandi-primary/40 mt-1">照片</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
            <div className="flex-1 space-y-3">
              <select 
                value={shopForm.category}
                onChange={(e) => setShopForm({...shopForm, category: e.target.value})}
                className="w-full bg-white/40 p-3 rounded-xl text-xs outline-none border border-transparent focus:border-morandi-primary/20"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <textarea 
                value={shopForm.note}
                onChange={(e) => setShopForm({...shopForm, note: e.target.value})}
                placeholder="輸入商品名稱或備註..."
                className="w-full bg-white/40 p-3 rounded-xl text-xs outline-none border border-transparent focus:border-morandi-primary/20 resize-none h-16"
              />
            </div>
          </div>
          <button onClick={addShopItem} className="w-full py-4 bg-morandi-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-morandi-primary/10 active:scale-95 transition-all">
            加入清單
          </button>
        </div>

        {/* 購物項目顯示 */}
        <div className="space-y-8">
          {categories.map(cat => {
            const items = shoppingItems.filter(i => i.category === cat);
            if (items.length === 0) return null;
            return (
              <div key={cat} className="space-y-4">
                <h4 className="text-[10px] font-bold text-morandi-text-muted px-2 uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-morandi-primary" /> {cat}
                </h4>
                
                <div className={viewMode === 'grid' ? "grid grid-cols-2 gap-4" : "space-y-4"}>
                  {items.map((item, idx) => {
                    const globalIdx = shoppingItems.findIndex(si => si.id === item.id);
                    return (
                      <div key={item.id} className={`bg-white rounded-[24px] overflow-hidden group relative border border-white/80 shadow-sm ${viewMode === 'list' ? 'flex items-center p-3 gap-4' : 'flex flex-col'}`}>
                        <div className={`${viewMode === 'list' ? 'w-14 h-14 rounded-xl' : 'aspect-square w-full'} bg-morandi-bg relative overflow-hidden shrink-0`}>
                          {item.photo ? (
                            <img src={item.photo} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-morandi-accent/30"><ImageIcon size={viewMode === 'list' ? 18 : 24} /></div>
                          )}
                          <button onClick={() => toggleShopItem(item.id)} className="absolute top-2 left-2 z-10">
                            {item.done ? <CheckCircle2 size={18} className="text-white drop-shadow-md fill-morandi-primary" /> : <Circle size={18} className="text-white drop-shadow-md" />}
                          </button>
                        </div>
                        
                        <div className={`p-3 flex-1 min-w-0 ${item.done ? 'opacity-40' : ''}`}>
                          <p className="text-xs font-bold text-morandi-text leading-snug break-words">{item.note || '未命名商品'}</p>
                        </div>

                        {/* 操作按鈕 */}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-40 active:opacity-100 transition-opacity">
                          {viewMode === 'grid' && (
                            <>
                              <button onClick={() => moveItem(globalIdx, 'up')} className="p-1 bg-white/90 rounded-md text-morandi-primary shadow-sm"><ChevronLeft size={12} /></button>
                              <button onClick={() => moveItem(globalIdx, 'down')} className="p-1 bg-white/90 rounded-md text-morandi-primary shadow-sm"><ChevronRightIcon size={12} /></button>
                            </>
                          )}
                          <button onClick={() => removeShopItem(item.id)} className="p-1 bg-white/90 rounded-md text-red-400 shadow-sm"><Trash2 size={12} /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 個人備忘錄 */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-lg font-bold text-morandi-text flex items-center gap-2">
            <Smartphone size={18} className="text-morandi-primary" /> 個人備忘錄
          </h3>
        </div>
        <div className="bg-white/40 rounded-[32px] p-6 border border-white/60">
          <textarea 
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="輸入個人筆記、連結或重要資訊..."
            className="w-full min-h-[160px] bg-white/40 p-5 rounded-2xl text-sm outline-none resize-none text-morandi-text leading-relaxed border border-transparent focus:border-morandi-primary/10"
          />
        </div>
      </section>
    </div>
  );
}

function InfoTab() {
  const [reservations, setReservations] = useState<any[]>(() => {
    const saved = localStorage.getItem('okinawa_reservations');
    return saved ? JSON.parse(saved) : [];
  });
  const [resInput, setResInput] = useState({ label: '', code: '' });
  const [openSection, setOpenSection] = useState<string | null>('emergency');

  useEffect(() => { localStorage.setItem('okinawa_reservations', JSON.stringify(reservations)); }, [reservations]);

  const addRes = () => {
    if (!resInput.label || !resInput.code) return;
    setReservations([...reservations, { id: Date.now().toString(), ...resInput }]);
    setResInput({ label: '', code: '' });
  };

  const removeRes = (id: string) => setReservations(reservations.filter(r => r.id !== id));

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* 1. Google Map - Top */}
      <div className="bg-white/40 rounded-[32px] overflow-hidden h-[260px] relative shadow-sm border border-white/60">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114515.65485459317!2d127.6186847432049!3d26.24174363381014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34e5697141879401%3A0x10dba9a8008405e!2z5rKW57iE!5e0!3m2!1szh-TW!2stw!4v1715600000000!5m2!1szh-TW!2stw" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* 2. Visit Japan Web - Second */}
      <div className="relative group cursor-pointer" onClick={() => window.open('https://www.vjw.digital.go.jp/')}>
        <div className="absolute -inset-1 bg-gradient-to-r from-morandi-primary to-morandi-accent rounded-[32px] blur opacity-5 group-hover:opacity-20 transition duration-1000" />
        <div className="relative flex bg-white rounded-[28px] overflow-hidden border border-white/80 shadow-sm">
          <div className="w-20 bg-morandi-primary p-5 flex flex-col items-center justify-center text-white gap-2 border-r border-dashed border-white/20 relative">
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-morandi-bg rounded-full" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-morandi-bg rounded-full" />
            <Smartphone size={20} />
            <span className="text-[9px] font-bold tracking-tighter uppercase vertical-text">Entry</span>
          </div>
          <div className="flex-1 p-5 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-morandi-primary uppercase tracking-widest">VJW Official</span>
              <ExternalLink size={12} className="text-morandi-primary/30" />
            </div>
            <h3 className="text-lg font-bold text-morandi-text">Visit Japan Web</h3>
            <p className="text-[10px] text-morandi-text-muted leading-tight">請提前完成填寫並截圖通關 QR Code。</p>
          </div>
        </div>
      </div>

      {/* 3. Accordion Sections */}
      <div className="space-y-3">
        {/* 緊急聯絡資訊 */}
        <CollapsibleSection 
          id="emergency" 
          title="緊急聯絡資訊" 
          icon={<PhoneCall size={18} />} 
          isOpen={openSection === 'emergency'} 
          onToggle={() => toggleSection('emergency')}
          color="morandi-primary"
        >
          <div className="space-y-4">
            {/* Quick Numbers */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/60 p-5 rounded-2xl border border-white/80 shadow-sm flex flex-col items-center justify-center gap-1">
                <span className="text-[9px] font-bold text-morandi-text-muted uppercase tracking-widest">警察局</span>
                <span style={fontStyleSerif} className="text-3xl font-bold text-red-400/80">110</span>
              </div>
              <div className="bg-white/60 p-5 rounded-2xl border border-white/80 shadow-sm flex flex-col items-center justify-center gap-1">
                <span className="text-[9px] font-bold text-morandi-text-muted uppercase tracking-widest">救護/火警</span>
                <span style={fontStyleSerif} className="text-3xl font-bold text-red-400/80">119</span>
              </div>
            </div>

            {/* Medical Hotline */}
            <div className="bg-white/60 p-5 rounded-2xl border border-white/80 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-morandi-text-muted uppercase tracking-widest">訪日外國人醫療熱線</span>
                <span className="text-[8px] font-bold bg-morandi-primary/10 text-morandi-primary px-2 py-0.5 rounded-full">24H 中文</span>
              </div>
              <div className="flex items-center justify-between">
                <p style={fontStyleSerif} className="text-xl font-bold text-morandi-text tracking-tight">+81-50-3816-2787</p>
                <button onClick={() => window.open('tel:+815038162787')} className="w-10 h-10 bg-morandi-primary text-white rounded-xl flex items-center justify-center active:scale-90 transition-all shadow-sm">
                  <PhoneCall size={16} />
                </button>
              </div>
            </div>

            {/* Representative Office */}
            <div className="bg-white/60 p-5 rounded-2xl border border-white/80 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-morandi-text-muted uppercase tracking-widest">駐日辦事處那霸分處</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-morandi-primary">急難救助專線</p>
                  <p style={fontStyleSerif} className="text-xl font-bold text-morandi-text">090-1942-1100</p>
                </div>
                <button onClick={() => window.open('tel:09019421100')} className="w-10 h-10 bg-morandi-primary text-white rounded-xl flex items-center justify-center active:scale-90 transition-all shadow-sm">
                  <PhoneCall size={16} />
                </button>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* 預約代號 */}
        <CollapsibleSection 
          id="reservations" 
          title="預約代號" 
          icon={<Ticket size={18} />} 
          isOpen={openSection === 'reservations'} 
          onToggle={() => toggleSection('reservations')}
          color="morandi-primary"
        >
          <div className="space-y-5">
            <div className="flex gap-2">
              <input 
                value={resInput.label}
                onChange={(e) => setResInput({...resInput, label: e.target.value})}
                placeholder="項目 (如: 星宇)"
                className="flex-1 bg-white/40 p-3 rounded-xl text-xs outline-none border border-transparent focus:border-morandi-primary/20"
              />
              <input 
                value={resInput.code}
                onChange={(e) => setResInput({...resInput, code: e.target.value})}
                placeholder="代號"
                className="flex-1 bg-white/40 p-3 rounded-xl text-xs outline-none border border-transparent focus:border-morandi-primary/20 font-mono"
              />
              <button onClick={addRes} className="p-3 bg-morandi-primary text-white rounded-xl active:scale-90 transition-all shadow-sm">
                <Plus size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {reservations.map(res => (
                <div key={res.id} className="bg-white/60 p-4 rounded-2xl border border-white/80 relative group shadow-sm">
                  <p className="text-[10px] text-morandi-text-muted mb-1 truncate pr-5 font-bold uppercase tracking-widest">{res.label}</p>
                  <p className="text-base font-bold font-mono text-morandi-text">{res.code}</p>
                  <button onClick={() => removeRes(res.id)} className="absolute top-3 right-3 text-morandi-accent hover:text-red-400 opacity-40 group-hover:opacity-100 transition-opacity">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleSection>

        {/* 旅遊禁忌與注意事項 */}
        <CollapsibleSection 
          id="taboos" 
          title="旅遊禁忌與注意事項" 
          icon={<AlertTriangle size={18} />} 
          isOpen={openSection === 'taboos'} 
          onToggle={() => toggleSection('taboos')}
          color="morandi-primary"
        >
          <ul className="space-y-5 text-sm text-morandi-text leading-relaxed px-2">
            <li className="flex gap-4">
              <span className="text-morandi-primary font-bold text-lg opacity-40">01</span>
              <p><span className="font-bold">出入境違禁品：</span>嚴禁攜帶肉類製品、新鮮蔬果。包含肉鬆、含肉泡麵等。</p>
            </li>
            <li className="flex gap-4">
              <span className="text-morandi-primary font-bold text-lg opacity-40">02</span>
              <p><span className="font-bold">自駕規則：</span>沖繩速限較嚴格（一般道路 40-50km/h），切勿違規停車，罰金極高。</p>
            </li>
            <li className="flex gap-4">
              <span className="text-morandi-primary font-bold text-lg opacity-40">03</span>
              <p><span className="font-bold">禮儀：</span>室內請輕聲細語，拍照前請先確認是否允許。垃圾請分類處理。</p>
            </li>
          </ul>
        </CollapsibleSection>

        {/* 單軌列車 (Yui Rail) */}
        <CollapsibleSection 
          id="yuirail" 
          title="單軌列車 (Yui Rail)" 
          icon={<Car size={18} />} 
          isOpen={openSection === 'yuirail'} 
          onToggle={() => toggleSection('yuirail')}
          color="morandi-primary"
        >
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-2xl border border-white/60 bg-white shadow-sm">
              <img 
                src="https://lh3.googleusercontent.com/d/1vnkzussydV7yR_d5nXTRV8wDW5HMirBQ" 
                className="min-w-[600px] w-full" 
                referrerPolicy="no-referrer"
                alt="Yui Rail Map"
              />
            </div>
            <div className="bg-white/40 p-5 rounded-2xl space-y-2 text-xs leading-relaxed text-morandi-text border border-white/60">
              <p>• 可使用現金、Suica, ICOCA 等交通卡。</p>
              <p>• 6歲以下兒童免票，6-12歲半價。</p>
              <p>• 飯店位於 <span className="font-bold text-morandi-primary">11 歌町站 (Omoromachi)</span>。</p>
            </div>
          </div>
        </CollapsibleSection>

        {/* 沖繩 FUNPASS */}
        <CollapsibleSection 
          id="funpass" 
          title="沖繩 FUNPASS" 
          icon={<Ticket size={18} />} 
          isOpen={openSection === 'funpass'} 
          onToggle={() => toggleSection('funpass')}
          color="morandi-primary"
        >
          <div className="flex items-center justify-between bg-white/40 p-5 rounded-2xl border border-white/60">
            <div className="space-y-1">
              <p className="text-sm font-bold text-morandi-text">一票玩遍沖繩熱門景點！</p>
              <p className="text-[10px] text-morandi-text-muted">包含水族館、植物園等 7 大景點。</p>
            </div>
            <a href="https://okinawa.funpass.app/" target="_blank" rel="noreferrer" className="w-10 h-10 bg-morandi-primary text-white rounded-xl flex items-center justify-center shadow-sm active:scale-90 transition-all">
              <ExternalLink size={16} />
            </a>
          </div>
        </CollapsibleSection>

        {/* 購物折價券 */}
        <CollapsibleSection 
          id="coupons" 
          title="購物折價券" 
          icon={<Wallet size={18} />} 
          isOpen={openSection === 'coupons'} 
          onToggle={() => toggleSection('coupons')}
          color="morandi-primary"
        >
          <div className="grid grid-cols-1 gap-4">
            <CouponItem name="Bic Camera" discount="10% + 7% OFF" url="https://www.biccamera.com.t.tj.hp.transer.com/service/logistics/tax-free/index.html" />
            <CouponItem name="Don Quijote (唐吉訶德)" discount="10% + 5% OFF" url="https://www.donki.com/en/service/coupon.php" />
            <CouponItem name="松本清 (Matsukiyo)" discount="10% + 3-7% OFF" url="https://www.matsukiyo.co.jp/service/taxfree" />
            <p className="text-[10px] text-center text-morandi-text-muted mt-2 italic">點擊開啟官方優惠券頁面，結帳時出示即可。</p>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}

function CollapsibleSection({ id, title, icon, children, isOpen, onToggle, color }: any) {
  return (
    <div className="bg-white/40 rounded-[32px] overflow-hidden border border-white/60 shadow-sm">
      <button 
        onClick={onToggle}
        className={`w-full p-6 flex items-center justify-between transition-all ${isOpen ? 'bg-white/20' : 'hover:bg-white/40'}`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${color === 'morandi-primary' ? 'bg-morandi-primary/10 text-morandi-primary' : 'bg-morandi-accent/10 text-morandi-accent'}`}>
            {icon}
          </div>
          <h3 className="text-base font-bold text-morandi-text">{title}</h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-morandi-accent/60"
        >
          <ChevronRight size={18} className="rotate-90" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 pt-2 border-t border-morandi-primary/5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CouponItem({ name, discount, url }: any) {
  return (
    <button 
      onClick={() => window.open(url)}
      className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-white/60 hover:bg-white/60 transition-all group shadow-sm"
    >
      <div className="text-left">
        <p className="text-sm font-bold text-morandi-text">{name}</p>
        <p className="text-[10px] text-morandi-primary font-bold mt-1 uppercase tracking-wider">{discount}</p>
      </div>
      <ExternalLink size={14} className="text-morandi-primary opacity-40 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

function AlertTriangle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
