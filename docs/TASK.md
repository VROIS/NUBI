# 📋 개발 태스크 (TASK.md)

## 현재 상태

- **백엔드:** 완료 (데이터 파이프라인, API 엔드포인트)
- **프론트엔드:** 기본 UI 완료 (4탭 네비게이션)
- **문제점:** 앱 정체성 불명확, 성능 이슈

---

## Phase 1: MVP 핵심 기능 (현재)

### 1.1 사용자 입력 시스템 ⬜ 미완료

| 태스크 | 상태 | 설명 |
|--------|------|------|
| 온보딩 플로우 설계 | ⬜ | 프로필 → 그룹 → 취향 → 일정 |
| 프로필 입력 화면 | ⬜ | 나이대, 성별, 여행스타일 |
| 그룹 선택 화면 | ⬜ | 혼자/커플/가족/단체 |
| 취향 선택 화면 | ⬜ | 음식/액티비티/분위기/페이스 |
| 일정 입력 화면 | ⬜ | 목적지, 날짜, 예산 |

### 1.2 Vibe Score 표시 ⬜ 미완료

| 태스크 | 상태 | 설명 |
|--------|------|------|
| 장소 카드에 Vibe 배지 | ⬜ | 8+: 보라, 5-7: 주황, <5: 회색 |
| 점수 상세 뷰 | ⬜ | Vibe/Buzz/Taste 개별 점수 표시 |
| 홈 화면 Vibe 입력 | ⬜ | 오늘의 기분 선택 → AI 추천 |

### 1.3 성능 최적화 ⬜ 미완료

| 태스크 | 상태 | 설명 |
|--------|------|------|
| React.memo 적용 | ⬜ | 불필요한 리렌더링 방지 |
| useMemo/useCallback | ⬜ | 계산 최적화 |
| 이미지 최적화 | ⬜ | expo-image 캐싱 활용 |

### 1.4 데이터 연동 ⬜ 미완료

| 태스크 | 상태 | 설명 |
|--------|------|------|
| Google Maps API 키 설정 | ⬜ | 실제 장소 데이터 연동 |
| OpenWeather API 키 설정 | ⬜ | 날씨 데이터 연동 |
| 샘플 데이터 → 실제 데이터 | ⬜ | API 연동 완료 후 전환 |

---

## 📊 1.4.1 다중 소스 데이터 수집 상세 계획

### 🎯 목표
VibeTrip의 핵심 차별화는 **다중 소스 로우 데이터 기반 신뢰도**입니다.
단순 Google Maps 래퍼가 아닌, 여러 소스를 분석하여 감성(Vibe) 기반 추천을 제공합니다.

---

### 📋 수집 데이터 소스 목록

| 순서 | 소스명 | 데이터 유형 | API/방법 | 우선순위 |
|------|--------|-------------|----------|----------|
| 1 | **Google Places** | 장소 기본정보, 평점, 리뷰, 사진 | Google Places API | 🔴 필수 |
| 2 | **YouTube 검증 채널** | 영상 자막, 타임스탬프, 리뷰 | YouTube Data API v3 | 🔴 필수 |
| 3 | **블로그/리뷰** | 네이버/티스토리/TripAdvisor 리뷰 | Gemini Web Search | 🔴 필수 |
| 4 | **미슐랭 가이드** | 별점, 추천 카테고리 | Gemini Web Search | 🟡 중요 |
| 5 | **날씨/기후** | 현재/예보, 기상 경보 | OpenWeather API | 🟡 중요 |
| 6 | **위기 정보** | 파업, 시위, 교통 장애 | GDELT/NewsAPI + Gemini | 🟡 중요 |
| 7 | **가격 정보** | 입장료, 예상 식사비, 교통비 | Google Places + Gemini | 🟡 중요 |
| 8 | **환율** | 실시간 환율 | Exchange Rate API | 🟢 향후 |
| 9 | **예약 가능성** | OpenTable, Klook 재고 | 각 API | 🟢 향후 |

