# dmu_sound 🎧

**ACRCloud, YouTube API, Spotify API를 활용한 음악 검색 및 추천 웹 애플리케이션**

---

## 📌 프로젝트 소개

**dmu_sound**는 사용자가 들려주는 음악을 인식하고, 이를 기반으로 관련 유튜브 영상 및 스포티파이 정보를 제공하는 웹 애플리케이션입니다.  
ACRCloud API를 통해 음악을 분석하고, YouTube와 Spotify API를 통해 사용자에게 음악 정보를 시각적으로 제공합니다.

---

## 🛠️ 주요 기능

- 🎙️ **음악 인식**: ACRCloud API를 통해 주변 음악을 인식
- 🔎 **YouTube 검색**: 인식된 음악 제목으로 관련 유튜브 영상 검색 및 재생
- 🎵 **Spotify 검색**: 곡 정보 기반 Spotify 트랙 및 아티스트 정보 표시
- 💡 **반응형 UI**: 다양한 화면 크기에 대응하는 직관적인 디자인

---

## 📂 기술 스택

| 구분       | 기술                                                  |
|------------|-------------------------------------------------------|
| Frontend   | HTML, CSS, JavaScript, Bootstrap (또는 React 등 사용 시 기입) |
| Backend    | 없음 (API 연동 중심의 클라이언트 측 구현)             |
| API        | ACRCloud API, YouTube Data API v3, Spotify Web API   |
| 협업 도구  | GitHub, Figma (디자인), Notion (기획) 등              |

---

## 📸 주요 화면

> 👉 여기에 주요 기능을 보여주는 스크린샷이나 Figma 시안 이미지 삽입 (예: `/images/main.png`)

---

## 🧑‍💻 팀원 소개

| 이름       | 역할                |
|------------|---------------------|
| 황주석     | 프론트엔드 개발 / API 연동 / UI 설계 |
| ...        | ...                 |

---

## 🗂️ 프로젝트 구조

```plaintext
dmu_sound/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── main.js
│   ├── acrcloud.js
│   └── spotify.js
├── images/
│   └── ...
└── README.md
