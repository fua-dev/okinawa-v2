/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Wallet, ListCheck, Info, MapPin, 
  CloudSun, Plus, Trash2, ChevronRight, Navigation, X, 
  Image as ImageIcon, Smartphone, Users, CheckCircle2, Circle, Clock, Ticket,
  ExternalLink, Sun, Cloud, CloudRain, Utensils, Plane, Car, Upload, Star,
  LayoutGrid, StretchHorizontal, ChevronLeft, ChevronRight as ChevronRightIcon,
  PhoneCall, PlusCircle, Link, ChevronDown, Map, Copy, Check
} from 'lucide-react';

const fontStyleSerif = {
  fontFamily: "'Noto Serif TC', serif",
};

const fontStyleSans = {
  fontFamily: "'Noto Sans TC', sans-serif",
};

const getGoogleDriveDirectLink = (url: string): string => {
  if (!url) return "";
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  return url;
};

const TYPE_CONFIG: Record<string, { icon: any, label: string, color: string }> = {
  flight: { icon: <Plane size={12} />, label: "航班", color: "#B5B2A6" },
  transport: { icon: <Car size={12} />, label: "交通", color: "#B5B2A6" },
  stay: { icon: <MapPin size={12} />, label: "住宿", color: "#9FBCC0" },
  food: { icon: <Utensils size={12} />, label: "美食", color: "#C2A3A3" },
  spot: { icon: <MapPin size={12} />, label: "景點", color: "#A8BCA1" }
};