---

### ⏰ 수집 스케줄

```
┌─────────────────────────────────────────────────────────────────┐
│                    자동 수집 스케줄 (KST 기준)                    │
├─────────────────────────────────────────────────────────────────┤
│  새벽 3:00  │  YouTube 채널 신규 영상 + 자막 수집                │
│  새벽 3:15  │  Gemini Web Search (블로그/미슐랭/TripAdvisor)    │
│  새벽 3:30  │  위기 정보 수집 (파업/시위/교통장애)               │
│  새벽 3:45  │  가격 정보 업데이트 (입장료/식사비)                │
│  새벽 4:00  │  환율 정보 업데이트                               │
│  새벽 4:15  │  데이터 정합성 검증 + DB 저장                      │
│  새벽 4:30  │  수집 완료 로그 기록 (타임스탬프)                  │
└─────────────────────────────────────────────────────────────────┘
```

**선택 이유:** 새벽 3시(KST)는 한국 트래픽 최저점 + API 서버 부하 최소

---

### 🔄 처리 파이프라인

#### Step 1: YouTube 검증 채널 데이터
```
[채널 화이트리스트 DB] ← 관리자 대시보드에서 관리
    │
    ├── 🍽️ 맛집 채널: 성시경, 백종원, 최자로드
    ├── 🍷 미식/와인 채널: 비밀이야, 와인 마시는 아톰
    ├── ✈️ 여행 채널: 빠니보틀, 곽튜브, 원지의하루
    ├── 🌍 현지 채널: 파리외노자, CHUNG Haemi, 마키친 등
    └── 👤 사용자 추가 채널: 프로필에서 등록
    │
    ▼
[YouTube Data API v3]
    │
    ├── GET /search (채널 ID + "맛집" OR "여행")
    ├── GET /videos (영상 상세정보)
    └── GET /captions (자막 스크립트)
    │
    ▼
[Gemini AI 분석]
    │
    ├── 자막에서 장소명 추출 (Fuzzy Matching)
    ├── 타임스탬프 매핑 ("삼부자" → 12:30~15:45)
    ├── 감성 분석 (Positive/Negative/Neutral)
    └── 3줄 요약 생성
    │
    ▼
[DB 저장]
    │
    ├── place_id: 장소 연결
    ├── video_url: youtube.com/watch?v=xyz&t=345s
    ├── timestamp_start: 345
    ├── timestamp_end: 480
    ├── sentiment: "positive"
    ├── summary: "성시경이 '인생 국물'이라 극찬"
    └── collected_at: 2026-01-05 03:15:00
```

#### Step 2: Gemini Web Search 다중 소스
```
[Gemini AI - Web Search 모드]
    │
    ├── Query 1: "{장소명} 미슐랭 가이드 평가"
    ├── Query 2: "{장소명} TripAdvisor 리뷰"
    ├── Query 3: "{장소명} 네이버 블로그 후기"
    ├── Query 4: "{장소명} 인스타그램 인기"
    └── Query 5: "{장소명} 최신 영업 상태"
    │
    ▼
[데이터 구조화]
    │
    ├── michelin_rating: "1스타" / "빕구르망" / null
    ├── tripadvisor_rating: 4.5
    ├── blog_mention_count: 152
    ├── instagram_hashtag_count: 12500
    ├── is_open: true
    └── source_urls: [...]
    │
    ▼
[Vibe Score 계산]
    │
    ├── vibe_score: Gemini Vision 분석 결과
    ├── buzz_score: (Google + TripAdvisor + 블로그) / 3
    ├── taste_score: 원어민 리뷰 비율 가중치
    └── reality_penalty: 날씨 + 혼잡도 + 파업 정보
```

