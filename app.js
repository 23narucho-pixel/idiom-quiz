/**
 * =============================================================
 * 1. 파이어베이스(Firebase) 설정 및 초기화
 * =============================================================
 */
// TODO: 사용자님의 파이어베이스 프로젝트 설정값으로 대체해 주세요!
const firebaseConfig = {
  apiKey: "AIzaSyBkkp_1uu2yq_gvIvm4FEu1o7Z6yDm9PPU",
  authDomain: "idiom-quiz-1d21d.firebaseapp.com",
  projectId: "idiom-quiz-1d21d",
  storageBucket: "idiom-quiz-1d21d.firebasestorage.app",
  messagingSenderId: "252362211165",
  appId: "1:252362211165:web:4e56da609b990ffa5032b4",
  measurementId: "G-L8YC96GZZ3"
};

// 파이어베이스가 웹 페이지에 올바르게 로드되었는지 확인하고 초기화 진행
let auth, db;
if (typeof firebase !== 'undefined') {
  try {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
  } catch (error) {
    console.error("Firebase 초기화 에러:", error);
    alert("파이어베이스 설정 초기화 중 오류가 발생했습니다: " + error.message);
  }
} else {
  console.warn("Firebase SDK가 로드되지 않았습니다.");
  alert("구글 파이어베이스 프로그램(SDK)이 브라우저에 로드되지 않았습니다.\n\n인터넷이 불안정하거나 브라우저 캐시가 꼬였을 수 있으니, 창을 완전히 닫고 다시 열거나 강력 새로고침(Ctrl + F5)을 눌러주세요.");
}

/**
 * =============================================================
 * 2. 난이도별 문제 은행 데이터 정의 (상 / 중 / 하 세분화)
 * =============================================================
 */
