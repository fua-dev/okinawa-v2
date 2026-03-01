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
  ExternalLink, Sun, Cloud, CloudRain, Utensils, Plane, Car, Upload, Star,
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
          { label: "機捷時刻表", url: "https://www.tymetro.com.tw/tymetro-new/tw/_pages/travel-guide/timetable.php" }
        ],
        noNav: true
      },
      { 
        id: '1-1-1', time: "15:50", type: "flight", title: "啟程：星宇航空 JX870", detail: "15:50–16:25 飛行時間", address: "桃園機場 -> 那霸機場", 
        content: "搭乘星宇航空 JX870 班機前往那霸。預計 16:25 抵達沖繩。",
        noModal: true
      },
      { 
        id: '1-2', time: "15:00", type: "transport", title: "抵達那霸空港 & OTS 租車", detail: "預計抵達後分頭行動", address: "那霸機場 OTS 營業所", 
        content: "抵達後約 15:30 進行租車行程。請搭乘機場接駁車前往營業所辦理手續。",
        otsInfo: {
          title: "OTS 接駁資訊",
          link: "https://www.otsinternational.jp/otsrentacar/cn/okinawa/pickup/naha-airport-international/",
          mapImage: "https://www.otsinternational.jp/otsrentacar/cn/img/page/okinawa/access/pickup_naha_international/floor-map_2026-cn.png",
          guide: "到達那霸機場領取行李並通過檢查口 → 請向右走（國內線方向）走到盡頭 → 搭乘電扶梯上二樓後左轉 → 馬上再向右轉進到長廊直走 → 搭乘電扶梯下到國內線 1 樓並前往 4 號出口 → 由 4 號出口出來後請穿過人行道，前往左側的「10-A（R-10）」接駁站。"
        },
        remarks: "Joy Jungle 娃娃機店：位於那霸機場國內線，從國際線入境後往單軌電車站方向步行即可經過。",
        noNav: true
      },
      { 
        id: '1-3', time: "16:00", type: "stay", title: "那霸歌町大和roynet飯店premier", detail: "Check-in 放置行李", address: "那霸市安里1-1-1", 
        content: "飯店位於那霸新都心，地理位置極佳。對面就有百貨公司，周邊購物與餐飲選擇非常豐富。",
        hotelDetails: {
          officialSite: "https://www.daiwaroynet.jp/naha-omoromachi-premier/",
          routes: [
            { label: "Omoromachi 站步行", desc: "從單軌電車站步行約 5 分鐘即可抵達。", url: "https://www.google.com/maps/dir/?api=1&origin=Omoromachi+Station&destination=Daiwa+Roynet+Hotel+Naha-Omoromachi+PREMIER" },
            { label: "OTS 開車", desc: "從 OTS 臨空豐崎營業所開車約 20-30 分鐘。", url: "https://www.google.com/maps/dir/?api=1&origin=OTS+Rent-a-car+Naha+Airport&destination=Daiwa+Roynet+Hotel+Naha-Omoromachi+PREMIER" }
          ],
          shopping: {
            name: "新都心 MAIN PLACE",
            url: "https://blog-nahamainplace.san-a.co.jp/shoplist/",
            hours: "10:00~22:00 (部分店鋪)",
            floors: [
              "1F: earth, wego, kastane, 靴下屋, niko and…, LOWRYS FARM, 3COINS, Lattice",
              "2F: ABM-MART, 三麗鷗商店，無印良品，扭蛋"
            ]
          },
          breakfastRemarks: "入住時加購餐券。小學生以上 1,000 日圓 (含稅)，學齡前兒童免費。"
        },
        noNav: true
      },
      { 
        id: '1-4', time: "17:30", type: "spot", title: "國際通散策", detail: "探索那霸最熱鬧的街道", address: "那霸市國際通", 
        content: "國際通是那霸的心臟地帶，全長約 1.6 公里，匯集了各式土產店、餐廳與百貨，是沖繩最繁華的街道。",
        officialSite: "https://www.japan.travel/hk/spot/587/",
        top10: {
          title: "TOP 10 商店/小吃",
          items: [
            { name: "淳久堂書店 (那霸店)", desc: "沖繩最大的書店，文具與書籍種類齊全。", url: "https://www.google.com/maps/search/?api=1&query=淳久堂書店+那霸店" },
            { name: "Splash Okinawa", desc: "以沖繩海洋為主題的精緻飾品與雜貨店。", url: "https://www.google.com/maps/search/?api=1&query=Splash+Okinawa+國際通" },
            { name: "Okinawa Art Shop Mash", desc: "匯集沖繩在地藝術家的原創手工藝品。", url: "https://www.google.com/maps/search/?api=1&query=Okinawa+Art+Shop+Mash" },
            { name: "御菓子御殿", desc: "紅芋塔名店，建築外觀極具特色。", url: "https://www.google.com/maps/search/?api=1&query=御菓子御殿+國際通松尾店" },
            { name: "鹽屋 (國際通店)", desc: "販售各式沖繩海鹽，推薦雪鹽霜淇淋。", url: "https://www.google.com/maps/search/?api=1&query=鹽屋+國際通店" },
            { name: "Calbee+", desc: "現炸薯條三兄弟與沖繩限定口味零食。", url: "https://www.google.com/maps/search/?api=1&query=Calbee+Plus+Okinawa" },
            { name: "Blue Seal 冰淇淋", desc: "沖繩代表性冰淇淋，口味選擇眾多。", url: "https://www.google.com/maps/search/?api=1&query=Blue+Seal+國際通" },
            { name: "驚安殿堂 唐吉訶德", desc: "24小時營業，購物補貨的最佳去處。", url: "https://www.google.com/maps/search/?api=1&query=Don+Quijote+國際通" },
            { name: "琉球咖啡館", desc: "推薦著名的「武士咖啡」，口感濃郁。", url: "https://www.google.com/maps/search/?api=1&query=琉球咖啡館" },
            { name: "沖繩屋 (Okinawa-ya)", desc: "販售各式沖繩特色小物與紀念品。", url: "https://www.google.com/maps/search/?api=1&query=沖繩屋+國際通" }
          ]
        }
      },
      { 
        id: '1-5', time: "17:30", type: "food", title: "國際通晚餐「非牛/非生魚」Top 10 推薦", detail: "可分隊用餐", address: "那霸市國際通", 
        content: "國際通周邊餐廳選擇眾多，可依喜好分隊行動。",
        hideTime: true,
        top10: {
          title: "國際通晚餐「非牛/非生魚」Top 10 推薦",
          items: [
            { name: "暖暮拉麵 (那霸牧志店)", desc: "九州拉麵票選第一名，國際通排隊名店。", url: "https://www.google.com/maps/search/?api=1&query=暖暮拉麵+那霸牧志店" },
            { name: "琉球新麵 通堂", desc: "招牌男人麵與女人麵，湯頭層次豐富。", url: "https://www.google.com/maps/search/?api=1&query=琉球新麵+通堂+寄宮店" },
            { name: "ゆうなんぎい (Yunangi)", desc: "沖繩家庭料理老店，東坡肉與苦瓜雜炒必點。", url: "https://www.google.com/maps/search/?api=1&query=ゆうなんぎい" },
            { name: "沖繩麵 Eibun", desc: "超人氣創意沖繩麵，湯頭清甜且麵條Q彈。", url: "https://www.google.com/maps/search/?api=1&query=Okinawa+Soba+Eibun" },
            { name: "Angama (あんがま)", desc: "道地沖繩料理搭配傳統表演，適合家庭聚餐。", url: "https://www.google.com/maps/search/?api=1&query=あんがま+國際通" },
            { name: "國際通屋台村", desc: "匯集多樣化熟食小攤，氛圍熱鬧適合體驗當地風情。", url: "https://www.google.com/maps/search/?api=1&query=國際通屋台村" },
            { name: "嘉手納蕎麥麵", desc: "傳統沖繩麵，簡單純粹的美味。", url: "https://www.google.com/maps/search/?api=1&query=嘉手納蕎麥麵" },
            { name: "居酒屋 祭囃子", desc: "現場三線琴演奏，提供豐富的熟食沖繩料理。", url: "https://www.google.com/maps/search/?api=1&query=居酒屋+祭囃子" },
            { name: "Gusto (ガスト) 那霸國際通店", desc: "知名家庭餐廳，餐點多樣化且對兒童非常友善。", url: "https://www.google.com/maps/search/?api=1&query=Gusto+那霸國際通店" },
            { name: "琉球茶房 (Ashibiuna)", desc: "在古色古香的環境中享用精緻的沖繩熟食定食。", url: "https://www.google.com/maps/search/?api=1&query=琉球茶房+Ashibiuna" }
          ]
        }
      }
    ]
  },
  { 
    day: 2, date: "2026-07-14", week: "TUE", 
    items: [
      { id: '2-0', time: "08:00", type: "food", title: "飯店早餐", detail: "享用飯店美味早餐", content: "開啟活力的一天。", noModal: true },
      { 
        id: '2-1', time: "08:30", type: "spot", title: "西來院達摩寺", detail: "祈福參拜", address: "那霸市首里赤田町1-5-1", 
        content: "西來院是首里著名的寺院，環境清幽。\n\n【口金包兌換】持相關憑證可於寺內指定處兌換精美口金包。",
        links: [
          { label: "口金包照片/資訊", url: "https://lh3.googleusercontent.com/d/1vnkzussydV7yR_d5nXTRV8wDW5HMirBQ", icon: "image" },
          { label: "飯店至達摩寺導航", url: "https://www.google.com/maps/dir/?api=1&origin=Daiwa+Roynet+Hotel+Naha-Omoromachi+PREMIER&destination=西來院+達摩寺", icon: "map" }
        ]
      },
      { 
        id: '2-2', time: "10:00", type: "spot", title: "古宇利島", detail: "跨海大橋美景", address: "今歸仁村古宇利", 
        content: "古宇利島位於沖繩本島北部，以絕美的「古宇利大橋」聞名。這座橋全長約 1960 公尺，橫跨在清澈的「古宇利藍」海面上。\n\n島上流傳著琉球版的亞當與夏娃傳說，因此也被稱為「戀島」。島北側的心形岩是情侶必訪聖地。古宇利海洋塔則可俯瞰整座大橋美景。\n\n在這裡，您可以品嚐著名的蝦蝦飯，享受悠閒的時光。",
        links: [
          { label: "古宇利風景照", url: "https://lh3.googleusercontent.com/d/1vnkzussydV7yR_d5nXTRV8wDW5HMirBQ", icon: "image" },
          { label: "達摩寺至古宇利導航", url: "https://www.google.com/maps/dir/?api=1&origin=西來院+達摩寺&destination=古宇利島", icon: "map" }
        ]
      },
      { 
        id: '2-3', time: "12:00", type: "food", title: "午餐：名護周邊美食", detail: "詳見彈跳窗備案", address: "名護市", 
        content: "【原定餐廳】百年古家 大家 (阿古豬料理)\n\n【人氣午餐備案】\n1. 名護漁港食堂\n2. 燒肉乃我那霸\n3. 幸ちゃんそば\n4. Captain Kangaroo\n5. 岸本食堂",
        links: [
          { label: "百年古家 大家 導航", url: "https://www.google.com/maps/search/?api=1&query=百年古家+大家", icon: "map" },
          { label: "名護漁港食堂 導航", url: "https://www.google.com/maps/search/?api=1&query=名護漁港食堂", icon: "map" },
          { label: "燒肉乃我那霸 導航", url: "https://www.google.com/maps/search/?api=1&query=燒肉乃我那霸", icon: "map" },
          { label: "岸本食堂 導航", url: "https://www.google.com/maps/search/?api=1&query=岸本食堂", icon: "map" }
        ],
        noNav: true
      },
      { 
        id: '2-4', time: "14:00", type: "spot", title: "美麗海水族館", detail: "觀賞黑潮之海", address: "本部町石川424", 
        content: "【1F 深海世界】探索神祕的深海生物與生態。\n【2F 黑潮之海】世界級巨大水槽，觀賞鯨鯊與鬼蝠魟。\n【3F 珊瑚礁之旅】展示豐富多樣的珊瑚礁生態。\n【4F 大海召喚】俯瞰黑潮之海，感受海洋的壯闊。\n\n【節目時刻表】\n- 黑潮之海餵食秀：15:00 / 17:00\n- 海豚秀 (Okichan)：10:30 / 11:30 / 13:00 / 15:00 / 17:00",
        links: [
          { label: "水族館照片", url: "https://lh3.googleusercontent.com/d/1vnkzussydV7yR_d5nXTRV8wDW5HMirBQ", icon: "image" },
          { label: "節目時刻表官網", url: "https://churaumi.okinawa/program/", icon: "link" },
          { label: "水族館導航", url: "https://www.google.com/maps/search/?api=1&query=美麗海水族館", icon: "map" }
        ]
      },
      { 
        id: '2-5', time: "18:00", type: "food", title: "晚餐：燒肉/壽司", detail: "詳見彈跳窗備案", address: "名護市", 
        content: "【原定餐廳】燒肉五苑 (吃到飽燒肉)\n\n【晚餐備案】HAMA 濱壽司 (名護店)",
        links: [
          { label: "水族館至燒肉五苑導航", url: "https://www.google.com/maps/dir/?api=1&origin=美麗海水族館&destination=燒肉五苑+名護店", icon: "map" },
          { label: "水族館至濱壽司導航", url: "https://www.google.com/maps/dir/?api=1&origin=美麗海水族館&destination=HAMA+壽司+名護店", icon: "map" }
        ],
        noNav: true
      }
    ]
  },
  { 
    day: 3, date: "2026-07-15", week: "WED", 
    items: [
      { id: '3-0', time: "08:00", type: "food", title: "飯店早餐", detail: "享用飯店早餐", content: "開啟活力的一天。", noModal: true },
      { 
        id: '3-1', time: "09:00", type: "spot", title: "東南植物樂園", detail: "漫步熱帶植物園", address: "沖繩市知花2146", 
        content: "園區擁有豐富的熱帶植物，還有可愛動物互動區，適合全家大小一同遊玩。", 
        links: [
          { label: "體驗活動連結", url: "https://www.southeast-botanical.jp/activity/", icon: "link" },
          { label: "飯店至植物樂園導航", url: "https://www.google.com/maps/dir/?api=1&origin=Daiwa+Roynet+Hotel+Naha-Omoromachi+PREMIER&destination=東南植物樂園", icon: "map" }
        ]
      },
      { 
        id: '3-2', time: "12:00", type: "food", title: "午餐：海族工房", detail: "新鮮海鮮料理", address: "名護市", 
        content: "菜單包含多樣化當地漁獲。必吃美食：海鮮丼、炸魚。",
        links: [
          { label: "植物樂園至海族工房導航", url: "https://www.google.com/maps/dir/?api=1&origin=東南植物樂園&destination=海族工房", icon: "map" }
        ]
      },
      { 
        id: '3-3', time: "13:30", type: "spot", title: "兒童沖繩王國", detail: "動物園與神奇博物館", address: "沖繩市胡屋5-7-1", 
        content: "結合動物園與互動博物館的親子景點。\n\n【簡介】展示琉球群島原生種及世界動物，提供豐富的自然教育體驗。",
        links: [
          { label: "官網資訊", url: "https://www.okzm.jp/", icon: "link" },
          { label: "餵食體驗預約", url: "https://www.okzm.jp/event/feed/", icon: "ticket" },
          { label: "兒童王國導航", url: "https://www.google.com/maps/search/?api=1&query=沖繩兒童王國", icon: "map" }
        ]
      },
      { 
        id: '3-4', time: "17:30", type: "food", title: "永旺夢樂城\n(AEON Mall)", detail: "營業時間 10:00 - 22:00", address: "北中城村比嘉", 
        content: "沖繩最大購物中心，店鋪清單包含美食街、各式餐廳及超市。\n\n【1F-4F 人氣品牌】\n- 1F: AEON Style 超市, 藥妝\n- 2F: Uniqlo, GU, H&M\n- 3F: Sports Authority, 玩具反斗城\n- 4F: 美食街, 電影院",
        links: [
          { label: "優惠券連結", url: "https://www.aeon-okinawa.com.tw/coupon/", icon: "ticket" },
          { label: "AEON Mall 導航", url: "https://www.google.com/maps/search/?api=1&query=AEON+Mall+Okinawa+Rycom", icon: "map" }
        ]
      },
      { 
        id: '3-5', time: "備案", type: "spot", title: "普天滿宮", detail: "神祕的鐘乳石洞神社", address: "宜野灣市普天間1-27-10", 
        content: "普天滿宮是琉球八社之一，最特別的是其位於神社後方的鐘乳石洞穴，需向巫女申請方可進入參觀。",
        links: [
          { label: "普天滿宮導航", url: "https://www.google.com/maps/search/?api=1&query=普天滿宮", icon: "map" }
        ]
      }
    ]
  },
  { 
    day: 4, date: "2026-07-16", week: "THU", 
    items: [
      { id: '4-0', time: "08:00", type: "food", title: "飯店早餐", detail: "享用早餐", content: "最後一天的全日行程，吃飽再出發。", noModal: true },
      { 
        id: '4-1', time: "09:00", type: "spot", title: "DMM Kariyushi 水族館", detail: "沉浸式水族館體驗", address: "豐見城市豐崎3-35", 
        content: "結合影像技術與空間設計的現代水族館，提供沉浸式的海洋體驗。", 
        links: [
          { label: "樓層指南", url: "https://kariyushi-aquarium.com/floor/", icon: "map" },
          { label: "餵食時刻表", url: "https://kariyushi-aquarium.com/program/", icon: "clock" },
          { label: "部落格介紹", url: "https://example.com/dmm-aquarium-blog", icon: "link" },
          { label: "飯店至 DMM 導航", url: "https://www.google.com/maps/dir/?api=1&origin=Daiwa+Roynet+Hotel+Naha-Omoromachi+PREMIER&destination=DMM+Kariyushi+Aquarium", icon: "map" }
        ]
      },
      { 
        id: '4-2', time: "12:00", type: "food", title: "午餐：iiAS 沖繩豐崎", detail: "購物中心用餐", address: "豐見城市豐崎3-35", 
        content: "iiAS 購物中心內有多樣化的美食街與餐廳選擇，適合放鬆用餐與逛街。", 
        links: [
          { label: "豐崎 iias 官網", url: "https://toyosaki.iias.jp/", icon: "link" }
        ]
      },
      { 
        id: '4-2-1', time: "備案", type: "food", title: "中本天婦羅", detail: "奧武島人氣美食", address: "南城市玉城奧武9", 
        content: "奧武島上著名的天婦羅店，現炸美味。"
      },
      { 
        id: '4-3', time: "14:00", type: "spot", title: "沖繩世界文化王國", detail: "玉泉洞與傳統文化", address: "南城市玉城前川1336", 
        content: "【玉泉洞】歷經 30 萬年形成的鐘乳石洞，規模日本前茅。\n【王國村】重建百年琉球古民家，體驗傳統工藝。\n【Eisa 太鼓舞】展現沖繩熱情與活力的傳統表演。",
        links: [
          { label: "表演時間表", url: "https://www.gyokusendo.co.jp/okinawaworld/event/", icon: "clock" },
          { label: "琉裝體驗預約", url: "https://www.gyokusendo.co.jp/okinawaworld/handson/", icon: "ticket" },
          { label: "挖珍珠體驗", url: "https://www.gyokusendo.co.jp/okinawaworld/handson/", icon: "ticket" },
          { label: "沖繩世界導航", url: "https://www.google.com/maps/search/?api=1&query=沖繩世界+文化王國", icon: "map" }
        ]
      },
      { 
        id: '4-4', time: "17:00", type: "food", title: "晚餐：中本天婦羅", detail: "營業時間 10:00 - 18:00", address: "南城市玉城奧武9", 
        content: "奧武島是著名的「貓島」，以美味的天婦羅聞名。用餐方式為先填寫點單後排隊結帳，建議在海邊享用。\n\n【奧武島簡介】環島一圈僅需 5 分鐘，充滿悠閒的漁村氣息。除了天婦羅，這裡的貓咪也是一大亮點。",
        links: [
          { label: "菜單資訊", url: "https://lh3.googleusercontent.com/d/1vnkzussydV7yR_d5nXTRV8wDW5HMirBQ", icon: "image" },
          { label: "部落格連結", url: "https://example.com/nakamoto-tempura-blog", icon: "link" }
        ]
      }
    ]
  },
  { 
    day: 5, date: "2026-07-17", week: "FRI", 
    items: [
      { id: '5-0', time: "08:00", type: "food", title: "飯店早餐", detail: "最後一次享用早餐", content: "整理行李，準備退房。", noModal: true },
      { 
        id: '5-1', time: "08:30", type: "spot", title: "波上宮 & 逛街", detail: "懸崖上的神社", address: "那霸市若狹1-25-11", 
        content: "波上宮是琉球八社之首，建在懸崖之上，可俯瞰海灘景觀。\n\n【小祿站 AEON 購物資訊】位於單軌電車小祿站旁，有大型超市與各式店鋪，適合最後採買。",
        links: [
          { label: "小祿站 AEON 資訊", url: "https://www.aeon-okinawa.com.tw/shop/aeon-naha/", icon: "shopping" },
          { label: "波上宮停車場導航", url: "https://www.google.com/maps/search/?api=1&query=波上宮+停車場", icon: "map" }
        ]
      },
      { 
        id: '5-2', time: "12:00", type: "food", title: "午餐：豬肉蛋飯糰", detail: "機場人氣美食", address: "那霸機場", 
        content: "沖繩必吃的豬肉蛋飯糰，機場店雖然常排隊但值得一試。\n\n【機場人氣 10 間商店/美食】\n1. Pork Tamago Onigiri\n2. 琉球村\n3. 壽司 築地銀章魚燒\n4. 麥當勞 (沖繩限定口味)\n5. 沖繩蕎麥麵 志貴\n6. Blue Seal\n7. 伴手禮店 Coralway\n8. 驚安殿堂 (機場店)\n9. Royce' 櫃檯\n10. 御菓子御殿",
        links: [
          { label: "飯糰店導航", url: "https://www.google.com/maps/search/?api=1&query=Pork+Tamago+Onigiri+那霸機場店", icon: "map" },
          { label: "機場商店地圖", url: "https://www.naha-airport.co.jp/zh-hant/shop_restaurant/", icon: "map" }
        ]
      },
      { 
        id: '5-3', time: "12:30", type: "transport", title: "前往機場候機", detail: "搭乘星宇 JX871", address: "那霸機場", 
        content: "搭乘星宇航空 JX871 班機返家。請預留充足時間辦理退稅與登機手續。\n\n【2025 機場必買 10 樣伴手禮】\n1. Royce' 黑糖巧克力: 沖繩限定，鹹甜交織。\n2. 紅芋塔: 經典 100% 沖繩產紅芋。\n3. 雪鹽金楚糕: 宮古島雪鹽，酥脆順口。\n4. 石垣島辣油: 廚房必備，香氣濃郁。\n5. 泡盛辣椒油: 獨特酒香，麵食搭擋。\n6. 黑糖薯條: 酥脆薯條裹上濃郁黑糖。\n7. 扶桑花茶: 清爽解膩的特色茶飲。\n8. 紅芋起司塔: 現場烘焙的華麗邂逅。\n9. 琉球玻璃: 精緻的手工藝品選擇。\n10. 苦瓜乾: 獨特苦味，極佳下酒菜。",
        links: [
          { label: "伴手禮清單詳解", url: "https://example.com/okinawa-souvenir-2025", icon: "shopping" }
        ]
      },
      { id: '5-4', time: "18:00", type: "transport", title: "返家", detail: "平安回家", content: "結束愉快的 5 天 4 夜沖繩之旅。", noModal: true }
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
            <span className="text-[10px] text-morandi-text-muted tracking-[0.3em] uppercase">Family Adventure</span>
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
    <div className="space-y-0 pb-10">
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
      <div className="flex items-center gap-6 px-4 pt-0 pb-4">
        {/* Left: Vertical Day Label */}
        <div 
          style={{ ...fontStyleSerif, writingMode: 'vertical-rl' }} 
          className="text-gray-400 text-xl font-bold tracking-[0.5em] py-2"
        >
          {dayLabel}
        </div>
        {/* Right: 3:2 Photo Frame (Sharp Edges) */}
        <div className="flex-1 aspect-[3/2] rounded-none overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-black/5 bg-gray-100">
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

      {/* Weather Section - Refactored for Horizontal Scroll & Header */}
      <div className="py-2 mb-10">
        <div className="px-6 mb-4 flex justify-between items-center">
          <span style={fontStyleSerif} className="text-[10px] font-bold text-morandi-text-muted uppercase tracking-[0.2em]">未來 24 小時預報</span>
          <button 
            onClick={() => window.open('https://weathernews.jp/onebox/tenki/okinawa/47201/')}
            className="text-morandi-primary hover:text-morandi-primary-light transition-colors"
          >
            <CloudSun size={18} />
          </button>
        </div>
        {/* Data source: weathernews.jp */}
        <div className="flex overflow-x-auto px-6 py-1 hide-scrollbar snap-x gap-8">
          {weatherForecast.map((w: any, i: number) => (
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
              className="flex flex-col items-center gap-2 snap-start active:scale-95 transition-all group shrink-0 min-w-[50px]"
            >
              <span style={fontStyleSerif} className="text-[10px] font-bold text-gray-400 group-hover:text-morandi-blue transition-colors uppercase tracking-widest">
                {i === 0 ? "現在" : w.time}
              </span>
              <div className="flex items-center justify-center py-0 group-hover:scale-110 transition-transform">
                {getWeatherIcon(w.condition)}
              </div>
              <span style={fontStyleSerif} className="text-lg font-bold text-text-main group-hover:text-morandi-blue transition-colors">{w.temp}°</span>
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-200/40 mx-2" />

      <div className="relative px-2 pt-0">
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
                  className={`relative flex items-start gap-8 py-1.5 transition-all ${isNoModal ? 'cursor-default' : 'cursor-pointer group'}`}
                >
                  {/* Active Highlight Box */}
                  {!isNoModal && (
                    <div className="absolute inset-0 -mx-3 bg-white/60 border border-morandi-primary/10 rounded-2xl opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-all shadow-sm z-0" />
                  )}

                  {/* Time Column */}
                  <div className="w-14 text-right pt-0.5 relative z-10">
                    <span style={fontStyleSerif} className={`text-lg font-bold transition-colors ${isNoModal ? 'text-morandi-text/40' : 'text-morandi-text group-active:text-morandi-primary'}`}>
                      {item.hideTime ? "" : item.time}
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

                      <h4 style={fontStyleSerif} className={`font-bold text-lg transition-colors mb-0.5 whitespace-pre-wrap ${isNoModal ? 'text-morandi-text/50' : 'text-morandi-text group-active:text-morandi-primary'}`}>
                        {item.title}
                      </h4>

                      <div className="flex items-center gap-3">
                        <p className={`text-xs leading-relaxed line-clamp-1 opacity-80 ${isNoModal ? 'text-morandi-text-muted/50' : 'text-morandi-text-muted'}`}>
                          {item.detail}
                        </p>
                        {/* QuickLinks - Moved to Detail Line */}
                        {item.quickLinks && (
                          <div className="flex items-center gap-1 shrink-0">
                            {item.quickLinks.map((ql: any, idx: number) => (
                              <button 
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(ql.url);
                                }}
                                className="text-morandi-primary hover:text-morandi-primary-light transition-colors p-0.5"
                                title={ql.label}
                              >
                                <Link size={12} />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
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
  const getLinkIcon = (iconName: string) => {
    switch (iconName) {
      case 'map': return <MapPin size={20} />;
      case 'link': return <ExternalLink size={20} />;
      case 'ticket': return <Ticket size={20} />;
      case 'image': return <ImageIcon size={20} />;
      case 'shopping': return <Utensils size={20} />;
      case 'clock': return <Clock size={20} />;
      case 'info': return <Info size={20} />;
      default: return <Link size={20} />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/30 backdrop-blur-[2px] p-4">
      <motion.div 
        initial={{ y: '100%' }} 
        animate={{ y: 0 }} 
        exit={{ y: '100%' }} 
        className="w-full max-w-[480px] bg-white/90 backdrop-blur-2xl rounded-t-[40px] shadow-2xl relative max-h-[90vh] overflow-y-auto hide-scrollbar border-t border-x border-white/50 flex flex-col"
      >
        {/* Sticky Header with Close Button */}
        <div className="sticky top-0 z-30 px-8 pt-8 pb-4 bg-white/60 backdrop-blur-md flex justify-between items-start">
          <div className="flex flex-col items-start gap-1">
            {TYPE_CONFIG[item.type] && (
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500/60 uppercase tracking-widest">
                {TYPE_CONFIG[item.type].icon}
                <span>{TYPE_CONFIG[item.type].label}</span>
              </div>
            )}
            <h2 className="text-2xl font-bold text-text-main leading-tight text-left whitespace-pre-wrap">{item.title}</h2>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-full bg-morandi-sand/80 flex items-center justify-center text-text-main shadow-sm active:scale-90 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-5 pb-12 space-y-8">
          <div className="bg-morandi-sand/50 p-6 rounded-[32px] space-y-6 text-xl">
            <div className="flex items-center gap-4"><MapPin size={22} className="text-morandi-blue" /><span>{item.address || "詳見地圖"}</span></div>
            <div className="flex items-center gap-4"><Clock size={22} className="text-morandi-blue" /><span>{item.time}</span></div>
          </div>

          <div className="bg-white border border-morandi-sand rounded-[32px] shadow-sm overflow-hidden">
            {/* Hotel Official Site at the very top if it exists */}
            {item.hotelDetails && (
              <div className="p-5 pb-0">
                <button 
                  onClick={() => window.open(item.hotelDetails.officialSite)}
                  className="w-full py-4 px-5 bg-morandi-primary/5 border border-morandi-primary/10 rounded-2xl flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4 text-morandi-primary">
                    <ExternalLink size={22} />
                    <span className="text-xl font-bold">飯店官網</span>
                  </div>
                  <ChevronRight size={20} className="opacity-40 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            <div className="p-5 text-xl leading-relaxed text-text-main whitespace-pre-wrap">
              {item.content}
            </div>

            {item.hotelDetails?.breakfastRemarks && (
              <div className="px-5 pb-8 space-y-3">
                <div className="flex items-center gap-3 text-morandi-primary">
                  <Info size={20} />
                  <span className="text-base font-bold uppercase tracking-widest">備註</span>
                </div>
                <div className="text-lg leading-relaxed text-text-main bg-morandi-primary/5 p-4 rounded-xl border border-morandi-primary/10">
                  {item.hotelDetails.breakfastRemarks}
                </div>
              </div>
            )}

            {item.officialSite && (
              <div className="px-5 pb-5">
                <button 
                  onClick={() => window.open(item.officialSite)}
                  className="w-full py-4 px-5 bg-morandi-primary/5 border border-morandi-primary/10 rounded-2xl flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4 text-morandi-primary">
                    <ExternalLink size={22} />
                    <span className="text-xl font-bold">國際通介紹</span>
                  </div>
                  <ChevronRight size={20} className="opacity-40 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
            
            {item.otsInfo && (
              <>
                <div className="px-5">
                  <hr className="border-morandi-sand/30" />
                </div>
                <div className="p-5 pt-6 space-y-6">
                  <div className="flex items-center gap-3">
                    <h3 style={fontStyleSerif} className="text-2xl font-bold text-morandi-text">{item.otsInfo.title}</h3>
                    <button 
                      onClick={() => window.open(item.otsInfo.link)}
                      className="text-morandi-primary hover:text-morandi-primary-light transition-colors p-1"
                    >
                      <ExternalLink size={20} />
                    </button>
                  </div>
                  <div className="rounded-none overflow-hidden border-y border-morandi-sand/20 -mx-5">
                    <img 
                      src={item.otsInfo.mapImage} 
                      alt="OTS Map" 
                      className="w-full h-auto" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                  <div style={fontStyleSerif} className="text-lg leading-relaxed text-text-main py-4">
                    {item.otsInfo.guide}
                  </div>
                </div>
              </>
            )}

            {item.hotelDetails && (
              <>
                <div className="px-5">
                  <hr className="border-morandi-sand/30" />
                </div>
                <div className="p-5 pt-6 space-y-8">
                  {/* Routes */}
                  <div className="space-y-6">
                    <h3 style={fontStyleSerif} className="text-lg font-bold text-morandi-text-muted uppercase tracking-widest flex items-center gap-3">
                      <Navigation size={20} /> 路線導覽
                    </h3>
                    <div className="space-y-4">
                      {item.hotelDetails.routes.map((route: any, idx: number) => (
                        <div key={idx} className="bg-morandi-sand/20 p-5 rounded-[24px] space-y-3">
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-xl font-bold text-morandi-text">{route.label}</p>
                            <button 
                              onClick={() => window.open(route.url)}
                              className="flex items-center gap-2 px-4 py-2 bg-white border border-morandi-primary/20 rounded-xl text-sm font-bold text-morandi-primary shadow-sm active:scale-95 transition-all shrink-0"
                            >
                              <MapPin size={16} /> 路線
                            </button>
                          </div>
                          <p className="text-lg text-morandi-text-muted leading-relaxed w-full">{route.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="px-4">
                    <hr className="border-morandi-sand/20" />
                  </div>

                  {/* Shopping */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 style={fontStyleSerif} className="text-lg font-bold text-morandi-text uppercase tracking-widest flex items-center gap-3">
                        <Utensils size={20} className="text-morandi-primary" /> {item.hotelDetails.shopping.name}
                      </h3>
                      <button 
                        onClick={() => window.open(item.hotelDetails.shopping.url)}
                        className="flex items-center gap-2 px-4 py-2 bg-morandi-primary text-white rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-all"
                      >
                        <ExternalLink size={16} /> 官網
                      </button>
                    </div>
                    <div className="bg-morandi-sand/20 p-5 rounded-[24px] space-y-4">
                      <div className="flex items-center gap-3 text-base text-morandi-text-muted">
                        <Clock size={18} />
                        <span>營業時間：{item.hotelDetails.shopping.hours}</span>
                      </div>
                      <div className="space-y-3">
                        {item.hotelDetails.shopping.floors.map((floor: string, idx: number) => (
                          <div key={idx} className="flex gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-morandi-primary mt-2 shrink-0" />
                            <p className="text-lg text-morandi-text leading-relaxed">{floor}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {item.top10 && (
              <>
                <div className="px-5">
                  <hr className="border-morandi-sand/30" />
                </div>
                <div className="p-5 pt-6 space-y-6">
                  <h3 style={fontStyleSerif} className="text-lg font-bold text-morandi-text uppercase tracking-widest flex items-center gap-3">
                    <Star size={20} className="text-morandi-primary" /> {item.top10.title}
                  </h3>
                  <div className="space-y-4">
                    {item.top10.items.map((t: any, idx: number) => (
                      <div key={idx} className="bg-morandi-sand/20 p-5 rounded-[24px] space-y-3">
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-lg font-bold text-morandi-text">{t.name}</p>
                          <button 
                            onClick={() => window.open(t.url)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-morandi-primary/20 rounded-xl text-sm font-bold text-morandi-primary shadow-sm active:scale-95 transition-all shrink-0"
                          >
                            <Navigation size={16} /> 路線
                          </button>
                        </div>
                        <p className="text-base text-morandi-text-muted leading-relaxed w-full">{t.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {item.remarks && (
              <>
                <div className="px-5">
                  <hr className="border-morandi-sand/30" />
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-3 text-morandi-primary">
                    <Info size={20} />
                    <span className="text-base font-bold uppercase tracking-widest">備註</span>
                  </div>
                  <div className="text-lg leading-relaxed text-text-main">
                    {item.remarks}
                  </div>
                </div>
              </>
            )}
          </div>

          {item.links && item.links.length > 0 && (
            <div className="grid grid-cols-1 gap-3">
              {item.links.map((link: any, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => window.open(link.url)}
                  className="w-full py-5 px-5 bg-white border border-morandi-blue/20 text-morandi-blue rounded-2xl font-bold text-xl flex items-center justify-between gap-4 shadow-sm active:scale-[0.98] transition-all group"
                >
                  <div className="flex items-center gap-4">
                    {getLinkIcon(link.icon)}
                    <span>{link.label}</span>
                  </div>
                  <ChevronRight size={20} className="opacity-40 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          )}

          {!item.noNav && !item.top10 && (
            <button onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address || item.title)}`)} className="w-full py-5 bg-morandi-blue text-white rounded-2xl font-bold tracking-[0.4em] flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-all">
              <Navigation size={20} /> 開啟導航
            </button>
          )}
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
              <p className="text-sm text-morandi-text-muted">尚無支出紀錄</p>
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
            <p className="text-[10px] text-center text-morandi-text-muted mt-2">點擊開啟官方優惠券頁面，結帳時出示即可。</p>
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