#### Step 3: 위기 정보 수집
```
[GDELT/NewsAPI + Gemini]
    │
    ├── 파업 정보: "파리 지하철 파업 2026-01-10"
    ├── 시위 정보: "노란조끼 시위 샹젤리제"
    ├── 날씨 경보: "폭우 경보 01/06 14:00-18:00"
    └── 교통 장애: "에펠탑 인근 도로 통제"
    │
    ▼
[Reality Check 반영]
    │
    ├── 해당 일정에 경고 표시
    ├── 대안 이동수단 제안 (우버/택시)
    └── 일정 자동 조정 옵션 제공
```

#### Step 4: 가격 정보 수집
```
[Google Places + Gemini]
    │
    ├── 입장료: Gemini Web Search
    ├── 식사 예상비: price_level → 금액 변환
    │   ├── $ (1): ~₩15,000
    │   ├── $$ (2): ~₩30,000
    │   ├── $$$ (3): ~₩60,000
    │   └── $$$$ (4): ~₩100,000+
    ├── 교통비: Google Routes API (택시/대중교통)
    └── 환율: Exchange Rate API
    │
    ▼
[일별 합계 계산]
    │
    ├── Day 1: ₩185,000 (약 $138)
    ├── Day 2: ₩142,000 (약 $106)
    └── 총 예상: ₩327,000 (약 $244)
```

---

### 🗄️ DB 스키마 추가 (필요)

```sql
-- YouTube 검증 채널 테이블
CREATE TABLE youtube_channels (
  id SERIAL PRIMARY KEY,
  channel_id VARCHAR(50) UNIQUE NOT NULL,
  channel_name VARCHAR(200) NOT NULL,
  category VARCHAR(50), -- 'mega_influencer', 'local_expert', 'user_added'
  is_active BOOLEAN DEFAULT TRUE,
  added_by VARCHAR(50), -- 'system' or user_id
  created_at TIMESTAMP DEFAULT NOW()
);

-- YouTube 영상-장소 매핑 테이블
CREATE TABLE youtube_place_mentions (
  id SERIAL PRIMARY KEY,
  place_id INTEGER REFERENCES places(id),
  channel_id VARCHAR(50),
  video_id VARCHAR(20) NOT NULL,
  video_title VARCHAR(500),
  timestamp_start INTEGER, -- 초 단위
  timestamp_end INTEGER,
  sentiment VARCHAR(20), -- 'positive', 'negative', 'neutral'
  summary TEXT,
  collected_at TIMESTAMP DEFAULT NOW()
);

-- 다중 소스 데이터 테이블
CREATE TABLE place_external_data (
  id SERIAL PRIMARY KEY,
  place_id INTEGER REFERENCES places(id),
  michelin_rating VARCHAR(20),
  tripadvisor_rating DECIMAL(2,1),
  tripadvisor_review_count INTEGER,
  blog_mention_count INTEGER,
  instagram_hashtag_count INTEGER,
  estimated_price_low INTEGER,
  estimated_price_high INTEGER,
  currency VARCHAR(10) DEFAULT 'KRW',
  source_urls JSONB,
  collected_at TIMESTAMP DEFAULT NOW()
);

-- 위기 정보 테이블
CREATE TABLE crisis_alerts (
  id SERIAL PRIMARY KEY,
  city_id INTEGER REFERENCES cities(id),
  alert_type VARCHAR(50), -- 'strike', 'protest', 'weather', 'traffic'
  title VARCHAR(500),
  description TEXT,
  affected_area VARCHAR(200),
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  severity VARCHAR(20), -- 'low', 'medium', 'high', 'critical'
  alternative_suggestion TEXT,
  collected_at TIMESTAMP DEFAULT NOW()
);

-- 수집 로그 테이블
CREATE TABLE data_collection_logs (
  id SERIAL PRIMARY KEY,
  collection_type VARCHAR(50),
  status VARCHAR(20), -- 'started', 'completed', 'failed'
  items_collected INTEGER,
  error_message TEXT,
  started_at TIMESTAMP,
  completed_at TIMESTAMP
);
```

---

### 📱 UI 표시 계획

