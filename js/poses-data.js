/**
 * Database Pose Cheki - Hasil Analisis Foto Google Drive Pengguna
 * Terdiri dari 19 pose asli yang diunggah pengguna ke 3 folder:
 * - 1_Cute_Mode (7 foto)
 * - 2_Fun_Mode (4 foto)
 * - 3_Random_Meme (8 foto)
 */

export const CHEKI_POSES = [
  // ==========================================
  // 1. CUTE MODE (7 Foto Analisis Google Drive)
  // ==========================================
  {
    id: "cute-01-atama-usagi",
    title: "Dagu di Kepala & Kuping Kelinci",
    titleJp: "頭のせピースうさ耳 (Atama-nose Usagi)",
    mode: "cute",
    sop: "safe",
    image: "assets/poses/cute/pose_12_427630927133681822.jpg",
    diagramType: "bunny-ears",
    fanAction: "Berdiri di belakang, dagu nempel di kepala oshi sambil pasang 2 jari peace di atas telinganya",
    idolAction: "Duduk/berdiri di depan, melirik ke atas atau ke samping sambil lipat tangan manis",
    cueId: "Kak, aku numpang taruh dagu di kepala kamu ya, sambil pasang kuping kelinci!",
    cueJp: "頭にあご乗せてうさ耳ポーズさせてください！",
    description: "Pose menggemaskan yang menonjolkan perbedaan tinggi badan antara fans dan oshi."
  },
  {
    id: "cute-02-hoppe-frame",
    title: "Dagu di Kepala & Topang Pipi",
    titleJp: "あごのせ・ほっぺフレーム (Ago-nose Hoppe)",
    mode: "cute",
    sop: "safe",
    image: "assets/poses/cute/pose_13_1020769071790339046.jpg",
    diagramType: "chin-flower",
    fanAction: "Duduk di depan sambil kedua tangan menopang pipi tersenyum lebar",
    idolAction: "Berdiri di belakang menumpu dagu di atas kepala kamu dengan senyuman manis",
    cueId: "Kak, tolong tumpu dagumu di kepalaku ya! Aku yang pasang muka bunga mekar.",
    cueJp: "頭の上にあご乗せて、私はほっぺに手を当てます！",
    description: "Komposisi vertikal bertingkat yang sangat fotogenik dan bikin wajah berdua tampak dekat & kompak."
  },
  {
    id: "cute-03-finger-viewfinder",
    title: "Bingkai Jari Kamera (Viewfinder)",
    titleJp: "指フレーム・ファインダー (Finger Frame)",
    mode: "cute",
    sop: "safe",
    image: "assets/poses/cute/pose_14_833025262370796074.jpg",
    diagramType: "gyaru-peace",
    fanAction: "Bentuk huruf L dengan jempol & telunjuk tangan kanan di atas",
    idolAction: "Bentuk huruf L dengan jempol & telunjuk tangan kiri di bawah menyatu jadi bingkai",
    cueId: "Kak, yuk bikin kotak bingkai foto dari jari kita berdua!",
    cueJp: "指で四角いカメラフレーム作りましょう！",
    description: "Membingkai kedua wajah dalam satu viewfinder imajiner, estetik ala street style Tokyo."
  },
  {
    id: "cute-04-perspective-heart",
    title: "Hati Perspektif Kamera (3D Heart)",
    titleJp: "立体パースハート (3D Perspective Heart)",
    mode: "cute",
    sop: "safe",
    image: "assets/poses/cute/pose_15_710724384979487138.jpg",
    diagramType: "half-heart",
    fanAction: "Majukan tangan kiri membentuk lengkungan hati raksasa ke arah lensa kamera",
    idolAction: "Majukan tangan kanan melengkapi lengkungan hati mendekati lensa kamera",
    cueId: "Kak, bikin hati yang dideketin banget ke lensa kamera biar 3D ya!",
    cueJp: "カメラに近づけて大きい立体ハート作りましょう！",
    description: "Tren pose Chika Idol Jepang! Efek perspektif membuat tangan membentuk hati besar di depan lensa."
  },
  {
    id: "cute-05-friendzone-heart",
    title: "Setengah Hati Dibalas Jempol",
    titleJp: "片ハートとサムズアップ (Kata-haato & Thumbs Up)",
    mode: "cute",
    sop: "safe",
    image: "assets/poses/cute/pose_16_1019080221911222157.jpg",
    diagramType: "half-heart",
    fanAction: "Bentuk setengah hati dengan tangan penuh harapan cinta",
    idolAction: "Balas dengan acungan jempol (thumbs up 👍) sambil senyum santai",
    cueId: "Kak, aku bikin setengah hati, tapi kamu bales jempol ya biar kena friendzone lucu haha!",
    cueJp: "私がハート作るんで、グッドサイン👍で返してください！",
    description: "Meme legendaris yang manis sekaligus kocak. Menunjukkan keakraban santai antara wota dan oshi."
  },
  {
    id: "cute-06-police-arrest",
    title: "Ditangkap Polisi Cantik (Kena Tilang)",
    titleJp: "婦警さんと容疑者 (Taiho Pose)",
    mode: "cute",
    sop: "close",
    image: "assets/poses/cute/pose_17_1040401951449816825.jpg",
    diagramType: "bodyguard",
    fanAction: "Pose merapat manja / pura-pura kiss dari samping",
    idolAction: "Pasang tangan menahan dada/leher fans dengan tatapan tegas 'Dilarang Melintas!'",
    cueId: "Kak, ceritanya kamu polisi yang nahan aku karena kecanduan kecantikanmu!",
    cueJp: "逮捕ポーズ！私を止める婦警さんでお願いします！",
    description: "Pose roleplay manis yang sangat populer di event cosplay dan bilik cheki berpartisi."
  },
  {
    id: "cute-07-ago-kui",
    title: "Angkat Dagu Mesra (Ago-Kui Subculture)",
    titleJp: "至近距離あごクイ (Chikin Ago-kui)",
    mode: "cute",
    sop: "close",
    image: "assets/poses/cute/pose_19_989103136932738787.jpg",
    diagramType: "sweet-gaze",
    fanAction: "Dekatkan wajah ke samping oshi dengan tatapan terpesona",
    idolAction: "Dua jari mengangkat dagu fans dengan tatapan tajam memikat (jirai-kei style)",
    cueId: "Kak, pose angkat dagu dong! Biar serasa di drama anime!",
    cueJp: "あごクイポーズでドキドキさせてください！",
    description: "Gaya khas Jirai-kei & subculture idol. Dijamin bikin detak jantung kamu berdegup kencang!"
  },

  // ==========================================
  // 2. FUN MODE (4 Foto Analisis Google Drive)
  // ==========================================
  {
    id: "fun-01-hiphop-swagger",
    title: "Hip-Hop Swagger & Namaste",
    titleJp: "レンズ手前スワッグ (Lens Swagger)",
    mode: "fun",
    sop: "safe",
    image: "assets/poses/fun/pose_04_817051557432495134.jpg",
    diagramType: "fistbump",
    fanAction: "Tangan terbuka lebar didorong maju ke depan lensa kamera ala rapper",
    idolAction: "Di belakang merapatkan kedua telapak tangan (pose salam/namaste) dengan gaya swag",
    cueId: "Kak, pose rapper hip-hop ya! Dorong tangan ke kamera!",
    cueJp: "ヒップホップ風に手をレンズに突き出して！",
    description: "Gaya anak hip-hop jalanan yang sangat keren dengan efek lensa sudut lebar."
  },
  {
    id: "fun-02-rush-hour",
    title: "Kung-Fu Buddy Cop (Rush Hour)",
    titleJp: "カンフーバディ・背中合わせ (Rush Hour)",
    mode: "fun",
    sop: "safe",
    image: "assets/poses/fun/pose_05_581879214354665973.jpg",
    diagramType: "back-to-back",
    fanAction: "Berdiri punggung-punggungan, tinju kanan diluruskan ke depan siap hantam",
    idolAction: "Punggung-punggungan dengan fans, pasang kuda-kuda tinju kung-fu Jackie Chan",
    cueId: "Kak, kita partner detektif laga Rush Hour Jackie Chan ya! Punggung-punggungan tinju!",
    cueJp: "映画ラッシュアワー風！背中合わせでカンフーパンチ！",
    description: "Gaya partner laga legendaris Jackie Chan & Chris Tucker. Keren, berwibawa, dan sangat dinamis!"
  },
  {
    id: "fun-03-fisheye-reach",
    title: "Sudut Atas Lensa Lebar 0.5x (Fisheye Reach)",
    titleJp: "広角上アングル・手伸ばし (0.5x Fisheye)",
    mode: "fun",
    sop: "safe",
    image: "assets/poses/fun/pose_07_1034842820655989192.jpg",
    diagramType: "air-highfive",
    fanAction: "Berdiri mendongak ke atas, satu telapak tangan diangkat tinggi ke arah kamera",
    idolAction: "Mendongak ke atas, satu tangan menjulur ke kamera sambil kedip mata (wink)",
    cueId: "Kak, minta staf kameranya foto dari atas ya, kita ulurkan tangan ke atas!",
    cueJp: "上からのアングルでカメラに手を伸ばしましょう！",
    description: "Tren foto gen-Z 0.5x ultra-wide angle yang bikin tubuh terlihat ramping dan estetik."
  },
  {
    id: "fun-04-cyberpunk-overhead",
    title: "Tatap Langit Cyber Punk (Overhead Look)",
    titleJp: "見上げクール・サイバーパンク (Overhead Look)",
    mode: "fun",
    sop: "safe",
    image: "assets/poses/fun/pose_18_722053752809024929.jpg",
    diagramType: "back-to-back",
    fanAction: "Berdiri tegap bahu sejajar, wajah mendongak menatap tajam ke lensa kamera di atas",
    idolAction: "Berdiri di samping, tatapan fierce menembus lensa kamera dari sudut atas",
    cueId: "Kak, kita tatap kamera dari sudut atas ya, pasang muka model majalah!",
    cueJp: "真上から見下ろすアングルで、クールに見上げましょう！",
    description: "Sudut kamera bird's-eye view yang menampilkan aura visual model papan atas."
  },

  // ==========================================
  // 3. RANDOM MEME MODE (8 Foto Analisis Drive)
  // ==========================================
  {
    id: "meme-01-will-smith",
    title: "Pamer Oshi Kebanggaan (Will Smith Meme)",
    titleJp: "推し紹介ミーム・ウィル・スミス (Will Smith Flex)",
    mode: "meme",
    sop: "safe",
    image: "assets/poses/meme/pose_01_303148618688828087.jpg",
    diagramType: "spiderman",
    fanAction: "Bungkukkan badan ke samping sambil kedua tangan menunjuk megah ke arah oshi",
    idolAction: "Berdiri tegak santai dengan kedua tangan di belakang kepala (pose Willem Dafoe)",
    cueId: "Kak, kamu pasang gaya sombong ya, aku jadi Will Smith yang pamerin kamu!",
    cueJp: "ウィル・スミスが妻を紹介するミームポーズで！",
    description: "Meme legendaris red carpet Will Smith memperkenalkan oshi tercinta ke seisi dunia!"
  },
  {
    id: "meme-02-who-me",
    title: "Lho, Aku?! Tunjuk Bingung (Who, Me? Meme)",
    titleJp: "えっ僕？！指差しミーム (Who Me Meme)",
    mode: "meme",
    sop: "safe",
    image: "assets/poses/meme/pose_02_981503312574337152.jpg",
    diagramType: "spiderman",
    fanAction: "Di belakang dengan ekspresi melongo kaget, satu tangan menunjuk dada sendiri",
    idolAction: "Di depan tersenyum geli sambil menunjuk jempol ke arah kamu di belakang",
    cueId: "Kak, kamu tunjuk aku pakai jempol, aku pasang muka kaget 'Lho, aku?!'",
    cueJp: "「えっ、私？！」って驚いてるミームで！",
    description: "Meme reaksi kebingungan spontan yang selalu mengundang gelak tawa staf cheki."
  },
  {
    id: "meme-03-headblock-punch",
    title: "Tahan Kepala Tinju Angin (Little Reach Punch)",
    titleJp: "頭押さえ・届かないパンチ (Head Block Punch)",
    mode: "meme",
    sop: "safe",
    image: "assets/poses/meme/pose_03_1034842820655989193.jpg",
    diagramType: "janken",
    fanAction: "Luruskan satu tangan menahan kening oshi sambil ketawa buang muka",
    idolAction: "Pura-pura mengayunkan tinju berkali-kali tapi tangannya tidak sampai ke kamu",
    cueId: "Kak, aku tahan kening kamu ya, kamu pura-pura mau mukul tapi gak nyampe!",
    cueJp: "頭を押さえられてパンチが届かないアニメポーズ！",
    description: "Gerakan kartun slapstick klasik Tom & Jerry atau anime pertarungan kocak."
  },
  {
    id: "meme-04-double-heart-chaos",
    title: "Love Kuadrat Tangan & Kaki (Full Body Heart)",
    titleJp: "全身ハートミーム・手と足 (Extreme Double Heart)",
    mode: "meme",
    sop: "safe",
    image: "assets/poses/meme/pose_06_814377545146567367.jpg",
    diagramType: "half-heart",
    fanAction: "Tangan atas bikin setengah hati, angkat satu kaki membentuk lengkungan hati di bawah",
    idolAction: "Tangan atas melengkapi hati, kaki bawah ditekuk melengkapi hati bawah",
    cueId: "Kak, yuk bikin love pakai tangan sekaligus pakai kaki melengkung!",
    cueJp: "手でもハート、足でもハート作るカオスなポーズ！",
    description: "Meme legendaris netizen India! Hati dobel dari ujung kepala hingga ujung kaki."
  },
  {
    id: "meme-05-titanic-flying",
    title: "Titanic I'm Flying (Pose Jack & Rose)",
    titleJp: "タイタニック・飛んでるミーム (Titanic Flying)",
    mode: "meme",
    sop: "close",
    image: "assets/poses/meme/pose_08_358739926580442096.jpg",
    diagramType: "back-to-back",
    fanAction: "Berdiri di belakang memegang pinggang oshi (jarak aman / no touch)",
    idolAction: "Di depan merentangkan kedua tangan lebar-lebar ke samping sambil angkat satu kaki",
    cueId: "Kak, pose Titanic ya: 'I'm flying, Jack!' Rentangkan tangan!",
    cueJp: "タイタニックごっこ！両手を広げて飛んでるポーズ！",
    description: "Adegan kapal Titanic paling ikonik dalam sejarah perfilman dunia."
  },
  {
    id: "meme-06-office-handshake",
    title: "Jabat Tangan Canggung (Young Michael Scott)",
    titleJp: "若きマイケル・気まずい握手 (Awkward Handshake)",
    mode: "meme",
    sop: "safe",
    image: "assets/poses/meme/pose_09_1125055550641462163.jpg",
    diagramType: "fistbump",
    fanAction: "Pasang muka canggung/datar menatap lurus kamera sambil jabat tangan",
    idolAction: "Tersenyum formal layaknya bos perusahaan memberi penghargaan karyawan",
    cueId: "Kak, kita pose meme The Office ya! Jabat tangan tapi muka aku canggung banget!",
    cueJp: "ジ・オフィスの気まずい握手ミームで！",
    description: "Meme sejuta umat serial komedi The Office yang sangat sering dipakai di Twitter/X."
  },
  {
    id: "meme-07-angel-rebel",
    title: "Malaikat Saleh vs Malaikat Rusuh",
    titleJp: "天使といたずら天使 (Angel & Rebel)",
    mode: "meme",
    sop: "safe",
    image: "assets/poses/meme/pose_10_924082417316204325.jpg",
    diagramType: "angel-wings",
    fanAction: "Tangkupkan dua tangan berdoa dengan wajah khusyuk dan suci",
    idolAction: "Pasang wajah jail/tertawa nakal sambil pose peace ganda atau jari jail",
    cueId: "Kak, kamu jadi malaikat rusuh/nakal ya, aku jadi malaikat alim yang berdoa!",
    cueJp: "お祈りする良い天使と、暴れるいたずら天使で！",
    description: "Kontras kepribadian yang super lucu antara si alim dan si pembuat onar."
  },
  {
    id: "meme-08-begging-forgiveness",
    title: "Ampun Oshi! Sujud Minta Maaf (Ear Plug)",
    titleJp: "ごめんなさい！耳塞ぎミーム (Begging Fan)",
    mode: "meme",
    sop: "safe",
    image: "assets/poses/meme/pose_11_1145814330208344155.jpg",
    diagramType: "crying-fan",
    fanAction: "Berlutut / setengah jongkok menangkupkan tangan memelas minta ampun",
    idolAction: "Berdiri tegak menutup kedua telinga dengan jari telunjuk sambil cemberut jutek",
    cueId: "Kak, ceritanya aku ketahuan oshi-hen terus minta ampun, kamu tutup telinga ya!",
    cueJp: "浮気がバレて土下座するファンと、耳を塞ぐ推しメンで！",
    description: "Sandiwara wota ketahuan selingkuh nonton member lain. Lucu dan pasti bikin idol tertawa lepas!"
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