const quizDataByDifficulty = {
  // 🌱 하 (기본 생활 관용 표현)
  easy: [
    {
      idiom: "발이 넓다",
      question: "다음 중 '아는 사람이 많아 사교 범위가 넓다'를 뜻하는 관용표현은?",
      options: ["손이 크다", "발이 넓다", "귀가 얇다", "낯이 뜨겁다"],
      answer: "발이 넓다",
      meaning: "사교성이 좋아 아는 사람이 많다.",
      example: "삼촌은 발이 넓어서 동네에 모르는 사람이 없다."
    },
    {
      idiom: "귀가 얇다",
      question: "남의 말을 쉽게 믿고 따르는 성격이나 행동을 가리키는 관용표현은?",
      options: ["입이 무겁다", "눈이 높다", "귀가 얇다", "코가 납작해지다"],
      answer: "귀가 얇다",
      meaning: "남의 말을 쉽게 받아들이거나 믿는다.",
      example: "지우는 귀가 얇아서 광고만 보고 물건을 쉽게 사곤 한다."
    },
    {
      idiom: "입이 가볍다",
      question: "비밀을 지키지 못하고 남에게 쉽게 터놓는 행동을 뜻하는 관용표현은?",
      options: ["입이 가볍다", "입이 짧다", "입을 모으다", "입을 다물다"],
      answer: "입이 가볍다",
      meaning: "참을성이 없어 비밀을 쉽게 누설한다.",
      example: "민호는 입이 가벼워서 중요한 이야기를 털어놓기가 조심스럽다."
    },
    {
      idiom: "눈이 높다",
      question: "사물을 선택하거나 바라보는 안목, 기대 수준이 매우 높을 때 쓰는 관용표현은?",
      options: ["눈에 띄다", "눈이 높다", "눈독을 들이다", "눈을 감아주다"],
      answer: "눈이 높다",
      meaning: "안목이나 기대 수준이 높다.",
      example: "지은이는 눈이 높아서 마음에 드는 신발을 찾기 힘들었다."
    },
    {
      idiom: "손이 크다",
      question: "물건을 사거나 음식을 만들 때 아끼지 않고 넉넉하게 준비하는 모습을 뜻하는 관용표현은?",
      options: ["손을 놓다", "손을 씻다", "손이 크다", "손에 땀을 쥐다"],
      answer: "손이 크다",
      meaning: "씀씀이가 크거나 음식을 아낌없이 넉넉하게 만든다.",
      example: "할머니는 손이 크셔서 항상 음식을 푸짐하게 차려주신다."
    },
    {
      idiom: "얼굴이 두껍다",
      question: "뻔뻔스러워서 부끄러운 줄을 모를 때 비유적으로 쓰는 관용표현은?",
      options: ["얼굴이 두껍다", "낯이 뜨겁다", "얼굴을 가리다", "콧대가 높다"],
      answer: "얼굴이 두껍다",
      meaning: "뻔뻔하여 부끄러움을 느끼지 않는다.",
      example: "잘못을 하고도 사과 없이 웃기만 하니 정말 얼굴이 두껍다."
    },
    {
      idiom: "입이 무겁다",
      question: "비밀을 들려주어도 남에게 함부로 말하지 않고 신중한 사람을 이르는 관용표현은?",
      options: ["입이 심심하다", "입이 무겁다", "입을 모으다", "입이 가볍다"],
      answer: "입이 무겁다",
      meaning: "비밀을 지키고 말을 신중하게 한다.",
      example: "유진이는 입이 무거워서 무슨 비밀이든 안심하고 털어놓을 수 있다."
    },
    {
      idiom: "발을 맞추다",
      question: "서로 협력하여 의도나 보조를 같게 한다는 뜻의 관용표현은?",
      options: ["발을 뻗다", "발을 맞추다", "발을 묶다", "발을 동동 구르다"],
      answer: "발을 맞추다",
      meaning: "서로 생각이나 행동을 일치시키다.",
      example: "우리 팀원들은 서로 발을 맞추어 프로젝트를 빠르게 완성했다."
    }
  ],

  // 🌿 중 (보통 실전 관용 표현)
  normal: [
    {
      idiom: "가슴을 치다",
      question: "매우 안타깝거나 원통해서 가슴을 두드리는 행위를 비유한 관용표현은?",
      options: ["가슴을 치다", "가슴을 쓸어내리다", "가슴이 벅차다", "어깨를 겨누다"],
      answer: "가슴을 치다",
      meaning: "매우 안타깝거나 억울하여 탄식하다.",
      example: "아쉬운 실수로 경기에서 지자 감독님은 가슴을 쳤다."
    },
    {
      idiom: "어깨가 가볍다",
      question: "맡았던 무거운 책임을 마치고 마음이 홀가분해질 때 쓰는 관용표현은?",
      options: ["어깨를 비비다", "어깨가 무겁다", "어깨가 가볍다", "어깨를 으쓱하다"],
      answer: "어깨가 가볍다",
      meaning: "부담이나 책임에서 벗어나 마음이 편안하다.",
      example: "시험이 드디어 모두 끝나고 나니 양어깨가 가볍다."
    },
    {
      idiom: "발을 빼다",
      question: "자신이 관여하던 일이나 관계에서 손을 떼고 물러나는 모습을 뜻하는 관용표현은?",
      options: ["발 벗고 나서다", "발을 빼다", "발이 묶이다", "발을 다치다"],
      answer: "발을 빼다",
      meaning: "일이나 관계에서 은근히 물러나다.",
      example: "위험한 소문이 돌기 시작하자 그는 그 사업에서 서둘러 발을 뺐다."
    },
    {
      idiom: "바가지를 쓰다",
      question: "물건이나 서비스를 살 때 터무니없이 비싼 값을 치르는 손해를 가리키는 관용표현은?",
      options: ["바가지를 긁다", "바가지를 쓰다", "바가지를 엎다", "탈을 쓰다"],
      answer: "바가지를 쓰다",
      meaning: "터무니없이 비싼 가격으로 손해를 보다.",
      example: "관광지에서 미리 시세를 확인하지 않아서 바가지를 썼다."
    },
    {
      idiom: "목이 빠지다",
      question: "간절한 마음으로 오랫동안 무언가를 기다릴 때 비유적으로 쓰는 관용표현은?",
      options: ["목을 축이다", "목에 힘을 주다", "목이 빠지다", "목이 메이다"],
      answer: "목이 빠지다",
      meaning: "간절하게 오래 기다리다.",
      example: "택배가 언제 올까 목이 빠지게 대문 앞을 바라보았다."
    },
    {
      idiom: "손을 놓다",
      question: "진행하던 일이나 작업을 중단하고 손을 떼는 상태를 뜻하는 관용표현은?",
      options: ["손을 씻다", "손을 놓다", "손을 벌리다", "손을 잡다"],
      answer: "손을 놓다",
      meaning: "하던 일을 중단하거나 그만두다.",
      example: "너무 힘들어서 한참 동안 공부에서 손을 놓고 있었다."
    },
    {
      idiom: "배가 아프다",
      question: "남이 잘되거나 성공하는 것을 질투하고 시샘할 때 자주 쓰는 관용표현은?",
      options: ["배를 채우다", "배가 아프다", "등을 돌리다", "가슴이 답답하다"],
      answer: "배가 아프다",
      meaning: "남이 잘되는 것을 부러워하고 시기하다.",
      example: "사촌이 땅을 사면 배가 아프다는 옛말이 있다."
    },
    {
      idiom: "발 벗고 나서다",
      question: "남의 어려움을 돕기 위해 적극적으로 앞장서는 모습을 뜻하는 관용표현은?",
      options: ["발 벗고 나서다", "손을 떼다", "배를 불리다", "목을 축이다"],
      answer: "발 벗고 나서다",
      meaning: "적극적으로 해결하기 위해 앞장서다.",
      example: "우리 반 반장은 어려움에 처한 친구를 위해 항상 발 벗고 나선다."
    }
  ],

  // 🔥 상 (심화 및 숙어 표현)
  hard: [
    {
      idiom: "간에 기별도 안 가다",
      question: "음식 양이 너무 적어서 먹었는지도 모를 만큼 모자랄 때 쓰는 관용표현은?",
      options: ["간을 맞추다", "간에 기별도 안 가다", "간이 콩알만 해지다", "입맛을 돋우다"],
      answer: "간에 기별도 안 가다",
      meaning: "먹은 음식의 양이 너무 적어 성에 차지 않는다.",
      example: "과자 한 조각으로는 대식가인 내 간에 기별도 안 간다."
    },
    {
      idiom: "우물 안 개구리",
      question: "넓은 세상의 사정을 전혀 알지 못하고 자기 식견만 고집하는 사람을 뜻하는 말은?",
      options: ["우물 안 개구리", "돌다리도 두드려 건너기", "꿩 대신 닭", "티끌 모아 태산"],
      answer: "우물 안 개구리",
      meaning: "세상 물정을 모르고 시야가 좁은 사람.",
      example: "해외 경험을 쌓고 나니 내가 그동안 우물 안 개구리였음을 깨달았다."
    },
    {
      idiom: "쇠뿔도 단김에 빼라",
      question: "어떤 일을 마음먹었을 때 망설이지 말고 즉시 해치워야 함을 뜻하는 관용 속담은?",
      options: ["등잔 밑이 어둡다", "쇠뿔도 단김에 빼라", "밑 빠진 독에 물 붓기", "누워서 떡 먹기"],
      answer: "쇠뿔도 단김에 빼라",
      meaning: "의욕이 있을 때 즉시 지체 없이 일을 처리하다.",
      example: "공부하기로 마음먹었으니 쇠뿔도 단김에 빼는 격으로 지금 시작하자!"
    },
    {
      idiom: "도루묵이 되다",
      question: "애써 노력한 일이나 성과가 도로 허사가 되어 처음으로 돌아감을 비유하는 관용표현은?",
      options: ["도루묵이 되다", "물 건너가다", "죽이 되다", "판이 깨지다"],
      answer: "도루묵이 되다",
      meaning: "애써 한 일이 도로 헛수고가 되다.",
      example: "열심히 저장하지 않고 컴퓨터를 껐더니 작업이 다 도루묵이 되었다."
    },
    {
      idiom: "눈 가리고 아웅",
      question: "얕은 꾀로 남을 속이려 하지만 속지 않는 뻔한 임시변통을 뜻하는 관용표현은?",
      options: ["눈길을 주다", "눈 가리고 아웅", "눈을 의심하다", "눈앞이 깜깜하다"],
      answer: "눈 가리고 아웅",
      meaning: "얕은 꾀로 남을 속이려 하나 속지 않는 행동.",
      example: "잘못을 감추려고 거짓말을 하는 것은 눈 가리고 아웅하는 격이다."
    },
    {
      idiom: "비 온 뒤에 땅이 굳어진다",
      question: "시련이나 곤란을 겪은 후에 기반이나 관계가 더 단단해짐을 비유하는 말은?",
      options: ["비 온 뒤에 땅이 굳어진다", "가랑비에 옷 젖는다", "소 읽고 외양간 고친다", "하늘이 무너져도 솟아날 구멍이 있다"],
      answer: "비 온 뒤에 땅이 굳어진다",
      meaning: "어려움을 겪은 뒤 더욱 견고해진다.",
      example: "친구와 크게 다투었지만 서로 사과하고 나니 비 온 뒤 땅이 굳어지듯 더 친해졌다."
    },
    {
      idiom: "가랑비에 옷 젖는 줄 모른다",
      question: "작은 일이라도 계속 반복되면 무시하지 못할 큰 결과나 손실이 됨을 경고하는 말은?",
      options: ["가랑비에 옷 젖는 줄 모른다", "바람 따라 돛을 단다", "우물 가서 숭늉 찾는다", "돌다리도 두드려 본다"],
      answer: "가랑비에 옷 젖는 줄 모른다",
      meaning: "사소한 지출이나 방심이 쌓여 큰 손실이 됨을 이른다.",
      example: "매일 과자 값으로 쓴 소액이 모여 가랑비에 옷 젖듯 큰 돈이 되었다."
    },
    {
      idiom: "비행기를 태우다",
      question: "남을 지나치게 칭찬하여 들뜨게 만들 때 쓰는 관용표현은?",
      options: ["콧대를 높이다", "바람을 넣다", "비행기를 태우다", "어깨를 으쓱하다"],
      answer: "비행기를 태우다",
      meaning: "남을 과하게 칭찬하여 우쭐하게 만든다.",
      example: "너무 비행기 태우지 마세요, 제가 정말 쑥스러워요."
    }
  ]
};