#### 장소 카드
```
┌────────────────────────────────────────────┐
│ 🍜 광장시장 육회골목                          │
│ ────────────────────────────────────────── │
│ ⭐ Vibe 8.5  │  📺 유튜버 Pick  │  🌟 빕구르망  │
│ ────────────────────────────────────────── │
│ 💰 예상: ₩15,000~25,000                     │
│ ────────────────────────────────────────── │
│ 📊 데이터 소스: Google, TripAdvisor, 블로그  │
│ 🕐 수집: 2026.01.05 03:15                   │
└────────────────────────────────────────────┘
```

#### 유튜버 Pick 상세
```
┌────────────────────────────────────────────┐
│ ▶️ [YouTube IFrame 임베드]                  │
│    (해당 시점 345초부터 자동 재생)            │
├────────────────────────────────────────────┤
│ 📺 성시경 - 먹을텐데                         │
│ "인생 국물이라고 극찬한 순간" (12:30~15:45)  │
└────────────────────────────────────────────┘
```

#### 일별 예산 합계
```
┌────────────────────────────────────────────┐
│ 📅 Day 1 예산 합계                          │
├────────────────────────────────────────────┤
│ 🎫 경복궁 입장료          ₩3,000           │
│ 🍜 점심 - 광장시장        ₩15,000          │
│ 🚕 택시 이동              ₩8,000           │
│ 🍽️ 저녁 - 명동교자        ₩12,000          │
├────────────────────────────────────────────┤
│ 💰 Day 1 합계: ₩38,000 (약 $28)           │
│ 💹 환율: 1 USD = ₩1,350 (01/05 기준)       │
└────────────────────────────────────────────┘
```

---

### 🛠️ 관리자 대시보드

#### 개요
관리자가 쉽게 데이터 소스를 **추가/수정/삭제**할 수 있는 대시보드.
코드 수정 없이 채널, 블로그, 평가 소스를 관리할 수 있어야 함.

