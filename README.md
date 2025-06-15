# dmu_sound 🎧

![dmu_sound Banner](https://capsule-render.vercel.app/api?type=waving&color=0:89CFF0,100:FFB6C1&height=300&section=header&text=dmu_sound&fontSize=70&fontColor=FFFFFF)

## 프로젝트 개요

사용자의 주변 음악이나 흥얼거림을 인식하여, 해당 음악 정보를 기반으로 YouTube 영상 및 Spotify 트랙을 제공하는 웹 애플리케이션입니다.
![프로젝트 개요](./images/1.png)

---

## 경쟁분석
![경쟁분석](./images/2.png)

---

## 프로젝트 목표
![프로젝트 목표](./images/2.png)

---

## 시스템 구성도
![시스템 구성도](./images/5.png)

## ERD
![ERD 다이어그램](./images/6.png)

---

## 팀 멤버 소개

| **이름** | **역할** |
|:--------:|:--------:|
| 황주석 | 프론트엔드 개발, UI/UX 디자인, API 연동 |
| 팀원 A | 백엔드 구조 설계, API 연동 |
| 팀원 B | 기획 및 발표 자료 제작 |

---

## 개발 환경

- **Frontend**: <img src="https://img.shields.io/badge/HTML-E34F26?style=flat&logo=html5&logoColor=white"/> <img src="https://img.shields.io/badge/CSS-1572B6?style=flat&logo=css3&logoColor=white"/> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black"/>
- **API**: <img src="https://img.shields.io/badge/ACRCloud-000000?style=flat&logo=&logoColor=white"/> <img src="https://img.shields.io/badge/YouTube-FF0000?style=flat&logo=youtube&logoColor=white"/> <img src="https://img.shields.io/badge/Spotify-1DB954?style=flat&logo=spotify&logoColor=white"/>
- **디자인**: <img src="https://img.shields.io/badge/Figma-F24E1E?style=flat&logo=figma&logoColor=white"/>
- **협업 툴**: <img src="https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white"/> <img src="https://img.shields.io/badge/Notion-000000?style=flat&logo=notion&logoColor=white"/>

---

## 주요 기능

- 🎙️ **음악 인식**: ACRCloud API를 활용하여 주변 음악 및 사용자 흥얼거림 인식
- 🔍 **YouTube 검색**: 인식된 음악 키워드로 관련 영상 검색 및 추천
- 🎵 **Spotify 검색**: 아티스트, 앨범, 곡 정보 제공
- 📄 **디자인 시안**: Figma로 전체 와이어프레임 및 화면 설계

---

## 프로젝트 구조

```plaintext
dmu_sound/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── acrcloud.js
│   ├── spotify.js
│   └── youtube.js
├── ppt_images/
│   ├── system_diagram.png
│   ├── erd_diagram_1.png
│   └── erd_diagram_2.png
└── README.md