/**
 * =============================================================
 * 3. 전역 상태 및 게임 변수 정의
 * =============================================================
 */
let selectedDifficulty = 'easy'; // 선택된 난이도 ('easy' | 'normal' | 'hard')
let currentQuizSet = []; // 이번 퀴즈 세트 (무작위 5문항)
let currentQuestionIndex = 0; // 현재 진행 중인 문제 인덱스 (0 ~ 4)
let score = 0; // 맞힌 개수 기반 점수
let userSelections = []; // 사용자가 풀이한 정/오답 기록 저장용 배열
let currentUser = null; // 로그인된 사용자 객체 정보 저장

/**
 * =============================================================
 * 4. 헬퍼 함수 (셔플 알고리즘)
 * =============================================================
 */
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * =============================================================
 * 5. 화면 전환 제어 함수
 * =============================================================
 */
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });

  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add('active');
  }
}

/**
 * =============================================================
 * 6. 파이어베이스 인증 (Authentication) 및 사용자 관리
 * =============================================================
 */

// 구글 로그인 팝업 호출
function loginWithGoogle() {
  if (!auth) return alert("파이어베이스 설정이 완료되지 않았습니다.");
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(result => {
      console.log("로그인 성공:", result.user.displayName);
    })
    .catch(error => {
      console.error("로그인 실패:", error.message);
      alert("로그인 도중 문제가 발생했습니다: " + error.message);
    });
}

