export const dummySongs = [
    {id: 1, title: "ETA", artist: "NewJeans" },
    {id: 2, title: "Super Shy", artist: "NewJeans" },
    {id: 3, title: "Seven", artist: "Jung Kook" },
    {id: 4, title: "Get a Guitar", artist: "RIIZE" },
    {id: 5, title: "Spicy", artist: "aespa" },
  ];
  
export const dummyChart = [
  { id: 1, 
    title: "ETA", 
    artist: "NewJeans", 
    album: "Get Up",
    cover: "/images/cover1.jpg", 
    lyrics: "임시 가사 1번", 
    info: "발매일: 2023년 | 앨범: Get Up | 아티스트: 뉴진스 | 장르: 볼티모어 클럽, 얼터너티브/인디, POP",
  },

  { id: 2, 
    title: "Super Shy", 
    artist: "NewJeans" , 
    album: "Get Up",
    cover: "/images/cover2.jpg", 
    lyrics: "임시 가사 2번", 
    info: "발매일: 2023년 | 앨범: Get Up | 아티스트: 뉴진스 | 장르: 저지 클럽, 리퀴드 펑크, 얼터너티브/인디, POP",
  },

  { id: 3, 
    title: "Seven", 
    artist: "Jung Kook", 
    album: "Seven (Weekend Ver.)",
    cover: "/images/cover3.jpg", 
    lyrics: "임시 가사 3번", 
    info: "앨범: Seven (Weekend Ver.) | 아티스트: 정국 | 발매일: 2023년 | 장르: R&B/Soul, 한국 댄스/일렉트로닉, POP, K팝, 힙합/랩",
  },

  { id: 4, 
    title: "Get a Guitar", 
    artist: "RIIZE", 
    album: "iScreaM Vol.28 : Get A Guitar Remixes",
    cover: "/images/cover4.jpg", 
    lyrics: "임시 가사 4번", 
    info: "앨범: iScreaM Vol.28 : Get A Guitar Remixes | 아티스트: 라이즈 | 발매일: 2023년 | 장르: 한국 댄스/일렉트로닉, K팝",
  },

  { id: 5, 
    title: "Spicy", 
    artist: "aespa", 
    album: "MY WORLD",
    cover: "/images/cover5.jpg", 
    lyrics: "임시 가사 5번", 
    info: "앨범: MY WORLD | 발매일: 2023년 | 아티스트: aespa | 장르: 한국 댄스/일렉트로닉, K팝",
  },
]
export const samplePlaylists = [
  {
    id: 1,
    name: "플레이리스트 1",
    description: "설명 1",
    tracks: [
      { id: 101, trackName: "좋은날", artistName: "아이유", albumName: "Real", imageUrl: "URL1", previewUrl: "PREVIEW1" },
      { id: 102, trackName: "Ditto", artistName: "NewJeans", albumName: "OMG", imageUrl: "URL2", previewUrl: "PREVIEW2" },
    ],
  },
  {
    id: 2,
    name: "플레이리스트 2",
    description: "설명 2",
    tracks: [
      { id: 201, trackName: "Dynamite", artistName: "BTS", albumName: "BE", imageUrl: "URL3", previewUrl: "PREVIEW3" },
    ],
  },
];
