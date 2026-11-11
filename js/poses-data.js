/**
 * Database Pose Cheki - Pure Gacha Edition
 * Terhubung ke referensi foto dari Google Drive:
 * - Cute Mode -> assets/poses/cute/
 * - Fun Mode -> assets/poses/fun/
 * - Random Meme -> assets/poses/meme/
 */

export const CHEKI_POSES = [
  // ==========================================
  // 1. CUTE MODE (Manis, Kawaii, Sweet Idol)
  // ==========================================
  {
    id: "half-heart",
    title: "Half Heart (Setengah Hati)",
    titleJp: "片ハート (Kata-Haato)",
    mode: "cute",
    sop: "safe",
    image: "assets/poses/cute/half-heart.jpg",
    diagramType: "half-heart",
    cueId: "Kak, bikin setengah hati ya! Nanti aku yang lengkapin.",
    cueJp: "一緒に片ハート作ってください！",
    fanAction: "Bentuk setengah lengkungan hati di samping",
    idolAction: "Melengkapi setengah hati membentuk cinta utuh",
    description: "Pose nomor 1 terfavorit di dunia per-cheki-an! Manis, simpel, dan aman sesuai SOP bilik cheki."
  },
  {
    id: "nyan-cat-paws",
    title: "Nyan-Nyan Cat Paws",
    titleJp: "猫の手ポーズ (Neko no Te)",
    mode: "cute",
    sop: "safe",
    image: "assets/poses/cute/nyan-cat-paws.jpg",
    diagramType: "cat-paws",
    cueId: "Kak, pose kucing nyan-nyan bareng yuk!",
    cueJp: "にゃんにゃん猫ポーズしましょう！",
    fanAction: "Kepalkan tangan seperti cakar kucing di depan dada",
    idolAction: "Pose cakar kucing di dekat pipi dengan ekspresi imut",
    description: "Pose cakar kucing legendaris. Sangat cocok jika oshi kamu punya persona lucu atau berkostum maid/neko."
  },
  {
    id: "hoppe-puni",
    title: "Pipi Bakpao / Cheek Poke",
    titleJp: "ほっぺぷに (Hoppe Puni)",
    mode: "cute",
    sop: "safe",
    image: "assets/poses/cute/hoppe-puni.jpg",
    diagramType: "cheek-poke",
    cueId: "Yuk pose tusuk pipi sendiri kak, biar kelihatan gemas!",
    cueJp: "ほっぺツンツンポーズでお願いします！",
    fanAction: "Tusuk pipi sendiri dengan telunjuk sambil senyum lebar",
    idolAction: "Tusuk pipi sendiri sambil ekspresi cemberut lucu / senyum",
    description: "Menonjolkan keimutan wajah. Tusuk pipi masing-masing ya, jangan menyentuh pipi idol!"
  },
  {
    id: "usagi-ears",
    title: "Bunny Ears (Telinga Kelinci)",
    titleJp: "うさぎポーズ (Usagi Pose)",
    mode: "cute",
    sop: "safe",
    image: "assets/poses/cute/usagi-ears.jpg",
    diagramType: "bunny-ears",
    cueId: "Kak, kita jadi kelinci yuk! Pasang kuping kelinci ya.",
    cueJp: "うさ耳ポーズでお願いします！ぴょんぴょん！",
    fanAction: "Letakkan dua jari seperti kuping di atas kepala sendiri",
    idolAction: "Buat telinga kelinci lucu di atas kepala",
    description: "Gaya kuping kelinci yang melompat imut. Sangat cocok untuk oshi yang ceria dan playful."
  },
  {
    id: "gyaru-peace",
    title: "Inverted Gyaru Peace",
    titleJp: "ギャルピース (Gyaru Piisu)",
    mode: "cute",
    sop: "safe",
    image: "assets/poses/cute/gyaru-peace.jpg",
    diagramType: "gyaru-peace",
    cueId: "Kak, pose gyaru peace terbalik yang lagi ngetren ya!",
    cueJp: "ギャルピースしましょう！",
    fanAction: "Dua jari peace menghadap ke bawah dan agak maju ke depan lensa",
    idolAction: "Gyaru peace terbalik di depan dada",
    description: "Pose V sign yang dibalik ke bawah ala tren K-Pop dan Gal Jepang. Bikin cheki terlihat aesthetic."
  },
  {
    id: "chin-flower",
    title: "Chin Flower (Bunga Mekar Dagu)",
    titleJp: "あごのせ花咲く (Ago-nose Hana)",
    mode: "cute",
    sop: "safe",
    image: "assets/poses/cute/chin-flower.jpg",
    diagramType: "chin-flower",
    cueId: "Kak, pose bunga mekar di dagu ya!",
    cueJp: "お花が咲いたポーズでお願いします！",
    fanAction: "Buka kedua telapak tangan di bawah dagu seperti kelopak bunga",
    idolAction: "Dagu bertumpu di kedua telapak tangan yang mekar",
    description: "Membingkai wajah dengan sempurna sehingga oshi terlihat seperti bunga mekar yang mempesona."
  },
  {
    id: "finger-heart",
    title: "K-Pop Finger Heart",
    titleJp: "指ハート (Yubi Haato)",
    mode: "cute",
    sop: "safe",
    image: "assets/poses/cute/finger-heart.jpg",
    diagramType: "finger-heart",
    cueId: "Kak, finger heart simpel ya!",
    cueJp: "指ハートで撮りましょう！",
    fanAction: "Silangkan jempol dan telunjuk membentuk hati mini",
    idolAction: "Finger heart mengarah ke kamera",
    description: "Pose cinta mini yang super praktis, cocok saat waktu cheki tersisa sedikit dan harus cepat."
  },
  {
    id: "big-head-heart",
    title: "Big Head Heart (Hati Raksasa)",
    titleJp: "頭の上でビッグハート (Big Haato)",
    mode: "cute",
    sop: "safe",
    image: "assets/poses/cute/big-head-heart.jpg",
    diagramType: "big-heart",
    cueId: "Bikin hati besar di atas kepala yuk kak!",
    cueJp: "頭の上で大きいハート作りましょう！",
    fanAction: "Lengkungkan satu lengan tinggi ke atas kepala bertemu ke arah idol",
    idolAction: "Lengkungkan lengan satunya ke atas membentuk kubah hati raksasa",
    description: "Hati berukuran besar di atas kepala yang membuat foto terlihat sangat hangat dan penuh antusiasme."
  },

  // ==========================================
  // 2. FUN MODE (Unik, Interaktif, Roleplay)
  // ==========================================
  {
    id: "bodyguard-vip",
    title: "VIP Idol & Secret Bodyguard",
    titleJp: "ボディーガードとVIP (Bodyguard)",
    mode: "fun",
    sop: "safe",
    image: "assets/poses/fun/bodyguard-vip.jpg",
    diagramType: "bodyguard",
    cueId: "Kak, kamu jadi artis VIP dunia, aku yang jadi bodyguard kamu!",
    cueJp: "VIPアイドルとボディーガードごっこで！",
    fanAction: "Pasang wajah dingin, tangan di telinga ala agen intelijen pegang earpiece",
    idolAction: "Tersenyum glamor dan melambai anggun layaknya artis dunia",
    description: "Pose roleplay paling seru! Kamu menjaga sang oshi dari kerumunan fans dengan gaya super dingin."
  },
  {
    id: "arm-wrestling",
    title: "Arm Wrestling Duel (Panco Seru)",
    titleJp: "腕相撲対決 (Udezumou)",
    mode: "fun",
    sop: "safe",
    image: "assets/poses/fun/arm-wrestling.jpg",
    diagramType: "arm-wrestling",
    cueId: "Kak, kita tanding panco! Tapi no touch ya, tatap-tatapan sengit!",
    cueJp: "エア腕相撲対決しましょう！負けませんよ！",
    fanAction: "Letakkan siku di meja, kepal tangan siap panco dengan muka ngotot",
    idolAction: "Posisi panco dengan muka sok kuat atau gemas menahan tawa",
    description: "Tanding panco seru di atas meja tanpa saling menyentuh. Wajah tegang keduanya bikin cheki sangat hidup!"
  },
  {
    id: "pinky-promise",
    title: "Pinky Promise (Janji Kelingking)",
    titleJp: "ゆびきりげんまん (Yubikiri)",
    mode: "fun",
    sop: "safe",
    image: "assets/poses/fun/pinky-promise.jpg",
    diagramType: "pinky-promise",
    cueId: "Kak, janji kelingking ya kalau kita bakal ketemu lagi di event depan!",
    cueJp: "また会える約束の指切りポーズで！",
    fanAction: "Arahkan jari kelingking ke arah idol tanpa bersentuhan",
    idolAction: "Arahkan kelingking sejajar seolah mengunci janji setia",
    description: "Simbol komitmen antara wota dan oshi bahwa akan terus mendukung dan bertemu di live berikutnya."
  },
  {
    id: "air-highfive",
    title: "Air High-Five (Tos Melayang)",
    titleJp: "エアハイタッチ (Air High Five)",
    mode: "fun",
    sop: "safe",
    image: "assets/poses/fun/air-highfive.jpg",
    diagramType: "air-highfive",
    cueId: "Kak, tos melayang di udara yuk!",
    cueJp: "エアハイタッチで元気よく！イエーイ！",
    fanAction: "Angkat telapak tangan tinggi seolah baru saja tos di udara",
    idolAction: "Telapak tangan berhadapan dengan senyuman lebar",
    description: "Mengalirkan energi positif dan rasa kebersamaan yang erat tanpa melanggar SOP sekat akrilik."
  },
  {
    id: "detective-suspect",
    title: "Detective & The Culprit (Detektif & Tersangka)",
    titleJp: "名探偵と犯人 (Meitantei)",
    mode: "fun",
    sop: "safe",
    image: "assets/poses/fun/detective-suspect.jpg",
    diagramType: "detective",
    cueId: "Kak, aku jadi detektif yang nemuin pelakunya: kamu yang nyuri hatiku!",
    cueJp: "真実はいつもひとつ！犯人ポーズで！",
    fanAction: "Tunjuk ke arah oshi ala Detective Conan: 'Pelakunya adalah kamu!'",
    idolAction: "Angkat kedua tangan pasrah sambil ekspresi bersalah lucu",
    description: "Gombalan detektif klasik yang selalu sukses memancing tawa dan reaksi lucu dari sang oshi."
  },
  {
    id: "lightstick-cross",
    title: "Lightstick Cross Duel",
    titleJp: "ペンライトクロス (Penlight Cross)",
    mode: "fun",
    sop: "prop",
    image: "assets/poses/fun/lightstick-cross.jpg",
    diagramType: "lightstick-cross",
    cueId: "Kak, kita silangkan lightstick yuk, duel lightsaber!",
    cueJp: "ペンライトでクロス作って決闘しましょう！",
    fanAction: "Pegang lightstick menyala, silangkan membentuk X bersama idol",
    idolAction: "Pegang lightstick menyala membentuk tanda silang pedang cahaya",
    description: "Wajib jika kamu membawa lightstick resmi member! Warna nyala lampu bikin hasil cheki semakin estetik."
  },

  // ==========================================
  // 3. RANDOM / MEME MODE (Kocak, Chaos, Wota)
  // ==========================================
  {
    id: "jojo-menacing",
    title: "JoJo Menacing Stance (JoJo Dachi)",
    titleJp: "ジョジョ立ち (JoJo Dachi)",
    mode: "meme",
    sop: "safe",
    image: "assets/poses/meme/jojo-menacing.jpg",
    diagramType: "jojo",
    cueId: "Kak, pose JoJo Bizarre Adventure yuk! Wryyy!",
    cueJp: "ジョジョ立ちでかっこよく決めましょう！ゴゴゴ...",
    fanAction: "Tekuk lutut, satu tangan menutup kening, badan miring dramatis",
    idolAction: "Pose karakter JoJo andalan (menatap tajam dengan lekukan tubuh unik)",
    description: "Pose anime paling legendaris sepanjang masa! Menghadirkan efek suara 'ゴゴゴ' imajiner di foto cheki."
  },
  {
    id: "kamehameha-beam",
    title: "Kamehameha Beam Clash (Adu Jurus)",
    titleJp: "かめはめ波・ビーム対決 (Beam Clash)",
    mode: "meme",
    sop: "safe",
    image: "assets/poses/meme/kamehameha-beam.jpg",
    diagramType: "kamehameha",
    cueId: "Kak, adu jurus Kamehameha ya! Jangan kalah sama tenagaku!",
    cueJp: "かめはめ波ビーム対決でお願いします！波ァァ！",
    fanAction: "Kumpulkan dua tangan di pinggang siap meluncurkan Kamehameha",
    idolAction: "Tembakkan jurus balasan ke arah fans dengan ekspresi berapi-api",
    description: "Adu kekuatan dahsyat antara fans dan oshi. Siapa yang jurus energinya paling besar?"
  },
  {
    id: "crying-fan-smug-idol",
    title: "Crying Fan & Smug Oshi (Nangis Terharu)",
    titleJp: "感涙オタクとドヤ顔推し (Kairui Ota)",
    mode: "meme",
    sop: "safe",
    image: "assets/poses/meme/crying-fan-smug-idol.jpg",
    diagramType: "crying-fan",
    cueId: "Kak, kamu pasang muka sombong ya, aku pura-pura nangis terharu ketemu kamu!",
    cueJp: "泣いてるオタクとドヤ顔推しメンで！",
    fanAction: "Dua tangan di depan dada seolah menyembah/nangis terharu bahagia",
    idolAction: "Pose berkacak pinggang dengan ekspresi sombong lucu (doyagao)",
    description: "Gambaran nyata realita kehidupan per-wota-an. Dijamin jadi cheki paling lucu di koleksi albummu!"
  },
  {
    id: "spiderman-pointing",
    title: "Spider-Man Pointing Meme",
    titleJp: "スパイダーマン指差し (Spiderman Point)",
    mode: "meme",
    sop: "safe",
    image: "assets/poses/meme/spiderman-pointing.jpg",
    diagramType: "spiderman",
    cueId: "Pose meme Spider-Man tunjuk-tunjukan kak!",
    cueJp: "スパイダーマンの指差しミームで！",
    fanAction: "Bungkukkan badan setengah, tunjuk idol dengan jari telunjuk",
    idolAction: "Bungkukkan badan, tunjuk fans dengan ekspresi kaget: 'Lho kamu?!'",
    description: "Berdasarkan meme kartun legendaris. Dua orang saling tunjuk heran karena bertemu kembaran."
  },
  {
    id: "air-kabedon",
    title: "Air Kabedon (Kabedon Udara)",
    titleJp: "エア壁ドン (Air Kabedon)",
    mode: "meme",
    sop: "safe",
    image: "assets/poses/meme/air-kabedon.jpg",
    diagramType: "kabedon",
    cueId: "Kak, kita pose kabedon di sekat akrilik ya!",
    cueJp: "アクリル板越しにエア壁ドンしましょう！",
    fanAction: "Tempelkan satu telapak tangan di sekat pembatas akrilik seolah kabedon",
    idolAction: "Merapat ke dinding sekat dengan ekspresi kaget terpesona",
    description: "Memanfaatkan partisi akrilik venue secara kreatif tanpa melanggar batasan fisik bilik cheki."
  }
];

export const MODE_INFO = {
  cute: {
    name: "Cute Mode",
    jpName: "キュート",
    emoji: "🎀",
    color: "#FF6584",
    bgSoft: "#FFF0F3",
    description: "Pose manis, kawaii, dan romantis andalan foto bareng oshi!"
  },
  fun: {
    name: "Fun Mode",
    jpName: "ユニーク",
    emoji: "✨",
    color: "#FF9A3C",
    bgSoft: "#FFF7EE",
    description: "Pose interaktif, duel kocak, dan mini-roleplay seru!"
  },
  meme: {
    name: "Random Meme",
    jpName: "ミーム・カオス",
    emoji: "🎭",
    color: "#7E57C2",
    bgSoft: "#F3EEFF",
    description: "Pose kocak dari meme internet, anime, dan kekacauan wota!"
  }
};