// 로그아웃 처리
function logout() {
  if (!auth) return;
  auth.signOut().then(() => {
    console.log("로그아웃 성공");
  });
}

// 사용자 로그인 인증 상태 변경 실시간 감시자(Observer)
function setupAuthObserver() {
  if (!auth) return;
  auth.onAuthStateChanged(user => {
    const userInfoBox = document.getElementById('user-info');
    const loginBox = document.getElementById('login-box');
    const btnAdminLink = document.getElementById('btn-admin-link');
    const diffContainer = document.getElementById('difficulty-container');
    const quizStartGroup = document.getElementById('quiz-start-group');
    
    if (user) {
      // 1. 로그인 성공 시 -> 프로필, 난이도 선택 카드, 시작 버튼 노출!
      currentUser = user;
      userInfoBox.classList.remove('hidden');
      loginBox.classList.add('hidden');
      
      if (diffContainer) diffContainer.classList.remove('hidden');
      if (quizStartGroup) quizStartGroup.classList.remove('hidden');
      
      // 프로필 정보 매칭
      document.getElementById('user-photo').src = user.photoURL || 'https://via.placeholder.com/28';
      document.getElementById('user-name').textContent = user.displayName || '학습자';
      
      // [관리자 계정 감지] 23narucho@gmail.com 단 하나의 메일 계정만 엄격하게 관리자로 승인
      const userEmail = (user.email || '').toLowerCase();
      const isAdmin = (userEmail === "23narucho@gmail.com");
      
      if (isAdmin && btnAdminLink) {
        btnAdminLink.style.display = "inline-flex"; // 관리자면 강제로 표출
      } else if (btnAdminLink) {
        btnAdminLink.style.display = "none"; // 일반 사용자는 강제로 은폐
      }

      loadPastScores(); // 과거 성적 표 로드
    } else {
      // 2. 로그아웃 또는 비로그인 시 -> 로그인 안내 상자만 노출하고 난이도 카드 및 시작 버튼 은폐!
      currentUser = null;
      userInfoBox.classList.add('hidden');
      loginBox.classList.remove('hidden');
      
      if (diffContainer) diffContainer.classList.add('hidden');
      if (quizStartGroup) quizStartGroup.classList.add('hidden');
      
      if (btnAdminLink) {
        btnAdminLink.style.display = "none"; // 로그아웃 시 강제 은폐
      }
    }
  });
}