#### 대시보드 UI 레이아웃
```
┌─────────────────────────────────────────────────────────────┐
│  🛠️ VibeTrip 관리자 대시보드                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📊 수집 현황                                                │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 마지막 수집: 2026.01.05 03:15 KST                        ││
│  │ 수집된 장소: 1,234개  │  연결된 영상: 456개               ││
│  │ 오류: 0건  │  [수동 수집 실행]                            ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  📺 YouTube 채널 관리                      [+ 채널 추가]     │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 카테고리  │  채널명          │  상태   │  액션           ││
│  │─────────────────────────────────────────────────────────││
│  │ 🍽️ 맛집   │  성시경           │  ✅ 활성  │  [수정][삭제]  ││
│  │ 🍽️ 맛집   │  백종원           │  ✅ 활성  │  [수정][삭제]  ││
│  │ 🍽️ 맛집   │  최자로드         │  ✅ 활성  │  [수정][삭제]  ││
│  │ 🍷 미식   │  비밀이야         │  ✅ 활성  │  [수정][삭제]  ││
│  │ 🍷 미식   │  와인 마시는 아톰  │  ✅ 활성  │  [수정][삭제]  ││
│  │ ✈️ 여행   │  빠니보틀         │  ✅ 활성  │  [수정][삭제]  ││
│  │ ✈️ 여행   │  곽튜브           │  ✅ 활성  │  [수정][삭제]  ││
│  │ 🌍 현지   │  파리외노자       │  ✅ 활성  │  [수정][삭제]  ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  📝 블로그/리뷰 소스 관리                   [+ 소스 추가]    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 유형      │  이름             │  상태   │  액션           ││
│  │─────────────────────────────────────────────────────────││
│  │ 🏆 미슐랭  │  Michelin Guide   │  ✅ 활성  │  [수정][삭제]  ││
│  │ ⭐ 리뷰   │  TripAdvisor      │  ✅ 활성  │  [수정][삭제]  ││
│  │ 📰 블로그  │  네이버 블로그     │  ✅ 활성  │  [수정][삭제]  ││
│  │ 📸 SNS    │  Instagram        │  ✅ 활성  │  [수정][삭제]  ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ⚙️ 수집 설정                                                │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 자동 수집 시간: [03:00] KST                              ││
│  │ 수집 주기: [매일 ▼]                                      ││
│  │ 데이터 보관 기간: [30일 ▼]                                ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 채널 추가 모달
```
┌─────────────────────────────────────────┐
│  📺 YouTube 채널 추가                    │
├─────────────────────────────────────────┤
│  채널 URL 또는 ID:                       │
│  ┌─────────────────────────────────────┐│
│  │ https://youtube.com/@secret_food    ││
│  └─────────────────────────────────────┘│
│                                         │
│  채널명: [자동 입력됨]                   │
│  카테고리: [맛집 ▼]                      │
│                                         │
│  [취소]                    [추가]       │
└─────────────────────────────────────────┘
```

#### 채널 카테고리
| 카테고리 | 코드 | 설명 |
|---------|------|------|
| 🍽️ 맛집 | `food` | 일반 맛집 리뷰 (성시경, 백종원) |
| 🍷 미식/와인 | `gourmet` | 고급 미식, 와인 페어링 (비밀이야, 와인 마시는 아톰) |
| ✈️ 여행 | `travel` | 여행 브이로그 (빠니보틀, 곽튜브) |
| 🌍 현지 | `local` | 현지 거주자/전문가 (파리외노자) |
| 👤 사용자 | `user_added` | 사용자가 직접 추가한 채널 |

#### 기본 등록 채널 목록 (시드 데이터)

| 카테고리 | 채널명 | YouTube ID | 구독자 |
|---------|--------|------------|--------|
| 🍽️ 맛집 | 성시경 (먹을텐데) | @sikifoods | 400만+ |
| 🍽️ 맛집 | 백종원 | @paboriver | 600만+ |
| 🍽️ 맛집 | 최자로드 | @choizaroad | 100만+ |
| 🍷 미식 | 비밀이야 | @secretfood | 50만+ |
| 🍷 미식 | 와인 마시는 아톰 | @wineatom | 30만+ |
| ✈️ 여행 | 빠니보틀 | @panibottle | 400만+ |
| ✈️ 여행 | 곽튜브 | @kwaktube | 300만+ |
| ✈️ 여행 | 원지의하루 | @wonjisday | 150만+ |
| 🌍 현지 | 파리외노자 | @parisonenoza | 20만+ |
| 🌍 현지 | CHUNG Haemi | @chunghaemi | 10만+ |
| 🌍 현지 | 마키친 | @makitchen | 15만+ |

#### 관리자 API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/admin/channels` | 채널 목록 조회 |
| POST | `/api/admin/channels` | 채널 추가 |
| PUT | `/api/admin/channels/:id` | 채널 수정 |
| DELETE | `/api/admin/channels/:id` | 채널 삭제 |
| GET | `/api/admin/sources` | 블로그/리뷰 소스 목록 |
| POST | `/api/admin/sources` | 소스 추가 |
| PUT | `/api/admin/sources/:id` | 소스 수정 |
| DELETE | `/api/admin/sources/:id` | 소스 삭제 |
| GET | `/api/admin/collection/status` | 수집 현황 조회 |
| POST | `/api/admin/collection/run` | 수동 수집 실행 |
| PUT | `/api/admin/collection/settings` | 수집 설정 변경 |

#### 접근 방식
- **옵션 A**: 프로필 화면 내 "관리자" 섹션 (간단)
- **옵션 B**: 별도 관리자 화면 (탭 또는 모달)
- **옵션 C**: 웹 대시보드 (Express 서버에서 제공)

**권장: 옵션 A** - 프로필 화면에 "데이터 소스 관리" 버튼 추가

---

### 🔑 필요한 API 키