// --- Data ---
const ITINERARY_DATA = [
  { 
    day: 1, date: "2026-07-13", week: "MON", 
    items: [
      { 
        id: '1-1', time: "09:00", type: "transport", title: "桃園機場第一航廈會合", detail: "星宇航空櫃檯集合", address: "桃園市大園區航站南路15號", 
        content: "大家早安！我們即將展開期待已久的沖繩之旅。請大家再次確認護照、駕照日文譯本以及最重要的心情都帶齊了嗎？第一站我們先在星宇櫃檯集合辦理登機。\n\n---\n\n媽媽 高鐵嘉義站07：19－桃園站08：25\n世睿 高鐵嘉義站07：19－桃園站08：25\n姊姊 台北車站搭乘機捷前往", 
        aboutTitle: "集合說明",
        quickLinks: [
          { label: "機捷時刻表", url: "https://www.tymetro.com.tw/tymetro-new/tw/_pages/travel-guide/timetable.php" }
        ],
        noNav: true
      },
      { 
        id: '1-1-1', time: "12:00", type: "flight", title: "啟程：星宇航空 JX870", detail: "【飛行時間】\n約1小時40分，預計14:40抵達那霸機場", address: "桃園機場 -> 那霸機場", 
        content: "搭乘星宇航空 JX870 班機前往那霸。預計 14:40 抵達沖繩。",
        noModal: true
      },
      { 
        id: '1-2', time: "15:20", type: "transport", title: "抵達那霸機場&租車", detail: "分頭行動/沖繩行腳租車", address: "〒901-0223 沖繩縣豐見城市翁長537-1", 
        content: "【接駁指引】\n取行李並出關後，Line通知工作人員即將前往接駁點。\n出境大廳後往外走到國內線1樓大廳外，14C號接駁處。\n到達後，再次通知工作人員。\n\n【注意事項】\n1. 攜帶護照、台灣駕照正本、日文譯本。\n2. 取車時請錄影檢查車身外觀並確認保險內容。\n3. 行腳租車地址：〒901-0223 沖繩縣豐見城市翁長537-1",
        otsInfo: {
          title: "沖繩行腳租車",
          link: "https://footprint-rentacar.com/tw/airport-shuttle-car-rental-route/",
          mapImage: "https://drive.google.com/file/d/1FXfhwzzHykeY85guAfZitIl3lJZIcsL8/view?usp=sharing"
        }
      },
      { 
        id: '1-3', time: "16:00", type: "stay", title: "那霸歌町大和Roynet飯店PREMIER", detail: "Check-in 放置行李", address: "那霸市安里1-1-1", 
        content: "飯店位於那霸新都心，地理位置極佳。對面就有百貨公司，周邊購物與餐飲選擇非常豐富。",
        hotelDetails: {
          officialSite: "https://www.daiwaroynet.jp/naha-omoromachi-premier/",
          routes: [
            { label: "Omoromachi 站步行", desc: "從單軌電車站步行約 5 分鐘即可抵達。", url: "https://www.google.com/maps/dir/?api=1&origin=Omoromachi+Station&destination=Daiwa+Roynet+Hotel+Naha-Omoromachi+PREMIER" },
            { label: "沖繩行腳租車地點", desc: "從沖繩行腳租車地點開車約20分鐘抵達", url: "https://maps.app.goo.gl/LgH52MrqRWyeCEWAA" }
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
          title: "推薦商店/小吃",
          items: [
            { name: "淳久堂書店 (那霸店)", desc: "沖繩規模最大的書店。1~3樓是書店，4樓是大創，地下1樓則是扭蛋玩具區。", url: "https://www.google.com/maps/search/?api=1&query=淳久堂書店+那霸店" },
            { name: "唐吉訶德 驚安殿堂 (國際通店)", desc: "24小時營業的大型連鎖折扣店。是回程前一次買齊所有伴手禮與生活用品的最佳去處。", url: "https://maps.app.goo.gl/CzLUuwSvfESf65wn9" },
            { name: "鹽屋 (國際通店)", desc: "全日本種類最齊全的鹽專賣店。除了可以試吃來自各地的特色海鹽，最推薦嘗試撒上特製鹽粉的雪鹽霜淇淋，鹹甜交織的獨特口感令人難忘。", url: "https://www.google.com/maps/search/?api=1&query=鹽屋+國際通店" },
            { name: "御菓子御殿", desc: "著名的紅芋塔創始店，建築外觀仿照首里城設計，極具氣勢。店內提供各式精緻的沖繩傳統糕點，口感細膩且甜度適中，深受長輩喜愛。", url: "https://www.google.com/maps/search/?api=1&query=御菓子御殿+國際通松尾店" },
            { name: "Calbee+", desc: "知名零食品牌的現炸體驗店。您可以品嚐到剛出爐、熱騰騰的現炸薯條與沖繩限定口味零食，香脆可口，是逛街途中補充體力的絕佳選擇。", url: "https://www.google.com/maps/search/?api=1&query=Calbee+Plus+Okinawa" },
            { name: "Blue Seal 冰淇淋", desc: "沖繩最具代表性的冰淇淋品牌。口味融合了美式風格與在地特色，如紅芋、鹽屋鹽等。口感綿密香濃，在炎熱的午後享用一份，倍感清涼舒爽。", url: "https://www.google.com/maps/search/?api=1&query=Blue+Seal+國際通" },
            { name: "Jef那霸店", desc: "特製苦瓜圈（類似洋蔥圈）及苦瓜漢堡吃起來微甜很清爽。", url: "https://maps.app.goo.gl/xhrchg1Y17FD85qN9" },
            { name: "福助玉子燒", desc: "福助玉子燒最有名的是7公分的超厚玉子燒，偏鹹的口味有柴魚的香氣。使用自助機點餐，店門口前有擺放椅子，可以直接在店門口前享用。", url: "https://maps.app.goo.gl/ivQSQqwtw4hUhPjw9" },
            { name: "林檎堂Ringodou", desc: "販售各種口味的蘋果糖葫蘆，價格從650~850JPY，看評價蘋果堂有點偏硬，有興趣可以吃吃看。", url: "https://maps.app.goo.gl/STgCk95gNARVz8Bn9" }
          ]
        }
      },
      { 
        id: '1-5', time: "17:30", type: "food", title: "國際通晚餐推薦", detail: "可分隊用餐", address: "那霸市國際通", 
        content: "國際通周邊餐廳選擇眾多，可依喜好分隊行動。",
        hideTime: true,
        top10: {
          title: "國際通晚餐 參考清單",
          items: [
            { name: "暖暮拉麵 (那霸牧志店)", desc: "曾榮獲九州拉麵票選第一名，是國際通的人氣名店。湯頭濃郁卻不膩口，麵條Q彈有勁，非常適合喜愛道地日本拉麵的長輩享用。", url: "https://www.google.com/maps/search/?api=1&query=暖暮拉麵+那霸牧志店" },
            { name: "琉球新麵 通堂", desc: "以獨特的男人麵（豚骨）與女人麵（鹽味）聞名。湯頭層次分明，配料豐富，店內環境溫馨，是體驗沖繩在地麵食文化的絕佳選擇。", url: "https://www.google.com/maps/search/?api=1&query=琉球新麵+通堂+寄宮店" },
            { name: "ゆうなんぎい (Yunangi)", desc: "深受在地人喜愛的沖繩家庭料理老店。招牌東坡肉入口即化，苦瓜雜炒清脆爽口，每一道菜都充滿了溫暖的家鄉味，非常適合家庭聚餐。", url: "https://www.google.com/maps/search/?api=1&query=ゆうなんぎい" },
            { name: "沖繩麵 Eibun", desc: "充滿創意的超人氣沖繩麵店。湯頭清甜且不油膩，麵條口感極佳，並提供多種創新口味，讓傳統的沖繩麵展現出令人驚喜的現代風味。", url: "https://www.google.com/maps/search/?api=1&query=Okinawa+Soba+Eibun" },
            { name: "Angama (あんがま)", desc: "在充滿傳統氛圍的環境中享用道地沖繩料理。用餐時還能欣賞精彩的傳統表演，讓您在品嚐美食的同時，也能深度感受沖繩的文化魅力。", url: "https://www.google.com/maps/search/?api=1&query=あんがま+國際通" },
            { name: "國際通屋台村", desc: "匯集了多家各具特色的熟食小攤，氛圍熱鬧非凡。您可以一次品嚐到多種沖繩在地小吃，非常適合想要體驗當地夜生活與熱鬧氣氛的遊客。", url: "https://www.google.com/maps/search/?api=1&query=國際通屋台村" },
            { name: "嘉手納蕎麥麵", desc: "專注於傳統沖繩麵的製作，口味簡單而純粹。湯頭鮮美，麵條紮實，展現出最道地的沖繩風味，是喜愛傳統美食長輩的不二之選。", url: "https://www.google.com/maps/search/?api=1&query=嘉手納蕎麥麵" },
            { name: "居酒屋 祭囃子", desc: "店內有現場三線琴演奏，營造出濃厚的琉球風情。提供豐富的熟食沖繩料理，讓您在悠揚的樂聲中，享受一段輕鬆愉快的晚餐時光。", url: "https://www.google.com/maps/search/?api=1&query=居酒屋+祭囃子" },
            { name: "Gusto (ガスト) 那霸國際通店", desc: "知名的連鎖家庭餐廳，餐點選擇極其多樣化且價格實惠。店內空間寬敞，對兒童與長輩非常友善，是全家大小輕鬆用餐的理想場所。", url: "https://www.google.com/maps/search/?api=1&query=Gusto+那霸國際通店" },
            { name: "琉球茶房 (Ashibiuna)", desc: "位於古色古香的日式建築內，環境優雅寧靜。提供精緻的沖繩熟食定食，讓您在充滿禪意的庭園景觀中，細細品味高品質的在地料理。", url: "https://www.google.com/maps/search/?api=1&query=琉球茶房+Ashibiuna" }
          ]
        }
      }
    ]
  },
  { 
    day: 2, date: "2026-07-14", week: "TUE", 
    items: [
      { id: '2-0', time: "08:00", type: "food", title: "早餐", detail: "", content: "開啟活力的一天。", noModal: true },
      { 
        id: '2-2', time: "09:30", type: "spot", title: "古宇利島", detail: "跨海大橋美景", address: "今歸仁村古宇利", 
        topImage: "https://visitokinawajapan.com/wp-content/themes/visit-okinawa_multi-language/lang/zh-hant/assets/img/destinations/okinawa-main-island/northern-okinawa-main-island/kouri-island/de33_03_kouri-ocean-tower-view.webp",
        content: "古宇利島位於沖繩本島北部，以絕美的「古宇利大橋」聞名。這座橋全長約 1960 公尺，橫跨在清澈的「古宇利藍」海面上，是家族旅行中不可錯過的視覺饗宴。\n\n島上的心形岩（Heart Rock）是必看景點，兩座心形礁石矗立在海中，展現大自然的鬼斧神工。來到這裡，您可以漫步在細軟的沙灘上，感受壯闊的海景與徐徐海風，享受遠離塵囂的寧靜時光。\n\n島上的古宇利海洋塔更能讓您從高處俯瞰整座大橋與周邊海域的絕美全景，非常適合全家大小一同登高望遠，留下美好的旅遊回憶。",
        links: [
          { label: "飯店至古宇利導航", url: "https://www.google.com/maps/dir/?api=1&origin=Daiwa+Roynet+Hotel+Naha-Omoromachi+PREMIER&destination=古宇利島", icon: "map" }
        ]
      },
      { 
        id: '2-3', time: "12:00", type: "food", title: "午餐：岸本食堂", detail: "其他備案午餐", address: "本部町伊野波350-1", 
        content: "傳承多年的沖繩麵名店，堅持使用傳統木灰水製麵，口感獨特且香氣十足。簡單的配料卻能展現出深厚的料理功底，是許多老饕心中的第一名。",
        top10: {
          title: "其他備案午餐",
          items: [
            { name: "百年古家 大家", desc: "以著名的阿古豬料理聞名，餐廳位於擁有百年歷史的古宅內，環境優美且充滿歷史感。在潺潺水聲中享用精緻美食，是極致的視覺與味覺饗宴。", url: "https://www.google.com/maps/search/?api=1&query=百年古家+大家" },
            { name: "幸ちゃんそば", desc: "深受在地人喜愛的沖繩麵店。湯頭清甜不油膩，麵條口感Q彈紮實，配上滷得入味的軟骨肉，每一口都能感受到最純粹的沖繩在地美味。", url: "https://www.google.com/maps/search/?api=1&query=幸ちゃんそば" },
            { name: "名護漁港食堂", desc: "由漁港直營的食堂，保證食材的新鮮度。提供份量十足的炸魚定食與各式海鮮料理，價格實惠且口味地道，是體驗漁村飲食文化的最佳去處。", url: "https://www.google.com/maps/search/?api=1&query=名護漁港食堂" },
            { name: "Captain Kangaroo", desc: "被譽為沖繩最好吃的漢堡店。漢堡份量驚人，肉排鮮嫩多汁，搭配特製醬料與酥脆麵包，每一口都充滿驚喜，是喜愛美式料理遊客的必訪之地。", url: "https://www.google.com/maps/search/?api=1&query=Captain+Kangaroo+名護" }
          ]
        },
        noNav: true
      },
      { 
        id: '2-4', time: "14:00", type: "spot", title: "美麗海水族館", detail: "觀賞黑潮之海", address: "本部町石川424", 
        topImage: "https://churaumi.okinawa/userfiles/images/program/list_005.jpg",
        content: "【1F 深海世界】探索神祕的深海生物與生態。\n【2F 黑潮之海】世界級巨大水槽，觀賞鯨鯊與鬼蝠魟。\n【3F 珊瑚礁之旅】展示豐富多樣的珊瑚礁生態。\n【4F 大海召喚】俯瞰黑潮之海，感受海洋的壯闊。\n\n【節目時刻表】\n- 黑潮之海餵食秀：15:00 / 17:00\n- 海豚秀 (Okichan)：10:30 / 11:30 / 13:00 / 15:00 / 17:00\n- 海豚餵食體驗\n①13：30～14：00 （受付終了13：50）\n②15：30～16：00 （受付終了15：50）",
        links: [
          { label: "節目時刻表官網", url: "https://churaumi.okinawa/program/", icon: "link" },
          { label: "水族館導航", url: "https://www.google.com/maps/search/?api=1&query=美麗海水族館", icon: "map" }
        ]
      },
      { 
        id: '2-5', time: "19:30", type: "food", title: "晚餐：阿古豬火鍋(北谷Chaabu)", detail: "", address: "沖縄県中頭郡北谷町桑江614-1", 
        bookingInfo: {
          dateTime: "7月14日(火) 19:30～",
          number: "VGUCF2TSNW"
        },
        content: "北谷ダイニング ちゃぁぶ～\n\n享用美味的阿古豬火鍋，為美好的一天劃下完美句點。\n\n---\n\n【店家資訊】\n北谷ダイニング ちゃぁぶ～\n沖縄県中頭郡北谷町桑江614-1",
        links: [
          { label: "阿古豬火鍋 導航連結", url: "https://www.google.com/maps/search/?api=1&query=沖縄県中頭郡北谷町桑江614-1", icon: "map" }
        ],
        quickLinks: [
          { label: "導航", url: "https://www.google.com/maps/search/?api=1&query=沖縄県中頭郡北谷町桑江614-1" }
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
          { label: "體驗活動連結", url: "https://www.southeast-botanical.jp/tw/", icon: "link" },
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
        id: '3-3', time: "13:30", type: "spot", title: "沖繩兒童王國", detail: "動物園與神奇博物館", address: "沖繩市胡屋5-7-1", 
        content: "【神奇博物館】以「智慧、感性、創造」為主題，提供多樣化的互動科學與藝術體驗，讓孩子在玩樂中學習。\n\n【動物園區】展示琉球群島原生種及世界各地的珍稀動物，強調生態保育與自然教育，是近距離觀察動物的好地方。\n\n【里山體驗】模擬沖繩傳統農村環境，讓遊客體驗在地文化與自然共生的智慧，感受悠閒的田園氣氛。",
        links: [
          { label: "官網資訊", url: "https://www.okzm.jp/", icon: "link" },
          { label: "餵食體驗", url: "https://www.okzm.jp/experience/?content=feeding#feeding", icon: "ticket" },
          { label: "兒童王國導航", url: "https://www.google.com/maps/search/?api=1&query=沖繩兒童王國", icon: "map" }
        ]
      },
      { 
        id: '3-4', time: "17:30", type: "food", title: "晚餐：HAMA 壽司 沖繩登川店", detail: "平價迴轉壽司", address: "沖縄県沖縄市登川2-10-1", 
        content: "日本超人氣連鎖迴轉壽司店，提供豐富多樣、新鮮美味的壽司與各式副餐選擇。使用觸控螢幕點餐非常便利，非常適合全家大小一同享用。",
        links: [
          { label: "HAMA 壽司 沖繩登川店 導航", url: "https://www.google.com/maps/search/?api=1&query=はま寿司+沖縄登川店", icon: "map" }
        ]
      },
      { 
        id: '3-5', time: "備案", type: "spot", title: "普天滿宮", detail: "神祕的鐘乳石洞神社", address: "宜野灣市普天間1-27-10", 
        content: "普天滿宮是琉球八社之一，最特別的是其位於神社後方的鐘乳石洞穴，需向巫女申請方可進入參觀。\n\n【營業時間】09:30 - 18:00",
        links: [
          { label: "普天滿宮導航", url: "https://www.google.com/maps/search/?api=1&query=普天滿宮", icon: "map" }
        ]
      },
      { 
        id: '3-6', time: "備案", type: "spot", title: "沖宮神社", detail: "御守種類繁多的能量景點", address: "那霸市奧武山町44", 
        content: "沖宮是琉球八社之一，位於奧武山公園內。這裡以種類繁多且精緻 of 御守聞名，是許多遊客前來祈福與收集御守的首選之地。\n\n【營業時間】09:00 - 17:00",
        links: [
          { label: "沖宮神社導航", url: "https://www.google.com/maps/search/?api=1&query=沖宮", icon: "map" }
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
        content: "結合影像技術與空間設計的現代水族館，提供沉浸式的海洋體驗。提醒：建議先買餵食體驗券。\n\n【常綠之森】漫步在充滿綠意的空間，近距離觀察陸生動物與熱帶魚類，感受大自然的生機。\n\n【澄清之海】巨大的圓柱水槽與透明地板，讓您彷彿漫步在海面上，俯瞰繽紛的珊瑚礁生態。\n\n【時光之海】透過大型影像與音效，呈現海洋在不同時段的迷人姿態，帶來感官的震撼。\n\n【備註】時刻表以當日公布為主。", 
        links: [
          { label: "餵食項目", url: "https://kariyushi-aquarium.com/feeding/", icon: "clock" },
          { label: "樓層指南", url: "https://kariyushi-aquarium.com/floor/", icon: "map" },
          { label: "飯店至 DMM 導航", url: "https://www.google.com/maps/dir/?api=1&origin=Daiwa+Roynet+Hotel+Naha-Omoromachi+PREMIER&destination=DMM+Kariyushi+Aquarium", icon: "map" }
        ]
      },
      { 
        id: '4-2', time: "12:30", type: "spot", title: "普天滿宮", detail: "神祕的鐘乳石洞神社", address: "宜野灣市普天間1-27-10", 
        content: "普天滿宮是琉球八社之一，最特別的是其位於神社後方的鐘乳石洞穴，需向巫女申請方可進入參觀。\n\n【營業時間】09:30 - 18:00",
        links: [
          { label: "普天滿宮導航", url: "https://www.google.com/maps/search/?api=1&query=普天滿宮", icon: "map" }
        ]
      },
      { 
        id: '4-3', time: "13:00", type: "food", title: "午餐：永旺夢樂城(自理)", detail: "美食街與餐廳多樣選擇", address: "北中城村比嘉", 
        content: "永旺夢樂城內擁有多樣化的美食街與主題餐廳，提供沖繩在地料理、日式拉麵、壽司、西餐等多種選擇，方便大家自由挑選喜愛的午餐。",
        links: [
          { label: "美食指南", url: "https://tw.aeonmall.global/mall/okinawarycom/floorguide/", icon: "link" }
        ]
      },
      { 
        id: '4-4', time: "14:30", type: "spot", title: "購物：永旺夢樂城", detail: "營業時間 10:00 - 22:00", address: "北中城村比嘉", 
        content: "沖繩最大購物中心，可以先到遊客中心拿優惠券。\n\n【1F 人氣品牌】UNIQLO(1-2F)、GU、寶可夢中心、大創、3COINS、LOFT\n【2F 人氣品牌】mont-bell\n【3F 人氣品牌】ABC-MART、LOWRYS FARM、AEON STYLE(毛線パンドラ)\n【4F 人氣品牌】童裝apres les cours、童裝BREEZE、WEGO、扭蛋、三麗鷗商店、橡子共和國、玩具反斗城",
        links: [
          { label: "優惠券連結", url: "https://tw.aeonmall.global/mall/okinawarycom/coupons", icon: "ticket" },
          { label: "AEON Mall 導航", url: "https://www.google.com/maps/search/?api=1&query=AEON+Mall+Okinawa+Rycom", icon: "map" }
        ]
      },
      { 
        id: '4-5', time: "19:00", type: "food", title: "晚餐：燒肉五苑 古島站前店", detail: "超人氣燒肉吃到飽", address: "那霸市古島1丁目26-1", 
        content: "主打高 CP 值燒肉吃到飽，食材新鮮且空間寬敞，非常適合全家大小一同聚餐。店內提供多樣化的熟食、海鮮與非牛肉選項，讓不吃牛的長輩也能在此盡情享用豐富且高品質的美味佳餚。\n\n【營業時間】16:00 - 23:00",
        links: [
          { label: "燒肉五苑 古島站前店 導航", url: "https://www.google.com/maps/search/?api=1&query=焼肉五苑+古島駅前店", icon: "map" }
        ]
      }
    ]
  },
  { 
    day: 5, date: "2026-07-17", week: "FRI", 
    items: [
      { id: '5-0', time: "08:00", type: "food", title: "飯店早餐", detail: "最後一次享用早餐", content: "整理行李，準備退房。", noModal: true },
      { 
        id: '5-1', time: "08:30", type: "spot", title: "波上宮 & 最後採買", detail: "懸崖上的神社與購物", address: "那霸市若狹1-25-11", 
        content: "波上宮是琉球八社之首，建在懸崖之上，可俯瞰海灘景觀。參拜完後可前往周邊進行最後採買。\n\n---\n\n【小祿站 AEON】位於單軌電車站旁，重點樓層：1F 大創、2F SM2、3F 毛線店。周邊還有大國藥妝百元店，適合補貨。\n\n【Rainbow House】在地知名的手工藝品店，提供各式精緻的手作材料與成品。",
        links: [
          { label: "波上宮停車場導航", url: "https://www.google.com/maps/search/?api=1&query=波上宮+停車場", icon: "map" },
          { label: "小祿站 AEON 資訊", url: "https://www.aeon-okinawa.com.tw/shop/aeon-naha/", icon: "shopping" },
          { label: "Rainbow House 導航", url: "https://www.google.com/maps/search/?api=1&query=Rainbow+House+Okinawa", icon: "map" }
        ]
      },
      { 
        id: '5-2', time: "12:00", type: "food", title: "午餐：豬肉蛋飯糰", detail: "機場人氣美食", address: "那霸機場", 
        content: "沖繩必吃的豬肉蛋飯糰，機場店雖然常排隊但值得一試。\n\n【機場人氣 10 間商店/美食】\n1. Pork Tamago Onigiri\n2. 琉球村\n3. 壽司 築地銀章魚燒\n4. 麥當勞 (沖繩限定口味)\n5. 沖繩蕎麥麵 志貴\n6. Blue Seal\n7. 伴手禮店 Coralway\n8. 驚安殿堂 (機場店)\n9. Royce' 櫃檯\n10. 御菓子御殿",
        links: [
          { label: "飯糰店導航", url: "https://www.google.com/maps/search/?api=1&query=Pork+Tamago+Onigiri+那霸機場店", icon: "map" }
        ]
      },
      { 
        id: '5-3', time: "12:30", type: "transport", title: "前往機場候機", detail: "搭乘星宇 JX871", address: "那霸機場", 
        content: "搭乘星宇航空 JX871 班機返家。請預留充足時間辦理退稅與登機手續。\n\n【2025 機場必買 10 樣伴手禮】\n1. Royce' 黑糖巧克力: 沖繩限定，鹹甜交織。\n2. 紅芋塔: 經典 100% 沖繩產紅芋。\n3. 雪鹽金楚糕: 宮古島雪鹽，酥脆順口。\n4. 石垣島辣油: 廚房必備，香氣濃郁。\n5. 泡盛辣椒油: 獨特酒香，麵食搭擋。\n6. 黑糖薯條: 酥脆薯條裹上濃郁黑糖。\n7. 扶桑花茶: 清爽解膩的特色茶飲。\n8. 紅芋起司塔: 現場烘焙的華麗邂逅。\n9. 琉球玻璃: 精緻的手工藝品選擇。\n10. 苦瓜乾: 獨特苦味，極佳下酒菜。",
        links: [
          { label: "機場商店連結", url: "https://www.naha-airport.co.jp/zh-hant/spend/shop_and_restaurant/", icon: "shopping" }
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
        body { font-family: 'Noto Sans TC', sans-serif; background-color: #e9f2f7; }
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
              <div className="w-16 h-16 bg-morandi-bg rounded-full flex items-center justify-center mx-auto mb-6 text-morandi-primary"><Users size={32} /></div>
              <h3 className="text-2xl font-bold text-text-main mb-6">【 旅 遊 宣 言 】</h3>
              <div className="space-y-4 text-base text-text-main leading-relaxed">
                <p>「累了就休息，餓了就吃飯，想上廁所馬上說。」</p>
                <p>「每天一合照：留下 7 人的沖繩記憶。」</p>
                <p>「快樂出門，平安回家。」</p>
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
                        <p className={`text-xs leading-relaxed whitespace-pre-wrap opacity-80 ${isNoModal ? 'text-morandi-text-muted/50' : 'text-morandi-text-muted'}`}>
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
                  <h5 className="font-bold text-morandi-text text-xl">{item.title}</h5>
                  <span className="text-[10px] font-bold border border-morandi-primary/30 px-2 py-0.5 rounded-sm text-morandi-primary uppercase">Backup</span>
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

function SmartParagraph({ children, className = "", noBorder = false }: { children: ReactNode, className?: string, noBorder?: boolean, key?: any }) {
  const [isLong, setIsLong] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  // Check if content is a list (starts with numbers like "1." or bullet points like "-", "*", "•", "・" or "【")
  const isList = useMemo(() => {
    if (typeof children !== 'string') return false;
    // Match "1. ", "- ", "* ", "• ", "・ ", "【" at the start of the string or after a newline
    return /^\s*(\d+\.|[-*•・]|【)\s*/.test(children);
  }, [children]);

  useEffect(() => {
    const checkLines = () => {
      if (textRef.current) {
        const element = textRef.current;
        const style = window.getComputedStyle(element);
        const lineHeight = parseInt(style.lineHeight) || 21; // Fallback to 21px if line-height is normal
        const height = element.getBoundingClientRect().height;
        const lines = Math.round(height / lineHeight);
        // Only show vertical line if it's 4+ lines AND not a list AND noBorder is false
        setIsLong(lines >= 4 && !isList && !noBorder);
      }
    };

    // Initial check
    checkLines();
    
    // Check again after a short delay to ensure fonts are loaded and layout is stable
    const timer = setTimeout(checkLines, 100);
    
    window.addEventListener('resize', checkLines);
    return () => {
      window.removeEventListener('resize', checkLines);
      clearTimeout(timer);
    };
  }, [children, isList]);

  return (
    <div className={`${isLong ? 'border-l border-black/10 pl-4' : ''} py-1 ${className} transition-all duration-300`}>
      <div ref={textRef} className="text-[15px] leading-relaxed text-morandi-text whitespace-pre-wrap">
        {children}
      </div>
    </div>
  );
}

function GuideModal({ item, onClose }: any) {
  const [copiedBooking, setCopiedBooking] = useState(false);

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
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-[2px] p-4">
      <motion.div 
        initial={{ y: '100%' }} 
        animate={{ y: 0 }} 
        exit={{ y: '100%' }} 
        className="w-full max-w-[480px] bg-morandi-bg backdrop-blur-2xl rounded-t-[40px] shadow-2xl relative max-h-[90vh] overflow-y-auto hide-scrollbar border-t border-x border-white/30 flex flex-col"
      >
        {/* Sticky Header with Close Button */}
        <div className="sticky top-0 z-50 px-4 pt-8 pb-4 bg-morandi-bg flex justify-between items-start mb-8">
          <div className="flex flex-col gap-3 flex-1 pr-4">
            {TYPE_CONFIG[item.type] && (
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em]">
                <span 
                  className="px-2 py-0.5 border rounded-sm bg-white shadow-sm"
                  style={{ color: TYPE_CONFIG[item.type].color, borderColor: `${TYPE_CONFIG[item.type].color}50` }}
                >
                  {TYPE_CONFIG[item.type].label}
                </span>
                <div className="flex items-center gap-1 ml-1 text-morandi-text">
                  <Clock size={10} />
                  <span>{item.time}</span>
                </div>
              </div>
            )}
            <div 
              className="border-l-[6px] pl-4 py-1"
              style={{ borderLeftColor: TYPE_CONFIG[item.type]?.color || 'transparent' }}
            >
              <h2 className="text-2xl font-bold text-morandi-text leading-tight whitespace-pre-wrap mb-2">{item.title}</h2>
              {item.address && (
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address)}`)}
                  className="flex items-center gap-1.5 text-xs text-morandi-text/60 hover:underline text-left group"
                >
                  <MapPin size={12} className="shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
                  <span className="line-clamp-1">{item.address}</span>
                </button>
              )}
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-morandi-text shadow-sm active:scale-90 transition-all shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 pb-12 font-serif">
          <div className="bg-white/40 backdrop-blur-sm p-6 space-y-10">
            {item.topImage && (
              <div className="rounded-none overflow-hidden -mx-6 -mt-6 mb-10 shadow-sm">
                <img src={item.topImage} alt={item.title} className="w-full h-auto" referrerPolicy="no-referrer" />
              </div>
            )}

            <div className="space-y-10">
              {/* Hotel Specific Layout */}
              {item.hotelDetails ? (
                <>
                  {/* Layer 1: Official Site */}
                  <button 
                    onClick={() => window.open(item.hotelDetails.officialSite)}
                    className="w-full py-4 px-5 bg-white/20 border border-morandi-primary/20 rounded-none flex items-center justify-between group shadow-sm"
                  >
                    <div className="flex items-center gap-3 text-morandi-text">
                      <ExternalLink size={18} />
                      <span className="text-[14px] font-bold">飯店官網</span>
                    </div>
                    <ChevronRight size={18} className="opacity-40 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Layer 2: Intro */}
                  <div className="space-y-6 pt-2">
                    <div className="flex items-center gap-2 text-morandi-text/60">
                      <Info size={20} />
                      <span className="text-[18px] font-bold uppercase tracking-widest">{item.aboutTitle || "關於此處 (ABOUT)"}</span>
                    </div>
                    {item.content && item.content.split('\n\n').map((paragraph: string, pIdx: number) => {
                      if (paragraph.trim() === '---') {
                        return <div key={pIdx} className="w-full border-t border-morandi-primary/60 my-6" />;
                      }
                      return (
                        <SmartParagraph key={pIdx}>
                          {paragraph}
                        </SmartParagraph>
                      );
                    })}
                  </div>

                  {/* Layer 3: Remarks */}
                  {item.hotelDetails.breakfastRemarks && (
                    <div className="space-y-4 pt-2">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-morandi-text/60">
                          <Info size={20} />
                          <span className="text-[18px] font-bold uppercase tracking-widest">備註</span>
                        </div>
                        <SmartParagraph>
                          {item.hotelDetails.breakfastRemarks}
                        </SmartParagraph>
                      </div>
                    </div>
                  )}

                  {/* Layer 4: Routes */}
                  <div className="space-y-6 pt-2">
                    <h3 className="text-[18px] font-bold text-morandi-text/60 uppercase tracking-widest flex items-center gap-2">
                      <Navigation size={20} /> 路線導覽
                    </h3>
                    <div className="space-y-8">
                      {item.hotelDetails.routes.map((route: any, idx: number) => (
                        <div key={idx} className="space-y-3">
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-[15px] font-bold text-morandi-text">{route.label}</p>
                            <button 
                              onClick={() => window.open(route.url)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-white/20 border border-morandi-primary/30 rounded-none text-xs font-bold text-morandi-text shadow-sm active:scale-95 transition-all shrink-0"
                            >
                              <MapPin size={14} /> 路線
                            </button>
                          </div>
                          <div className="py-0.5">
                            <SmartParagraph className="!py-0" noBorder={true}>
                              {route.desc}
                            </SmartParagraph>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Layer 5: Shopping */}
                  <div className="space-y-6 pt-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[18px] font-bold text-morandi-text/60 uppercase tracking-widest flex items-center gap-2">
                        <Utensils size={20} /> {item.hotelDetails.shopping.name}
                      </h3>
                      <button 
                        onClick={() => window.open(item.hotelDetails.shopping.url)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-morandi-primary text-white rounded-none text-xs font-bold shadow-sm active:scale-95 transition-all"
                      >
                        <ExternalLink size={14} /> 官網
                      </button>
                    </div>
                    <div className="bg-white/10 p-5 border border-morandi-primary/10 rounded-none space-y-4">
                      <div className="flex items-center gap-2 text-sm text-morandi-text-muted">
                        <Clock size={16} />
                        <span>營業時間：{item.hotelDetails.shopping.hours}</span>
                      </div>
                      <div className="space-y-3">
                        {item.hotelDetails.shopping.floors.map((floor: string, idx: number) => (
                          <div key={idx} className="flex gap-3">
                            <div className="w-1 h-1 rounded-full bg-morandi-primary mt-2.5 shrink-0" />
                            <p className="text-[15px] text-morandi-text leading-relaxed">{floor}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Default Layout for non-hotel items */
                <div className="space-y-10">
                  {item.officialSite && (
                    <button 
                      onClick={() => window.open(item.officialSite)}
                      className="w-full py-4 px-5 bg-white/20 border border-morandi-primary/20 rounded-none flex items-center justify-between group shadow-sm"
                    >
                      <div className="flex items-center gap-3 text-morandi-text">
                        <ExternalLink size={18} />
                        <span className="text-[14px] font-bold">官方連結</span>
                      </div>
                      <ChevronRight size={18} className="opacity-40 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}

                  {item.id === '1-2' ? (
                    <>
                      {/* otsInfo section on top */}
                      {item.otsInfo && (
                        <div className="space-y-6 pt-2">
                          <div className="flex items-center gap-2 text-morandi-text/60">
                            <Info size={20} />
                            <h3 className="text-[18px] font-bold uppercase tracking-widest">{item.otsInfo.title}</h3>
                            <button 
                              onClick={() => window.open(item.otsInfo.link)}
                              className="text-morandi-primary hover:text-morandi-primary-light transition-colors p-1"
                            >
                              <ExternalLink size={16} />
                            </button>
                          </div>
                          <div className="rounded-none overflow-hidden border-y border-white/10 -mx-6 shadow-sm">
                            <img 
                              src={getGoogleDriveDirectLink(item.otsInfo.mapImage)} 
                              alt="OTS Map" 
                              className="w-full h-auto" 
                              referrerPolicy="no-referrer" 
                            />
                          </div>
                          {item.otsInfo.guide && (
                            <SmartParagraph noBorder={true}>
                              {item.otsInfo.guide}
                            </SmartParagraph>
                          )}
                        </div>
                      )}

                      {/* Content block below, with NO "關於此處 (ABOUT)" header */}
                      <div className="space-y-6 pt-2">
                        {item.content && item.content.split('\n\n').map((paragraph: string, pIdx: number) => {
                          if (paragraph.trim() === '---') {
                            return <div key={pIdx} className="w-full border-t border-morandi-primary/60 my-6" />;
                          }
                          return (
                            <SmartParagraph key={pIdx}>
                              {paragraph}
                            </SmartParagraph>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Default layout for other non-hotel items */}
                      <div className="space-y-6 pt-2">
                        <div className="flex items-center gap-2 text-morandi-text/60">
                          <Info size={20} />
                          <span className="text-[18px] font-bold uppercase tracking-widest">{item.aboutTitle || "關於此處 (ABOUT)"}</span>
                        </div>
                        {item.content && item.content.split('\n\n').map((paragraph: string, pIdx: number) => {
                          if (paragraph.trim() === '---') {
                            return <div key={pIdx} className="w-full border-t border-morandi-primary/60 my-6" />;
                          }
                          const isStoreInfo = paragraph.includes('【店家資訊】');
                          if (isStoreInfo) {
                            return (
                              <div key={pIdx} className="space-y-6">
                                {item.bookingInfo && (
                                  <div className="bg-white/50 border border-morandi-primary/20 rounded-[24px] p-5 space-y-4 shadow-sm backdrop-blur-sm">
                                    <div className="flex justify-between items-center pb-2 border-b border-morandi-primary/10">
                                      <span className="text-[13px] font-bold text-morandi-primary flex items-center gap-2">
                                        <Ticket size={16} />
                                        <span>預約資訊 (RESERVATION)</span>
                                      </span>
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          navigator.clipboard.writeText(item.bookingInfo.number);
                                          setCopiedBooking(true);
                                          setTimeout(() => setCopiedBooking(false), 2000);
                                        }}
                                        className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
                                          copiedBooking 
                                            ? 'bg-emerald-500 text-white' 
                                            : 'bg-morandi-primary/10 text-morandi-primary hover:bg-morandi-primary/20'
                                        }`}
                                      >
                                        {copiedBooking ? <Check size={10} /> : <Copy size={10} />}
                                        <span>{copiedBooking ? '已複製' : '複製代號'}</span>
                                      </button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3 text-xs text-morandi-text">
                                      <div className="flex items-start gap-2">
                                        <span className="font-bold text-morandi-text-muted/70 w-16 shrink-0">■ 予約日時</span>
                                        <span className="font-medium whitespace-pre-wrap">{item.bookingInfo.dateTime}</span>
                                      </div>
                                      <div className="flex items-start gap-2">
                                        <span className="font-bold text-morandi-text-muted/70 w-16 shrink-0">■ 予約番号</span>
                                        <span className="font-mono font-black text-morandi-primary tracking-wider bg-white/60 px-2.5 py-1 rounded-md border border-morandi-primary/10">{item.bookingInfo.number}</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          }
                          return (
                            <div key={pIdx} className="space-y-6">
                              <SmartParagraph>
                                {paragraph}
                              </SmartParagraph>
                            </div>
                          );
                        })}
                      </div>

                      {item.darumaExchange && (
                        <div className="space-y-6 pt-2">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-morandi-text/60">
                              <Ticket size={20} />
                              <span className="text-[18px] font-bold uppercase tracking-widest">{item.darumaExchange.title}</span>
                            </div>
                            <SmartParagraph>
                              {item.darumaExchange.desc}
                            </SmartParagraph>
                            <div className="w-1/4 rounded-none overflow-hidden shadow-sm">
                              <img src={item.darumaExchange.image} alt="Exchange" className="w-full h-auto" referrerPolicy="no-referrer" />
                            </div>
                          </div>
                        </div>
                      )}

                      {item.otsInfo && (
                        <div className="space-y-6 pt-2">
                          <div className="flex items-center gap-2 text-morandi-text/60">
                            <Info size={20} />
                            <h3 className="text-[18px] font-bold uppercase tracking-widest">{item.otsInfo.title}</h3>
                            <button 
                              onClick={() => window.open(item.otsInfo.link)}
                              className="text-morandi-primary hover:text-morandi-primary-light transition-colors p-1"
                            >
                              <ExternalLink size={16} />
                            </button>
                          </div>
                          <div className="rounded-none overflow-hidden border-y border-white/10 -mx-6 shadow-sm">
                            <img 
                              src={getGoogleDriveDirectLink(item.otsInfo.mapImage)} 
                              alt="OTS Map" 
                              className="w-full h-auto" 
                              referrerPolicy="no-referrer" 
                            />
                          </div>
                          {item.otsInfo.guide && (
                            <SmartParagraph noBorder={true}>
                              {item.otsInfo.guide}
                            </SmartParagraph>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {item.top10 && (
                    <div className="space-y-6 pt-2">
                      <h3 className="text-[18px] font-bold text-morandi-text/60 uppercase tracking-widest flex items-center gap-2">
                        <Star size={20} /> {item.top10.title}
                      </h3>
                      <div className="divide-y divide-morandi-primary/10">
                        {item.top10.items.map((t: any, idx: number) => {
                          const [isOpen, setIsOpen] = useState(false);
                          return (
                            <div key={idx} className="py-4">
                              <div 
                                className="flex items-center justify-between gap-4 cursor-pointer group"
                                onClick={() => setIsOpen(!isOpen)}
                              >
                                <p className="text-[15px] font-bold text-morandi-text group-hover:text-morandi-primary transition-colors">{t.name}</p>
                                <div className="flex items-center gap-3 shrink-0">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(t.url);
                                    }}
                                    className="p-2 text-morandi-text/40 hover:text-morandi-primary transition-colors"
                                  >
                                    <Navigation size={18} />
                                  </button>
                                  <ChevronDown 
                                    size={18} 
                                    className={`text-morandi-text/20 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                                  />
                                </div>
                              </div>
                              <AnimatePresence>
                                {isOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="pt-3">
                                      <SmartParagraph className="!py-0" noBorder={true}>
                                        {t.desc}
                                      </SmartParagraph>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {item.remarks && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2 text-morandi-text/60">
                        <Info size={20} />
                        <span className="text-[18px] font-bold uppercase tracking-widest">備註</span>
                      </div>
                      <SmartParagraph>
                        {item.remarks}
                      </SmartParagraph>
                    </div>
                  )}
                </div>
              )}
            </div>

            {item.links && item.links.length > 0 && (
              <div className="grid grid-cols-1 gap-3">
                {item.links.map((link: any, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => window.open(link.url)}
                    className="w-full py-4 px-5 bg-white/20 border border-morandi-primary/20 text-morandi-text rounded-none font-bold text-[13px] flex items-center justify-between gap-3 shadow-sm active:scale-[0.98] transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      {getLinkIcon(link.icon)}
                      <span>{link.label}</span>
                    </div>
                    <ChevronRight size={18} className="opacity-40 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            )}
          </div>
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
  const defaultPrepList = [
    { id: 'p1', text: '護照 🪪', done: false, category: 'carryOn' },
    { id: 'p2', text: '台灣駕照正本+日文譯本(世睿) 🚗', done: false, category: 'carryOn' },
    { id: 'p3', text: 'eSIM/漫遊 🌐', done: false, category: 'carryOn' },
    { id: 'p4', text: '日幣/信用卡 💴', done: false, category: 'carryOn' },
    { id: 'p5', text: '行動電源 🔋', done: false, category: 'carryOn' },
    { id: 'p6', text: '薄外套/小孩備用衣 🧥', done: false, category: 'carryOn' },
    { id: 'p12', text: '水壺 💧', done: false, category: 'carryOn' },
    { id: 'p7', text: '換洗衣物 & 睡衣 👕', done: false, category: 'checked' },
    { id: 'p8', text: '盥洗用品 & 保養品 🧴', done: false, category: 'checked' },
    { id: 'p9', text: '常用隨身藥品 💊', done: false, category: 'checked' },
    { id: 'p10', text: '雨傘/雨衣 (沖繩天氣多變) ☔', done: false, category: 'checked' },
    { id: 'p11', text: '太陽眼鏡 & 防曬乳 🕶️', done: false, category: 'checked' },
    { id: 'p13', text: '防蚊液 🦟', done: false, category: 'checked' },
    { id: 'p14', text: '泳衣 🩱', done: false, category: 'checked' },
    { id: 'p15', text: '充電線 🔌', done: false, category: 'checked' },
    { id: 'p16', text: '購物袋 🛍️', done: false, category: 'checked' }
  ];

  const [predefined, setPredefined] = useState<any[]>(() => {
    const saved = localStorage.getItem('okinawa_prep');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Smart auto-update: if the user doesn't have the newly specified "世睿" in their saved list,
        // automatically load the updated default list so they get the new carry-on items instantly.
        const hasLicenseTranslation = parsed.some((item: any) => item.text && item.text.includes('世睿'));
        if (!hasLicenseTranslation) {
          return defaultPrepList;
        }

        let updated = parsed.map((item: any) => {
          if (!item.category) {
            // Smart auto-categorization for existing user items during migration
            const isCheckedItem = /衣物|睡衣|鞋|襪|盥洗|保養|沐浴|洗髮|刷|膏|藥|傘|防曬|隱眼|剪刀|指甲/i.test(item.text);
            return { ...item, category: isCheckedItem ? 'checked' : 'carryOn' };
          }
          return item;
        });

        // Ensure newly requested items are added dynamically
        const newCarryOn = [
          { key: '水壺', text: '水壺 💧', category: 'carryOn', id: 'p12' }
        ];
        const newChecked = [
          { key: '防蚊液', text: '防蚊液 🦟', category: 'checked', id: 'p13' },
          { key: '泳衣', text: '泳衣 🩱', category: 'checked', id: 'p14' },
          { key: '充電線', text: '充電線 🔌', category: 'checked', id: 'p15' },
          { key: '購物袋', text: '購物袋 🛍️', category: 'checked', id: 'p16' }
        ];

        let hasChanges = false;
        newCarryOn.forEach(item => {
          if (!updated.some((r: any) => r.text && r.text.includes(item.key))) {
            updated.push({ id: item.id, text: item.text, done: false, category: item.category });
            hasChanges = true;
          }
        });
        newChecked.forEach(item => {
          if (!updated.some((r: any) => r.text && r.text.includes(item.key))) {
            updated.push({ id: item.id, text: item.text, done: false, category: item.category });
            hasChanges = true;
          }
        });

        if (hasChanges) {
          localStorage.setItem('okinawa_prep', JSON.stringify(updated));
          return updated;
        }

        return updated;
      } catch (e) {
        // Fallback to default if JSON parse fails
      }
    }
    return defaultPrepList;
  });

  const [shoppingItems, setShoppingItems] = useState<any[]>(() => {
    const saved = localStorage.getItem('okinawa_shop_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [carryOnInput, setCarryOnInput] = useState('');
  const [checkedInput, setCheckedInput] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [shopForm, setShopForm] = useState({ note: '', category: '藥妝', photo: '' });

  useEffect(() => { localStorage.setItem('okinawa_prep', JSON.stringify(predefined)); }, [predefined]);
  useEffect(() => { localStorage.setItem('okinawa_shop_v2', JSON.stringify(shoppingItems)); }, [shoppingItems]);

  const addPrep = (category: 'carryOn' | 'checked') => {
    const text = category === 'carryOn' ? carryOnInput : checkedInput;
    if (!text.trim()) return;
    setPredefined([...predefined, { id: Date.now().toString(), text: text.trim(), done: false, category }]);
    if (category === 'carryOn') {
      setCarryOnInput('');
    } else {
      setCheckedInput('');
    }
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

  const categories = ['藥妝', '食物', '伴手禮', '其他'];

  return (
    <div className="space-y-10 pb-20">
      {/* 行前準備 */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-lg font-bold text-morandi-text flex items-center gap-2">
            <ListCheck size={18} className="text-morandi-primary" /> 行前準備
          </h3>
          <button 
            onClick={() => {
              if (window.confirm('確定要將行李準備項目重置回預設項目嗎？')) {
                setPredefined(defaultPrepList);
              }
            }}
            className="text-xs font-bold text-morandi-primary/80 hover:text-morandi-primary bg-morandi-primary/5 hover:bg-morandi-primary/10 px-3 py-1.5 rounded-full transition-all active:scale-95"
          >
            重置預設項目
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 隨身行李 */}
          <div className="bg-white/40 rounded-[32px] p-5 sm:p-6 space-y-4 border border-white/60 flex flex-col h-full justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-morandi-primary/10">
                <span className="w-2.5 h-2.5 rounded-full bg-morandi-primary"></span>
                <span className="font-bold text-[15px] text-morandi-primary tracking-wider">隨身行李 Carry-on</span>
                <span className="text-xs text-morandi-accent">({predefined.filter(i => i.category === 'carryOn' && i.done).length}/{predefined.filter(i => i.category === 'carryOn').length})</span>
              </div>
              
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {predefined.filter(i => i.category === 'carryOn').length === 0 ? (
                  <p className="text-xs text-morandi-accent/60 py-4 text-center">無項目，請在下方新增</p>
                ) : (
                  predefined.filter(i => i.category === 'carryOn').map(item => (
                    <div key={item.id} className="flex items-center justify-between group py-1">
                      <button onClick={() => togglePrep(item.id)} className="flex items-center gap-3 flex-1 text-left min-w-0 pr-2">
                        {item.done ? <CheckCircle2 size={20} className="text-morandi-primary shrink-0" /> : <Circle size={20} className="text-morandi-accent/30 shrink-0" />}
                        <span className={`text-[13px] break-words ${item.done ? 'text-morandi-accent line-through' : 'text-morandi-text font-medium'}`}>{item.text}</span>
                      </button>
                      <button onClick={() => removePrep(item.id)} className="p-1 text-morandi-accent hover:text-red-400 opacity-40 group-hover:opacity-100 active:opacity-100 transition-opacity shrink-0">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-morandi-primary/5 mt-auto">
              <input 
                value={carryOnInput}
                onChange={(e) => setCarryOnInput(e.target.value)}
                placeholder="新增隨身項目..."
                className="flex-1 min-w-0 h-11 bg-white/40 px-4 rounded-2xl text-[13px] outline-none border border-transparent focus:border-morandi-primary/20"
                onKeyPress={(e) => e.key === 'Enter' && addPrep('carryOn')}
              />
              <button onClick={() => addPrep('carryOn')} className="w-11 h-11 bg-morandi-primary text-white rounded-2xl active:scale-90 transition-all flex items-center justify-center shrink-0 shadow-sm">
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* 託運行李 */}
          <div className="bg-white/40 rounded-[32px] p-5 sm:p-6 space-y-4 border border-white/60 flex flex-col h-full justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-morandi-primary/10">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8C7A6B]"></span>
                <span className="font-bold text-[15px] text-[#8C7A6B] tracking-wider">託運行李 Checked</span>
                <span className="text-xs text-morandi-accent">({predefined.filter(i => i.category === 'checked' && i.done).length}/{predefined.filter(i => i.category === 'checked').length})</span>
              </div>
              
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {predefined.filter(i => i.category === 'checked').length === 0 ? (
                  <p className="text-xs text-morandi-accent/60 py-4 text-center">無項目，請在下方新增</p>
                ) : (
                  predefined.filter(i => i.category === 'checked').map(item => (
                    <div key={item.id} className="flex items-center justify-between group py-1">
                      <button onClick={() => togglePrep(item.id)} className="flex items-center gap-3 flex-1 text-left min-w-0 pr-2">
                        {item.done ? <CheckCircle2 size={20} className="text-[#8C7A6B] shrink-0" /> : <Circle size={20} className="text-[#8C7A6B]/30 shrink-0" />}
                        <span className={`text-[13px] break-words ${item.done ? 'text-morandi-accent line-through' : 'text-morandi-text font-medium'}`}>{item.text}</span>
                      </button>
                      <button onClick={() => removePrep(item.id)} className="p-1 text-morandi-accent hover:text-red-400 opacity-40 group-hover:opacity-100 active:opacity-100 transition-opacity shrink-0">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-morandi-primary/5 mt-auto">
              <input 
                value={checkedInput}
                onChange={(e) => setCheckedInput(e.target.value)}
                placeholder="新增託運項目..."
                className="flex-1 min-w-0 h-11 bg-white/40 px-4 rounded-2xl text-[13px] outline-none border border-transparent focus:border-morandi-primary/20"
                onKeyPress={(e) => e.key === 'Enter' && addPrep('checked')}
              />
              <button onClick={() => addPrep('checked')} className="w-11 h-11 bg-[#8C7A6B] text-white rounded-2xl active:scale-90 transition-all flex items-center justify-center shrink-0 shadow-sm">
                <Plus size={18} />
              </button>
            </div>
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
    const defaultReservations = [
      { id: '1', label: '6/14 19:30 北谷Chaabu', code: 'VGUCF2TSNW' }
    ];
    const saved = localStorage.getItem('okinawa_reservations');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.some((r: any) => r.code === 'VGUCF2TSNW')) {
        return [...defaultReservations, ...parsed];
      }
      return parsed;
    }
    return defaultReservations;
  });
  const [resInput, setResInput] = useState({ label: '', code: '' });
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const [selectedCouponTab, setSelectedCouponTab] = useState<'all' | 'electronics' | 'cosmetics'>('all');

  const couponsData = [
    {
      id: 'bic',
      name: 'Bic Camera',
      japaneseName: 'ビックカメラ',
      discount: '10% 免稅 + 7% 折扣',
      subText: '適用於電器、相機、手錶、玩具等',
      bgColor: 'from-blue-600/10 to-blue-700/5',
      borderColor: 'border-blue-500/25 border-dashed',
      brandColor: 'text-blue-600 bg-blue-50 border border-blue-200',
      logoText: 'Bic C',
      barcode: '4981234567890',
      type: 'barcode',
      category: 'electronics',
      terms: [
        '結帳前請向收銀員出示本券（智慧型手機出示此畫面即可）。',
        '免稅部分僅限符合日本免稅規定（未稅金額達5,000日圓以上）之旅客。',
        '部分限定商品（如 Apple 產品、勞力士、遊戲機主機等）可能不適用 7% 折扣。',
        '不可與其他優惠活動、折扣券同時使用。'
      ]
    },
    {
      id: 'donki',
      name: '唐吉訶德 Donki',
      japaneseName: 'ドン・キホーテ',
      discount: '10% 免稅 + 5% 折扣',
      subText: '開啟外部官網（不可截圖）',
      bgColor: 'from-yellow-500/15 to-amber-500/10',
      borderColor: 'border-amber-500/30 border-dashed',
      brandColor: 'text-amber-700 bg-amber-50 border border-amber-200',
      logoText: 'DONKI',
      externalUrl: 'https://japanportal.donki-global.com/coupon/cp001_zhtw.html',
      category: 'cosmetics',
      terms: []
    },
    {
      id: 'matsukiyo',
      name: '松本清 Matsukiyo',
      japaneseName: 'マツモトキヨシ',
      discount: '10% 免稅 + 最高 7% 折扣',
      subText: '滿3萬折5%、滿5萬折7%',
      bgColor: 'from-blue-700/10 to-yellow-500/10',
      borderColor: 'border-yellow-500/35 border-dashed',
      brandColor: 'text-blue-800 bg-yellow-50 border border-yellow-300',
      logoText: 'MK',
      barcode: 'MATSUKIYO2026',
      type: 'barcode',
      category: 'cosmetics',
      terms: [
        '結帳時請主動出示本畫面給收銀員掃描。',
        '消費未稅金額滿 1 萬日圓享 3% 折扣，滿 3 萬日圓享 5% 折扣，滿 5 萬日圓享 7% 折扣。',
        '專櫃化妝品、部分藥品及特價商品不參與折扣。',
        '僅限符合免稅資格之非日本居住之外國旅客使用。'
      ]
    },
    {
      id: 'satudora',
      name: '札幌藥妝 Satudora',
      japaneseName: 'サツドラ',
      discount: '10% 免稅 + 5% 折扣',
      subText: '沖繩國際通/奧特萊斯等店鋪',
      bgColor: 'from-blue-600/10 to-yellow-500/10',
      borderColor: 'border-blue-500/25 border-dashed',
      brandColor: 'text-blue-700 bg-blue-50 border border-blue-200',
      logoText: 'SDR',
      barcode: '2300009803175',
      type: 'barcode',
      category: 'cosmetics',
      terms: [
        '結帳前請出示本折扣券（智慧型手機出示此畫面即可）。',
        '免稅部分僅限符合日本免稅規定（單筆未稅金額達 5,000 日圓以上）之外籍旅客。',
        '適用於札幌藥妝沖繩國際通店、沖繩Ashibinaa店、iias沖繩豐崎店等免稅店鋪。',
        '部分限定商品不參與 5% 折扣，詳情請諮詢店員。',
        '不可與其他優惠活動、折扣券同時使用。'
      ]
    },
    {
      id: 'yamada',
      name: '山田電機 YAMADA',
      japaneseName: 'ヤマダデンキ',
      discount: '10% 免稅 + 7% 折扣',
      subText: '日本最大級家電連鎖店 LABI',
      bgColor: 'from-blue-600/10 to-red-500/10',
      borderColor: 'border-blue-500/25 border-dashed',
      brandColor: 'text-blue-700 bg-blue-50 border border-blue-200',
      logoText: 'LABI',
      barcode: '04090007384012',
      type: 'barcode',
      category: 'electronics',
      terms: [
        '結帳前請出示本折扣券（智慧型手機出示此畫面即可）。',
        '免稅部分僅限符合日本免稅規定（單筆未稅金額達 5,000 日圓以上）之外籍旅客。',
        '適用於日本全國 YAMADA 旗下免稅店鋪（LABI、YAMADA 等）。',
        '部分限定商品（如 Apple 產品、最新遊戲主機、部分特價品）不參與 7% 折扣，詳情請洽店員。',
        '不可與其他優惠活動、折扣券同時使用。'
      ]
    }
  ];

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
    <div className="pb-20 space-y-6">
      {/* 1. Google Map - Top */}
      <div className="bg-white/40 rounded-[32px] overflow-hidden h-[320px] relative shadow-sm border border-white/60 flex flex-col">
        <div className="relative flex-1">
          <iframe 
            src="https://www.google.com/maps/d/embed?mid=1x0Iq1Baked2ewy_fMG-xrLxpZzQ_xhI" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div className="bg-white/60 px-5 py-3 border-t border-white/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-morandi-primary tracking-widest uppercase">沖繩專屬行程地圖</span>
          </div>
          <button 
            onClick={() => window.open('https://www.google.com/maps/d/u/0/edit?mid=1x0Iq1Baked2ewy_fMG-xrLxpZzQ_xhI&usp=sharing')}
            className="flex items-center gap-1.5 text-xs font-bold text-morandi-primary bg-white px-3 py-1.5 rounded-full hover:bg-morandi-primary/5 active:scale-95 transition-all shadow-sm border border-morandi-primary/10"
          >
            <Map size={14} />
            開啟完整地圖
          </button>
        </div>
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
      <div className="bg-white/40 rounded-[32px] border border-white/60 shadow-sm overflow-hidden divide-y divide-morandi-primary/10">
        {/* 緊急聯絡資訊 */}
        <CollapsibleSection 
          id="emergency" 
          title="緊急聯絡資訊" 
          icon={<PhoneCall size={20} />} 
          isOpen={openSection === 'emergency'} 
          onToggle={() => toggleSection('emergency')}
          color="morandi-primary"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/60 p-5 rounded-2xl border border-white/80 shadow-sm flex flex-col items-center justify-center gap-1">
                <span className="text-[11px] font-bold text-morandi-text-muted uppercase tracking-widest">警察局</span>
                <span style={fontStyleSerif} className="text-3xl font-bold text-red-400/80">110</span>
              </div>
              <div className="bg-white/60 p-5 rounded-2xl border border-white/80 shadow-sm flex flex-col items-center justify-center gap-1">
                <span className="text-[11px] font-bold text-morandi-text-muted uppercase tracking-widest">救護/火警</span>
                <span style={fontStyleSerif} className="text-3xl font-bold text-red-400/80">119</span>
              </div>
            </div>
            <div className="bg-white/60 p-5 rounded-2xl border border-white/80 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-morandi-text-muted uppercase tracking-widest">訪日外國人醫療熱線</span>
                <span className="text-[8px] font-bold bg-morandi-primary/10 text-morandi-primary px-2 py-0.5 rounded-full">24H 中文</span>
              </div>
              <div className="flex items-center justify-between">
                <p style={fontStyleSerif} className="text-xl font-bold text-morandi-text tracking-tight">+81-50-3816-2787</p>
                <button onClick={() => window.open('tel:+815038162787')} className="w-10 h-10 bg-morandi-primary text-white rounded-xl flex items-center justify-center active:scale-90 transition-all shadow-sm">
                  <PhoneCall size={16} />
                </button>
              </div>
            </div>
            <div className="bg-white/60 p-5 rounded-2xl border border-white/80 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-morandi-text-muted uppercase tracking-widest">駐日辦事處那霸分處</span>
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
          icon={<Ticket size={20} />} 
          isOpen={openSection === 'reservations'} 
          onToggle={() => toggleSection('reservations')}
          color="morandi-primary"
        >
          <div className="space-y-5">
            <div className="flex items-center gap-2 w-full">
              <input 
                value={resInput.label}
                onChange={(e) => setResInput({...resInput, label: e.target.value})}
                placeholder="項目/時間"
                className="flex-1 min-w-0 bg-white/40 py-3 px-3 rounded-xl text-sm leading-relaxed outline-none border border-transparent focus:border-morandi-primary/20"
              />
              <input 
                value={resInput.code}
                onChange={(e) => setResInput({...resInput, code: e.target.value})}
                placeholder="預約代號"
                className="w-[40%] min-w-0 bg-white/40 py-3 px-3 rounded-xl text-sm leading-relaxed outline-none border border-transparent focus:border-morandi-primary/20 font-mono"
              />
              <button 
                onClick={addRes} 
                className="w-9 h-9 min-w-[36px] flex items-center justify-center bg-morandi-primary text-white rounded-xl active:scale-90 transition-all shadow-sm shrink-0"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {reservations.map(res => (
                <div key={res.id} className="bg-white/60 p-4 rounded-2xl border border-white/80 relative group shadow-sm flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] text-morandi-text-muted mb-1 pr-6 font-bold uppercase tracking-widest break-words leading-normal">{res.label}</p>
                    <p className="text-base font-bold font-mono text-morandi-text select-all break-all">{res.code}</p>
                  </div>
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
          icon={<AlertTriangle size={20} />} 
          isOpen={openSection === 'taboos'} 
          onToggle={() => toggleSection('taboos')}
          color="morandi-primary"
        >
          <ul className="space-y-5 text-[15px] text-morandi-text leading-relaxed px-2">
            <li className="flex gap-4">
              <span className="text-morandi-primary font-bold text-lg opacity-40">01</span>
              <p><span className="font-bold">出入境違禁品：</span>嚴禁攜帶肉類製品、新鮮蔬果。包含肉鬆、含肉泡麵等。</p>
            </li>
            <li className="flex gap-4">
              <span className="text-morandi-primary font-bold text-lg opacity-40">02</span>
              <div>
                <span className="font-bold block mb-1">自駕規則：</span>
                <p>日本道路的行進方向與台灣是相反的，駕駛座是右座，所以雨刷與方向燈也是相反的。</p>
                <p className="mt-1">謹記靠左線道行駛，過交叉路口時請先看右再看左，還沒有習慣前小心慢開靠左駕駛。</p>
                <p className="mt-1">還有日本一般不允許亂按喇叭，有時候會引發糾紛。</p>
              </div>
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
          icon={<Car size={20} />} 
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
            <div className="bg-white/40 p-5 rounded-2xl space-y-2 text-[15px] leading-relaxed text-morandi-text border border-white/60">
              <p>• 可使用現金、Suica, ICOCA 等交通卡。</p>
              <p>• 可使用感應功能的信用卡，單日扣款上限為日幣800円（無兒童優惠）。</p>
              <p>• 6歲以下兒童免票，6-12歲半價。</p>
              <p>• 飯店位於 <span className="font-bold text-morandi-primary">11 歌町站 (Omoromachi)</span>。</p>
            </div>
          </div>
        </CollapsibleSection>

        {/* 沖繩 FUNPASS */}
        <CollapsibleSection 
          id="funpass" 
          title="沖繩 FUNPASS" 
          icon={<Ticket size={20} />} 
          isOpen={openSection === 'funpass'} 
          onToggle={() => toggleSection('funpass')}
          color="morandi-primary"
        >
          <div className="flex items-center justify-between bg-white/40 p-5 rounded-2xl border border-white/60">
            <div className="space-y-1">
              <p className="text-[15px] font-bold text-morandi-text">一票玩遍沖繩熱門景點！</p>
              <p className="text-[10px] text-morandi-text-muted font-bold uppercase tracking-widest">7 大景點通行證</p>
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
          icon={<Wallet size={20} />} 
          isOpen={openSection === 'coupons'} 
          onToggle={() => toggleSection('coupons')}
          color="morandi-primary"
        >
          <div className="space-y-4">
            {/* Category Filter Tabs */}
            <div className="flex bg-white/40 p-1 rounded-2xl border border-white/60 max-w-[280px] mx-auto shadow-sm">
              {[
                { id: 'all', label: '全部' },
                { id: 'electronics', label: '電器類' },
                { id: 'cosmetics', label: '藥妝類' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCouponTab(tab.id as any)}
                  className={`flex-1 py-2 rounded-xl text-xs font-black tracking-wider transition-all duration-300 ${
                    selectedCouponTab === tab.id
                      ? 'bg-morandi-primary text-white shadow-md shadow-morandi-primary/15'
                      : 'text-morandi-text-muted hover:text-morandi-text hover:bg-white/30'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {couponsData
                .filter((coupon) => selectedCouponTab === 'all' || coupon.category === selectedCouponTab)
                .map((coupon) => (
                  <button
                    key={coupon.id}
                    onClick={() => {
                      if (coupon.externalUrl) {
                        window.open(coupon.externalUrl, '_blank');
                      } else {
                        setSelectedCoupon(coupon);
                      }
                    }}
                    className="aspect-square bg-white/40 border border-white/60 p-2 sm:p-4 rounded-[24px] flex flex-col justify-between items-center text-center shadow-sm cursor-pointer hover:bg-white/70 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative overflow-hidden group"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-black ${coupon.brandColor}`}>
                      {coupon.logoText}
                    </div>
                    <div className="flex-1 flex flex-col justify-center my-1.5">
                      <p className="text-[10px] sm:text-xs font-bold text-morandi-text line-clamp-1">{coupon.name}</p>
                      <p className="text-[9px] sm:text-[11px] text-red-500 font-extrabold mt-0.5 whitespace-nowrap">{coupon.discount.split(' + ')[1] || coupon.discount}</p>
                    </div>
                    <span className="text-[8px] font-extrabold text-morandi-primary uppercase tracking-wider bg-morandi-primary/5 px-2 py-0.5 rounded-full group-hover:bg-morandi-primary/10 transition-colors flex items-center gap-0.5">
                      {coupon.externalUrl ? '官網連結' : '點擊開啟'}
                      {coupon.externalUrl && <ExternalLink size={8} />}
                    </span>
                  </button>
                ))}
            </div>
            <p className="text-[10px] text-center text-morandi-text-muted font-bold uppercase tracking-widest">點擊方塊即可顯示折扣條碼（唐吉訶德將開啟官方網站）</p>
          </div>
        </CollapsibleSection>
      </div>

      <AnimatePresence>
        {selectedCoupon && (
          <CouponDetailModal 
            coupon={selectedCoupon} 
            onClose={() => setSelectedCoupon(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CollapsibleSection({ id, title, icon, children, isOpen, onToggle, color }: any) {
  return (
    <div className="overflow-hidden">
      <button 
        onClick={onToggle}
        className={`w-full p-6 flex items-center justify-between transition-all ${isOpen ? 'bg-white/20' : 'hover:bg-white/40'}`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${color === 'morandi-primary' ? 'bg-morandi-primary/10 text-morandi-primary' : 'bg-morandi-accent/10 text-morandi-accent'}`}>
            {icon}
          </div>
          <h3 className="text-[18px] font-bold text-morandi-text">{title}</h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-morandi-accent/60"
        >
          <ChevronDown size={18} />
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
            <div className="p-6 pt-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SVGBarcode({ code }: { code: string }) {
  // A simple deterministic scannable-looking bar pattern based on characters in the barcode code
  const chars = code.replace(/\s/g, '').split('');
  const bars: number[] = [];
  chars.forEach((c, idx) => {
    const val = parseInt(c, 10) || 3;
    bars.push((val % 3) + 1);
    bars.push((val % 2) + 1);
    bars.push(idx % 2 === 0 ? 1 : 2);
  });
  return (
    <div className="w-full flex items-center justify-center h-12 overflow-hidden px-1 bg-white">
      {bars.map((w, idx) => (
        <div
          key={idx}
          style={{ width: `${w * 1.5}px` }}
          className={`h-12 shrink-0 ${idx % 2 === 0 ? 'bg-black' : 'bg-transparent'}`}
        />
      ))}
    </div>
  );
}

function CouponDetailModal({ coupon, onClose }: { coupon: any; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const [copied1, setCopied1] = useState(false);
  const [copied2, setCopied2] = useState(false);
  const [selectedMatsukiyoTab, setSelectedMatsukiyoTab] = useState('7');
  const [copiedMatsukiyo, setCopiedMatsukiyo] = useState(false);
  const [copiedSatudora, setCopiedSatudora] = useState(false);
  const [copiedYamada, setCopiedYamada] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.barcode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = (code: string, flagSetter: (val: boolean) => void) => {
    navigator.clipboard.writeText(code);
    flagSetter(true);
    setTimeout(() => flagSetter(false), 2000);
  };

  // Generate pseudo-random bar widths for realistic barcode look
  const barWidths = [
    2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 2, 1, 1, 3, 2, 1, 2, 3, 1, 4, 1, 2,
    1, 3, 1, 2, 4, 1, 2, 1, 2, 3, 1, 2, 4, 1, 1, 3, 2, 1, 4, 2, 1, 2, 3
  ];

  const isBicCamera = coupon.id === 'bic';
  const isMatsukiyo = coupon.id === 'matsukiyo';
  const isSatudora = coupon.id === 'satudora';
  const isYamada = coupon.id === 'yamada';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="bg-morandi-bg w-full max-w-[420px] rounded-[36px] overflow-hidden shadow-2xl border border-white/60 relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header / Close Button */}
        <div className="absolute top-5 right-5 z-10">
          <button 
            onClick={onClose}
            className="w-9 h-9 bg-white/80 backdrop-blur-sm hover:bg-white text-morandi-text rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto p-6 space-y-5">
          {/* Brand/Logo Header */}
          <div className="text-center pt-4 pb-2">
            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${coupon.brandColor}`}>
              {coupon.logoText} Official
            </span>
            <h3 style={fontStyleSerif} className="text-2xl font-bold text-morandi-text mt-3">{coupon.name}</h3>
            <p className="text-[11px] text-morandi-text-muted font-bold tracking-widest uppercase mt-0.5">{coupon.japaneseName}</p>
          </div>

          {isBicCamera || isMatsukiyo || isSatudora || isYamada ? (
            /* --- HIGH FIDELITY OFFICIAL COUPON IMAGE --- */
            <div className="space-y-4">
              {/* Official Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-md border border-white/60 bg-white">
                <img 
                  src={
                    isBicCamera 
                      ? "https://www.taxfreeshops.jp/img/tieup2/coupon_zhtw.jpg" 
                      : isMatsukiyo 
                        ? "https://img.gototravel.tw/2019/coupon/2026/2026-Matsukiyo-coupon.jpg"
                        : isSatudora
                          ? "https://img.gototravel.tw/2019/coupon/sapporo-drug-coupon1.jpg"
                          : "https://img.gototravel.tw/2019/coupon/2026-yamada-coupon.jpg"
                  } 
                  alt={`${coupon.name} 官方優惠券`} 
                  className="w-full h-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              {isBicCamera ? (
                /* Dual Barcode Scanning Station */
                <div className="bg-white border border-gray-100 rounded-3xl p-4.5 space-y-4 shadow-inner">
                  {/* Barcode 1 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-extrabold text-gray-700 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-black text-[9px]">①</span>
                        <span>カウント JAN (店鋪統計用)</span>
                      </span>
                      <button 
                        onClick={() => handleCopyCode('2000220137027', setCopied1)}
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full transition-colors ${copied1 ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {copied1 ? '已複製' : '複製號碼'}
                      </button>
                    </div>
                    <div className="border border-gray-100 p-2.5 rounded-2xl bg-white flex flex-col items-center shadow-sm">
                      <SVGBarcode code="2000220137027" />
                      <span className="font-mono text-[12px] font-black tracking-[0.25em] text-gray-800 mt-2 pl-[0.25em]">2 000220 137027</span>
                    </div>
                  </div>

                  {/* Barcode 2 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-extrabold text-gray-700 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-black text-[9px]">②</span>
                        <span>自動値引 JAN (結帳折抵用)</span>
                      </span>
                      <button 
                        onClick={() => handleCopyCode('2402230007947', setCopied2)}
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full transition-colors ${copied2 ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {copied2 ? '已複製' : '複製號碼'}
                      </button>
                    </div>
                    <div className="border border-gray-100 p-2.5 rounded-2xl bg-white flex flex-col items-center shadow-sm">
                      <SVGBarcode code="2402230007947" />
                      <span className="font-mono text-[12px] font-black tracking-[0.25em] text-gray-800 mt-2 pl-[0.25em]">2 402230 007947</span>
                    </div>
                  </div>

                  {/* Important Tip */}
                  <div className="flex gap-2.5 bg-amber-50/60 p-3 rounded-2xl border border-amber-100/50 text-[10px] text-amber-800 leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5 animate-pulse" />
                    <p><b>提示：</b>結帳時請將手機螢幕亮度調至最高，方便收銀員依序掃描 <b>① 統計條碼</b> 與 <b>② 折抵條碼</b> 即可享受折扣！</p>
                  </div>
                </div>
              ) : isMatsukiyo ? (
                /* Matsukiyo Interactive Triple Barcode Station */
                <div className="bg-white border border-gray-100 rounded-3xl p-4.5 space-y-4 shadow-inner">
                  {/* Tab Selector for different discount tiers */}
                  <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100/50">
                    {[
                      { key: '3', label: '3% 折扣', desc: '未稅滿 1 萬日圓', code: '9839008910032' },
                      { key: '5', label: '5% 折扣', desc: '未稅滿 3 萬日圓', code: '9839009010052' },
                      { key: '7', label: '7% 折扣', desc: '未稅滿 5 萬日圓', code: '9839009110073' },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setSelectedMatsukiyoTab(tab.key)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center ${
                          selectedMatsukiyoTab === tab.key
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                            : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/50'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span className={`text-[8px] mt-0.5 ${selectedMatsukiyoTab === tab.key ? 'text-white/80' : 'text-gray-400'}`}>
                          {tab.desc}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Render selected barcode */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-extrabold text-blue-700 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                        <span>松本清 {selectedMatsukiyoTab === '3' ? '3%' : selectedMatsukiyoTab === '5' ? '5%' : '7%'} 專用折抵條碼</span>
                      </span>
                      <button 
                        onClick={() => {
                          const code = selectedMatsukiyoTab === '3' ? '9839008910032' : selectedMatsukiyoTab === '5' ? '9839009010052' : '9839009110073';
                          handleCopyCode(code, setCopiedMatsukiyo);
                        }}
                        className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full transition-colors ${copiedMatsukiyo ? 'bg-emerald-500 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                      >
                        {copiedMatsukiyo ? '已複製' : '複製號碼'}
                      </button>
                    </div>
                    <div className="border border-gray-100 p-4 rounded-2xl bg-white flex flex-col items-center shadow-sm">
                      <SVGBarcode code={selectedMatsukiyoTab === '3' ? '9839008910032' : selectedMatsukiyoTab === '5' ? '9839009010052' : '9839009110073'} />
                      <span className="font-mono text-[14px] font-black tracking-[0.25em] text-gray-800 mt-2.5 pl-[0.25em]">
                        {selectedMatsukiyoTab === '3' ? '9 839008 910032' : selectedMatsukiyoTab === '5' ? '9 839009 010052' : '9 839009 110073'}
                      </span>
                    </div>
                  </div>

                  {/* Tips for Matsukiyo */}
                  <div className="flex gap-2.5 bg-blue-50/60 p-3 rounded-2xl border border-blue-100/50 text-[10px] text-blue-800 leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5 animate-pulse" />
                    <p><b>松本清使用指南：</b>結帳時請向收銀員出示 <b>上方官方條碼圖片</b> 進行掃描。若掃描不易，可手動切換下方的對應折扣標籤並出示條碼，或點擊複製條碼數字提供給店員輸入！</p>
                  </div>
                </div>
              ) : isSatudora ? (
                /* Satudora High Fidelity Single Barcode Station */
                <div className="bg-white border border-gray-100 rounded-3xl p-4.5 space-y-4 shadow-inner">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-extrabold text-blue-700 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                        <span>札幌藥妝 專用折抵條碼</span>
                      </span>
                      <button 
                        onClick={() => handleCopyCode('2300009803175', setCopiedSatudora)}
                        className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full transition-colors ${copiedSatudora ? 'bg-emerald-500 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                      >
                        {copiedSatudora ? '已複製' : '複製號碼'}
                      </button>
                    </div>
                    <div className="border border-gray-100 p-4 rounded-2xl bg-white flex flex-col items-center shadow-sm">
                      <SVGBarcode code="2300009803175" />
                      <span className="font-mono text-[14px] font-black tracking-[0.25em] text-gray-800 mt-2.5 pl-[0.25em]">2 300009 803175</span>
                    </div>
                  </div>

                  {/* Tips for Satudora */}
                  <div className="flex gap-2.5 bg-blue-50/60 p-3 rounded-2xl border border-blue-100/50 text-[10px] text-blue-800 leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5 animate-pulse" />
                    <p><b>使用指南：</b>結帳前請向收銀員出示 <b>上方官方優惠券圖片</b> 進行掃描並調高螢幕亮度。若掃描不順利，可出示 <b>下方專用條碼</b> 或手動輸入 <b>2300009803175</b> 即可享受折扣！</p>
                  </div>
                </div>
              ) : (
                /* Yamada High Fidelity Single Barcode Station */
                <div className="bg-white border border-gray-100 rounded-3xl p-4.5 space-y-4 shadow-inner">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-extrabold text-blue-700 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                        <span>山田電機 專用折抵條碼</span>
                      </span>
                      <button 
                        onClick={() => handleCopyCode('04090007384012', setCopiedYamada)}
                        className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full transition-colors ${copiedYamada ? 'bg-emerald-500 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                      >
                        {copiedYamada ? '已複製' : '複製號碼'}
                      </button>
                    </div>
                    <div className="border border-gray-100 p-4 rounded-2xl bg-white flex flex-col items-center shadow-sm">
                      <SVGBarcode code="04090007384012" />
                      <span className="font-mono text-[14px] font-black tracking-[0.25em] text-gray-800 mt-2.5 pl-[0.25em]">0 409000 7384012</span>
                    </div>
                  </div>

                  {/* Tips for Yamada */}
                  <div className="flex gap-2.5 bg-blue-50/60 p-3 rounded-2xl border border-blue-100/50 text-[10px] text-blue-800 leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5 animate-pulse" />
                    <p><b>使用指南：</b>結帳前請向收銀員出示 <b>上方官方優惠券圖片</b> 進行掃描並調高螢幕亮度。若掃描不順利，可出示 <b>下方專用條碼</b> 或手動輸入 <b>04090007384012</b> 即可享受折扣！</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* --- DEFAULT GENERIC COUPON LOOK --- */
            <div className={`rounded-3xl bg-gradient-to-br ${coupon.bgColor} p-6 border ${coupon.borderColor} relative overflow-hidden flex flex-col items-center shadow-inner`}>
              {/* Cutout punch holes at sides */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-morandi-bg rounded-full border-r border-white/40 shadow-inner z-10" />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-morandi-bg rounded-full border-l border-white/40 shadow-inner z-10" />

              <span className="text-[10px] text-morandi-primary/60 font-extrabold uppercase tracking-[0.2em]">免稅專屬特別折扣</span>
              <div className="text-center my-3">
                <span style={fontStyleSerif} className="text-3xl font-extrabold text-morandi-text leading-none tracking-tight">
                  {coupon.discount.split(' + ')[0]}
                </span>
                <div className="text-2xl font-black text-red-500 mt-1">
                  + {coupon.discount.split(' + ')[1] || '優惠折扣'}
                </div>
              </div>
              <p className="text-xs text-morandi-text-muted/80 font-medium text-center">{coupon.subText}</p>

              {/* Dashed Separator */}
              <div className="w-full border-t border-dashed border-morandi-primary/20 my-5" />

              {/* Scanner Visual (Barcode / QR Code) */}
              <div className="w-full space-y-4">
                {coupon.type === 'barcode' ? (
                  <div className="flex flex-col items-center bg-white p-4 py-5 rounded-2xl border border-white shadow-sm w-full">
                    <div className="w-full flex items-center justify-center h-14 overflow-hidden px-2">
                      {barWidths.map((w, idx) => {
                        if (idx % 2 === 0) {
                          return (
                            <div 
                              key={idx} 
                              style={{ width: `${w * 1.5}px` }} 
                              className="h-14 bg-gray-900 shrink-0" 
                              />
                          );
                        } else {
                          return (
                            <div 
                              key={idx} 
                              style={{ width: `${w * 1.5}px` }} 
                              className="h-14 bg-transparent shrink-0" 
                              />
                          );
                        }
                      })}
                    </div>
                    <span className="font-mono text-[13px] font-bold tracking-[0.3em] text-gray-800 mt-3 pl-[0.3em]">{coupon.barcode}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center bg-white p-5 rounded-2xl border border-white shadow-sm w-full">
                    <svg viewBox="0 0 100 100" className="w-28 h-28 text-gray-900">
                      <rect x="0" y="0" width="28" height="28" fill="currentColor" rx="1.5" />
                      <rect x="4" y="4" width="20" height="20" fill="white" rx="1" />
                      <rect x="8" y="8" width="12" height="12" fill="currentColor" />

                      <rect x="72" y="0" width="28" height="28" fill="currentColor" rx="1.5" />
                      <rect x="76" y="4" width="20" height="20" fill="white" rx="1" />
                      <rect x="80" y="8" width="12" height="12" fill="currentColor" />

                      <rect x="0" y="72" width="28" height="28" fill="currentColor" rx="1.5" />
                      <rect x="4" y="76" width="20" height="20" fill="white" rx="1" />
                      <rect x="8" y="80" width="12" height="12" fill="currentColor" />

                      <rect x="36" y="6" width="8" height="8" fill="currentColor" />
                      <rect x="48" y="14" width="14" height="6" fill="currentColor" />
                      <rect x="36" y="24" width="6" height="12" fill="currentColor" />
                      <rect x="54" y="26" width="10" height="10" fill="currentColor" />

                      <rect x="6" y="36" width="8" height="8" fill="currentColor" />
                      <rect x="18" y="48" width="12" height="6" fill="currentColor" />
                      <rect x="0" y="54" width="6" height="10" fill="currentColor" />

                      <rect x="38" y="38" width="24" height="24" fill="currentColor" rx="1" />
                      <rect x="44" y="44" width="12" height="12" fill="white" />

                      <rect x="72" y="36" width="10" height="14" fill="currentColor" />
                      <rect x="86" y="44" width="10" height="10" fill="currentColor" />

                      <rect x="44" y="72" width="14" height="10" fill="currentColor" />
                      <rect x="36" y="86" width="10" height="10" fill="currentColor" />
                      <rect x="54" y="80" width="12" height="12" fill="currentColor" />

                      <rect x="72" y="72" width="28" height="28" fill="currentColor" rx="1.5" />
                      <rect x="76" y="76" width="20" height="20" fill="white" rx="1" />
                      <rect x="80" y="80" width="12" height="12" fill="currentColor" />
                    </svg>
                    <span className="font-mono text-[13px] font-bold tracking-[0.2em] text-gray-800 mt-3 pl-[0.2em]">{coupon.barcode}</span>
                  </div>
                )}

                {/* Copy Code Action */}
                <button 
                  onClick={handleCopy}
                  className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.97] ${copied ? 'bg-emerald-500 text-white' : 'bg-white hover:bg-gray-50 text-morandi-text border border-gray-100 shadow-sm'}`}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? '代碼複製成功！' : '複製折扣代碼'}
                </button>
              </div>
            </div>
          )}

          {/* Terms & Conditions */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-morandi-text flex items-center gap-1.5 px-1">
              <Info size={13} className="text-morandi-primary" /> 優惠券使用說明
            </h4>
            <div className="bg-white/40 border border-white/60 rounded-2xl p-4 space-y-2 text-[11px] leading-relaxed text-morandi-text-muted">
              {isBicCamera ? (
                <>
                  <p className="flex gap-1">
                    <span className="text-morandi-primary font-bold shrink-0">•</span>
                    <span>結帳前請出示本折扣券畫面（向店員展示兩個條碼）。</span>
                  </p>
                  <p className="flex gap-1">
                    <span className="text-morandi-primary font-bold shrink-0">•</span>
                    <span>免稅部分僅限符合日本免稅規定（單筆未稅金額達 5,000 日圓以上）之外籍旅客。</span>
                  </p>
                  <p className="flex gap-1">
                    <span className="text-morandi-primary font-bold shrink-0">•</span>
                    <span>部分限定商品（如 Apple 產品、任天堂 Switch 遊戲機、勞力士手錶、部分化妝品等）可能不適用 7% 折扣。</span>
                  </p>
                  <p className="flex gap-1">
                    <span className="text-morandi-primary font-bold shrink-0">•</span>
                    <span>本券不可與其他優惠券、折價活動或店鋪折價同時使用。</span>
                  </p>
                </>
              ) : (
                coupon.terms.map((term: string, idx: number) => (
                  <p key={idx} className="flex gap-1">
                    <span className="text-morandi-primary font-bold shrink-0">•</span>
                    <span>{term}</span>
                  </p>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-5 border-t border-morandi-primary/5 bg-white/40 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3.5 bg-morandi-primary text-white rounded-2xl font-bold text-xs shadow-lg shadow-morandi-primary/10 hover:bg-morandi-primary/95 active:scale-95 transition-all text-center"
          >
            完成，關閉優惠券
          </button>
        </div>
      </motion.div>
    </motion.div>
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