/**
 * =============================================================
 * 7. 파이어베이스 데이터베이스 (Cloud Firestore) 성적 제어
 * =============================================================
 */

// 퀴즈 결과 점수 및 오답 리스트를 Firestore에 저장
function saveScoreToFirestore(finalScore, selections) {
  if (!db) {
    alert("데이터베이스 연결 실패: 파이어베이스 DB(db)가 연결되지 않아 점수가 저장되지 않습니다.");
    return;
  }
  if (!currentUser) {
    alert("로그인 세션 유실: 로그인된 유저 정보(currentUser)가 확인되지 않아 점수가 저장되지 않습니다.\n\n다시 로그인을 해보시기 바랍니다.");
    return;
  }

  // 맞힌 개수 계산
  const correctCount = selections.filter(item => item.isCorrect).length;
  
  // 저장할 오답 데이터 요약 정리
  const wrongAnswers = selections
    .filter(item => !item.isCorrect)
    .map(item => ({
      idiom: item.idiom,
      selected: item.selected,
      answer: item.answer
    }));

  const diffNameMap = { easy: '🌱 하', normal: '🌿 중', hard: '🔥 상' };
  const currentDiffName = diffNameMap[selectedDifficulty] || '🌱 하';

  // 1. 개인 보관용 성적 데이터 객체
  const personalDocData = {
    score: finalScore,
    correctCount: correctCount,
    difficulty: selectedDifficulty,
    difficultyName: currentDiffName,
    wrongAnswers: wrongAnswers,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };

  // 2. [추가] 교사 관리자용 통합 공용 성적 데이터 객체
  const globalDocData = {
    studentName: currentUser.displayName || '익명 학생',
    studentEmail: currentUser.email || '이메일 정보 없음',
    score: finalScore,
    correctCount: correctCount,
    difficulty: selectedDifficulty,
    difficultyName: currentDiffName,
    wrongAnswers: wrongAnswers,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };

  // [이중 저장 1] 사용자 본인 UID 하위 개인 기록 저장
  db.collection("users")
    .doc(currentUser.uid)
    .collection("scores")
    .add(personalDocData)
    .then(docRef => {
      console.log("개인 성적 DB 저장 완료, ID:", docRef.id);
      loadPastScores(); // 내 과거 기록 표 갱신
    })
    .catch(error => {
      console.error("개인 성적 DB 저장 실패:", error);
      alert("개인 성적 데이터 저장에 실패했습니다:\n" + error.message);
    });

  // [이중 저장 2] 교사용 전체 성적 공용 컬렉션 저장
  db.collection("global_scores")
    .add(globalDocData)
    .then(docRef => {
      console.log("교사용 공용 성적 DB 저장 완료, ID:", docRef.id);
    })
    .catch(error => {
      console.error("교사용 공용 성적 DB 저장 실패:", error);
      alert("교사용 대시보드용 성적 데이터 저장에 실패했습니다:\n" + error.message + "\n\n(파이어베이스 Rules 규칙 설정에서 쓰기 권한이 켜져 있는지 확인해 주세요!)");
    });
}