| API | 환경변수명 | 무료 한도 | 비용 |
|-----|-----------|----------|------|
| Google Places | `Google_maps_api_key` | $200/월 크레딧 | 유료 |
| YouTube Data | `YOUTUBE_DATA_API_KEY` | 10,000 쿼터/일 | 무료 |
| OpenWeather | `OPENWEATHER_API_KEY` | 1,000 콜/일 | 무료 |
| Exchange Rate | `EXCHANGE_RATE_API_KEY` | 1,500 콜/월 | 무료 |

**Gemini AI**: 이미 연동됨 (`AI_INTEGRATIONS_GEMINI_API_KEY`)

---

### ✅ 구현 순서

| 단계 | 태스크 | 예상 시간 | 의존성 |
|------|--------|----------|--------|
| 1 | DB 스키마 추가 (채널, 외부데이터, 위기정보) | 30분 | 없음 |
| 2 | YouTube 채널 화이트리스트 관리 서비스 | 1시간 | Step 1 |
| 3 | 프로필 화면에 '신뢰 채널 관리' UI | 1시간 | Step 2 |
| 4 | Gemini Web Search 다중 소스 수집 서비스 | 2시간 | Step 1 |
| 5 | YouTube Data API 연동 (자막+타임스탬프) | 2시간 | YouTube API 키 |
| 6 | 가격 정보 수집 + 일별 합계 계산 | 1시간 | Step 4 |
| 7 | 위기 정보 수집 서비스 | 1시간 | Step 4 |
| 8 | 새벽 3시 Cron Job 설정 | 30분 | Step 4-7 |
| 9 | 수집 타임스탬프 UI 표시 | 30분 | Step 8 |
| 10 | [유튜버 Pick] 배지 + 임베드 플레이어 UI | 1시간 | Step 5 |
| 11 | 일별 예산 합계 UI | 30분 | Step 6 |

**총 예상 시간: 약 11시간**

---

## Phase 2: 핵심 AI 기능

### 2.1 AI 추천 엔진

| 태스크 | 상태 | 설명 |
|--------|------|------|
| Gemini Vision 연동 | ✅ | Vibe Score 분석 |
| Taste Verification | ⬜ | 언어 기반 리뷰 분석 |
| 페르소나별 가중치 | ⬜ | 럭셔리/컴포트 차별화 |

### 2.2 동선 최적화

| 태스크 | 상태 | 설명 |
|--------|------|------|
| Google Routes API | ⬜ | 실시간 이동 시간 |
| Time vs Money 옵션 | ⬜ | 대중교통/택시 비교 |
| 지도 오버레이 | ⬜ | 최적 경로 시각화 |

---

## Phase 3: 고급 기능 (향후)

### 3.1 미디어 기능

| 태스크 | 상태 | 설명 |
|--------|------|------|
| 숏폼 미리보기 | ⬜ | 일정 기반 15-30초 영상 |
| 실제 사진/영상 매핑 | ⬜ | 저작권 안전한 콘텐츠 |

### 3.2 예약 자동화

| 태스크 | 상태 | 설명 |
|--------|------|------|
| 결제 시스템 | ⬜ | Stripe 연동 |
| OTA API 연동 | ⬜ | 항공/호텔 예약 |

---

## 우선순위 (협의 필요)

### 🔴 긴급 (이번 세션)
1. 사용자 입력 시스템 설계 및 구현
2. Vibe Score UI 표시
3. 성능 최적화

### 🟡 중요 (다음 단계)
4. API 키 연동
5. Taste Verification 구현
6. 동선 최적화

### 🟢 향후
7. 숏폼 미리보기
8. 예약 자동화

---

## 현재 이슈

| 이슈 | 상태 | 해결방안 |
|------|------|----------|
| 앱 정체성 불명확 | 🔴 | Vibe 입력 + 점수 표시로 차별화 |
| 버튼 반응 느림 | 🔴 | memo, useMemo 적용 |
| API 키 미설정 | 🟡 | 사용자에게 요청 필요 |
| 샘플 데이터만 표시 | 🟡 | API 연동 후 해결 |
