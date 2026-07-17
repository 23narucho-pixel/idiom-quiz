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
 * 2. 문제 은행 데이터 정의 (초등학교 6학년 수준 관용표현 10문항)
 * =============================================================
 */
const questionBank = [
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
    idiom: "발 벗고 나서다",
    question: "남의 일을 돕기 위해 적극적으로 앞장서는 모습을 뜻하는 관용표현은?",
    options: ["발 벗고 나서다", "손을 떼다", "배를 불리다", "목을 축이다"],
    answer: "발 벗고 나서다",
    meaning: "적극적으로 해결하기 위해 앞장서다.",
    example: "우리 반 반장은 어려움에 처한 친구를 위해 항상 발 벗고 나선다."
  },
  {
    idiom: "쇠뿔도 단김에 빼라",
    question: "어떤 일을 하려고 마음먹었으면 미루지 말고 바로 해치워야 함을 이르는 속담은?",
    options: ["등잔 밑이 어둡다", "쇠뿔도 단김에 빼라", "밑 빠진 독에 물 붓기", "누워서 떡 먹기"],
    answer: "쇠뿔도 단김에 빼라",
    meaning: "기회가 왔을 때 지체 없이 일을 처리해야 한다.",
    example: "공부하기로 마음먹었으니 쇠뿔도 단김에 빼는 격으로 지금 시작하자!"
  },
  {
    idiom: "비행기를 태우다",
    question: "남을 지나치게 칭찬하여 우쭐하게 만드는 행동을 뜻하는 관용표현은?",
    options: ["콧대를 높이다", "바람을 넣다", "비행기를 태우다", "어깨를 으쓱하다"],
    answer: "비행기를 태우다",
    meaning: "남을 과하게 칭찬하여 들뜨게 만들다.",
    example: "너무 비행기 태우지 마세요, 제가 정말 쑥스러워요."
  },
  {
    idiom: "낯이 뜨겁다",
    question: "남 보기 부끄럽거나 민망하여 얼굴이 화끈거린다는 뜻의 관용표현은?",
    options: ["낯이 뜨겁다", "머리를 맞대다", "가슴을 쓸어내리다", "발을 뻗고 자다"],
    answer: "낯이 뜨겁다",
    meaning: "남 보기에 매우 부끄럽고 민망하다.",
    example: "내 실수를 많은 친구들이 보고 있어서 얼굴이 붉어지고 낯이 뜨거웠다."
  },
  {
    idiom: "눈독을 들이다",
    question: "욕심을 내어 가지고 싶어 하거나 아주 깊은 관심을 보일 때 쓰는 관용표현은?",
    options: ["눈을 붙이다", "눈독을 들이다", "눈을 감아주다", "눈에 불을 켜다"],
    answer: "눈독을 들이다",
    meaning: "마음에 두고 크게 욕심을 내어 지켜보다.",
    example: "동생이 내가 생일 선물로 받은 장난감에 자꾸 눈독을 들이고 있다."
  },
  {
    idiom: "배가 아프다",
    question: "남이 잘되는 것이 부럽고 시샘이 나서 기분이 좋지 않을 때 쓰는 관용표현은?",
    options: ["배가 아프다", "가슴이 벅차다", "등을 돌리다", "뼈가 빠지다"],
    answer: "배가 아프다",
    meaning: "남이 잘되는 것을 시샘하고 시기하다.",
    example: "친구가 퀴즈에서 만점을 받자 속상해서 은근히 배가 아팠다."
  },
  {
    idiom: "입을 모으다",
    question: "여러 사람이 한목소리로 같은 주장이나 의견을 말하는 행동을 뜻하는 관용표현은?",
    options: ["입을 모으다", "입이 짧다", "귀를 기울이다", "손이 발이 되다"],
    answer: "입을 모으다",
    meaning: "여러 사람이 같은 내용의 의견을 같이하다.",
    example: "선생님들은 우리 반의 협동심에 대해 모두 입을 모아 칭찬하셨다."
  },
  {
    idiom: "어깨가 무겁다",
    question: "중요한 의무나 책임을 맡아 마음의 부담이 매우 클 때 비유적으로 쓰는 관용표현은?",
    options: ["어깨를 나란히 하다", "어깨가 무겁다", "손을 잡다", "발을 동동 구르다"],
    answer: "어깨가 무겁다",
    meaning: "맡은 책임이나 임무에 대한 마음에 관한 부담이 크다.",
    example: "이번에 전교 회장 직무를 맡게 되어 양어깨가 무겁다."
  }
];

/**
 * =============================================================
 * 3. 전역 상태 및 게임 변수 정의
 * =============================================================
 */
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
    const btnStart = document.getElementById('btn-start');
    const btnAdminLink = document.getElementById('btn-admin-link');
    
    if (user) {
      // 1. 로그인 상태인 경우
      currentUser = user;
      userInfoBox.classList.remove('hidden');
      loginBox.classList.add('hidden');
      
      // 프로필 정보 매칭
      document.getElementById('user-photo').src = user.photoURL || 'https://via.placeholder.com/28';
      document.getElementById('user-name').textContent = user.displayName || '학습자';
      
      // [관리자 계정 감지] 23narucho 및 23navucho 오타 대처형 대소문자 무시 판별
      const userEmail = (user.email || '').toLowerCase();
      const userName = (user.displayName || '').toLowerCase();
      const isAdmin = userEmail.startsWith("23narucho") || userName.includes("23narucho") ||
                      userEmail.startsWith("23navucho") || userName.includes("23navucho");
      
      if (isAdmin && btnAdminLink) {
        btnAdminLink.style.display = "inline-flex"; // 관리자면 강제로 표출
      } else if (btnAdminLink) {
        btnAdminLink.style.display = "none"; // 일반 사용자는 강제로 은폐
      }
      
      // 시작 버튼 활성화 및 명칭 변경
      btnStart.disabled = false;
      btnStart.textContent = "시작하기";
    } else {
      // 2. 로그아웃 상태인 경우
      currentUser = null;
      userInfoBox.classList.add('hidden');
      loginBox.classList.remove('hidden');
      
      if (btnAdminLink) {
        btnAdminLink.style.display = "none"; // 로그아웃 시 강제 은폐
      }
      
      // 시작 버튼 비활성화 및 안내 문구 노출
      btnStart.disabled = true;
      btnStart.textContent = "로그인 후 도전하기";
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
  if (!db || !currentUser) return;

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

  // 1. 개인 보관용 성적 데이터 객체
  const personalDocData = {
    score: finalScore,
    correctCount: correctCount,
    wrongAnswers: wrongAnswers,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };

  // 2. [추가] 교사 관리자용 통합 공용 성적 데이터 객체
  const globalDocData = {
    studentName: currentUser.displayName || '익명 학생',
    studentEmail: currentUser.email || '이메일 정보 없음',
    score: finalScore,
    correctCount: correctCount,
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

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${dateString}</td>
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
          <td colspan="3" class="table-empty" style="color:var(--error-color) !important;">
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

// 퀴즈 시작 (초기화 및 문제 추출)
function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  userSelections = [];

  const shuffledBank = shuffleArray(questionBank);
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