// 퀴즈 완료 시 과거 이력(최근 5회) 데이터베이스에서 불러오기
function loadPastScores() {
  if (!db || !currentUser) return;

  const historyListContainer = document.getElementById('history-list');
  
  db.collection("users")
    .doc(currentUser.uid)
    .collection("scores")
    .orderBy("timestamp", "desc")
    .limit(5)
    .get()
    .then(querySnapshot => {
      historyListContainer.innerHTML = ''; // 테이블 내용 초기화

      if (querySnapshot.empty) {
        historyListContainer.innerHTML = `
          <tr>
            <td colspan="3" class="table-empty">아직 도전한 기록이 없습니다. 첫 퀴즈를 완료해 보세요!</td>
          </tr>
        `;
        return;
      }

      querySnapshot.forEach(doc => {
        const data = doc.data();
        const dateObj = data.timestamp ? data.timestamp.toDate() : new Date();
        const dateString = dateObj.toLocaleDateString("ko-KR", {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });

        const diffBadgeClass = data.difficulty === 'hard' ? 'badge-diff badge-diff-hard' :
                               (data.difficulty === 'normal' ? 'badge-diff badge-diff-normal' : 'badge-diff badge-diff-easy');
        const diffName = data.difficultyName || '🌱 하';

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${dateString}</td>
          <td><span class="${diffBadgeClass}">${diffName}</span></td>
          <td>${data.correctCount} / 5</td>
          <td><span class="gradient-text" style="font-weight:700;">${data.score}점</span></td>
        `;
        historyListContainer.appendChild(tr);
      });
    })
    .catch(error => {
      console.error("히스토리 로드 실패:", error);
      historyListContainer.innerHTML = `
        <tr>
          <td colspan="4" class="table-empty" style="color:var(--error-color) !important;">
            기록을 불러오지 못했습니다.
          </td>
        </tr>
      `;
    });
}

/**
 * =============================================================
 * 8. 퀴즈 게임 인터랙션 로직
 * =============================================================
 */

// 퀴즈 시작 (선택된 난이도 문제 수급 및 초기화)
function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  userSelections = [];

  const targetBank = quizDataByDifficulty[selectedDifficulty] || quizDataByDifficulty.easy;
  const shuffledBank = shuffleArray(targetBank);
  currentQuizSet = shuffledBank.slice(0, 5);

  renderQuestion();
  showScreen('screen-quiz');
}

// 질문과 보기 렌더링
function renderQuestion() {
  const currentQuestion = currentQuizSet[currentQuestionIndex];
  
  const progressText = document.getElementById('quiz-progress-text');
  const progressFill = document.getElementById('quiz-progress-fill');
  const currentNum = currentQuestionIndex + 1;
  
  progressText.textContent = `${currentNum} / 5`;
  progressFill.style.width = `${(currentNum / 5) * 100}%`;

  document.getElementById('question-number').textContent = `Q${currentNum}.`;
  document.getElementById('quiz-question').textContent = currentQuestion.question;

  const shuffledOptions = shuffleArray(currentQuestion.options);
  const optionsContainer = document.getElementById('quiz-options');
  optionsContainer.innerHTML = '';

  shuffledOptions.forEach((optionText, index) => {
    const button = document.createElement('button');
    button.className = 'option-btn';
    button.innerHTML = `
      <span class="option-num">${index + 1}</span>
      <span class="option-text">${optionText}</span>
    `;

    button.addEventListener('click', () => handleOptionClick(button, optionText, currentQuestion));
    optionsContainer.appendChild(button);
  });
}

// 보기 클릭 처리
function handleOptionClick(selectedButton, selectedText, currentQuestion) {
  const optionsContainer = document.getElementById('quiz-options');
  const buttons = optionsContainer.querySelectorAll('.option-btn');

  buttons.forEach(btn => btn.disabled = true);

  const isCorrect = (selectedText === currentQuestion.answer);

  userSelections.push({
    question: currentQuestion.question,
    idiom: currentQuestion.idiom,
    selected: selectedText,
    answer: currentQuestion.answer,
    meaning: currentQuestion.meaning,
    example: currentQuestion.example,
    isCorrect: isCorrect
  });

  buttons.forEach(btn => {
    const btnTextElement = btn.querySelector('.option-text');
    const btnText = btnTextElement ? btnTextElement.textContent : '';

    if (btnText === currentQuestion.answer) {
      btn.classList.add('selected-correct');
    } else if (btn === selectedButton && !isCorrect) {
      btn.classList.add('selected-incorrect');
    } else {
      btn.classList.add('dimmed');
    }
  });

  if (isCorrect) {
    score += 20;
  }

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < 5) {
      renderQuestion();
    } else {
      showResult();
    }
  }, 800);
}

// 결과 화면 및 오답 노트 렌더링
function showResult() {
  const scoreElement = document.getElementById('result-score');
  
  let count = 0;
  scoreElement.textContent = '0';
  
  if (score > 0) {
    const countInterval = setInterval(() => {
      count += 5;
      scoreElement.textContent = count;
      if (count >= score) {
        clearInterval(countInterval);
        scoreElement.textContent = score;
      }
    }, 40);
  } else {
    scoreElement.textContent = '0';
  }

  const messageElement = document.getElementById('result-message');
  if (score === 100) {
    messageElement.innerHTML = '🎉 <strong>만점입니다!</strong> 관용표현 박사님이시네요! 모든 표현을 완벽하게 알고 계셔요.';
  } else if (score >= 80) {
    messageElement.innerHTML = '✨ <strong>대단해요!</strong> 관용표현을 아주 잘 이해하고 있군요. 한 끗만 더하면 만점이에요!';
  } else if (score >= 60) {
    messageElement.innerHTML = '👍 <strong>좋은 실력이에요!</strong> 6학년 수준의 주요 관용표현들을 꽤 많이 알고 있네요.';
  } else {
    messageElement.innerHTML = '📚 <strong>공부가 조금 더 필요해요!</strong> 아래 오답 노트를 보며 관용표현의 정확한 뜻을 배워 볼까요?';
  }

  const reviewListContainer = document.getElementById('review-list');
  reviewListContainer.innerHTML = '';

  userSelections.forEach((item, index) => {
    const reviewItem = document.createElement('div');
    reviewItem.className = `review-item ${item.isCorrect ? 'correct' : 'incorrect'}`;

    const statusText = item.isCorrect ? '정답' : '오답';
    
    let answerComparisonHTML = '';
    if (!item.isCorrect) {
      answerComparisonHTML = `
        <div class="review-answers">
          <div class="review-user-ans">내가 선택한 답: <span class="wrong">❌ ${item.selected}</span></div>
          <div class="review-correct-ans">올바른 정답: <span>⭕ ${item.answer}</span></div>
        </div>
      `;
    } else {
      answerComparisonHTML = `
        <div class="review-answers">
          <div class="review-correct-ans">정답 선택: <span>⭕ ${item.answer}</span></div>
        </div>
      `;
    }

    reviewItem.innerHTML = `
      <div class="review-q-header">
        <span class="review-q-title">Q${index + 1}. ${item.question}</span>
        <span class="review-status-badge">${statusText}</span>
      </div>
      ${answerComparisonHTML}
      <div class="review-explanation">
        <strong class="explanation-title">💡 관용구 뜻풀이: "${item.idiom}"</strong>
        <span class="explanation-desc">${item.meaning}</span>
        <span class="explanation-example"><strong>예문:</strong> ${item.example}</span>
      </div>
    `;

    reviewListContainer.appendChild(reviewItem);
  });

  // [파이어베이스 동작] 결과 화면 렌더링 시 성적 데이터를 Firestore 데이터베이스에 백그라운드로 안전하게 자동 저장
  saveScoreToFirestore(score, userSelections);
  
  showScreen('screen-result');
}

/**
 * =============================================================
 * 9. 이벤트 리스너 연결 및 초기화
 * =============================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  // 시작 버튼 바인딩
  document.getElementById('btn-start').addEventListener('click', startQuiz);
  
  // 재시작 버튼 바인딩
  document.getElementById('btn-restart').addEventListener('click', startQuiz);

  // 난이도 카드 선택 이벤트 바인딩
  document.querySelectorAll('.btn-diff').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.btn-diff').forEach(b => b.classList.remove('active'));
      const targetBtn = e.currentTarget;
      targetBtn.classList.add('active');
      selectedDifficulty = targetBtn.getAttribute('data-diff') || 'easy';
    });
  });

  // 구글 로그인 및 로그아웃 버튼 바인딩
  const btnGoogleLogin = document.getElementById('btn-login-google');
  const btnLogout = document.getElementById('btn-logout');
  
  if (btnGoogleLogin) btnGoogleLogin.addEventListener('click', loginWithGoogle);
  if (btnLogout) btnLogout.addEventListener('click', logout);

  // 홈으로 가기 버튼 바인딩
  const btnGoHome = document.getElementById('btn-go-home');
  if (btnGoHome) btnGoHome.addEventListener('click', () => showScreen('screen-start'));

  // 파이어베이스 구동을 위한 감시자 세팅
  setupAuthObserver();
});
