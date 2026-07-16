/**
 * =============================================================
 * 1. 문제 은행 데이터 정의 (초등학교 6학년 수준 관용표현 10문항)
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
 * 2. 전역 상태 및 게임 변수 정의
 * =============================================================
 */
let currentQuizSet = []; // 이번 퀴즈 세트 (무작위 5문항)
let currentQuestionIndex = 0; // 현재 진행 중인 문제 인덱스 (0 ~ 4)
let score = 0; // 맞힌 개수 기반 점수
let userSelections = []; // 사용자가 풀이한 정/오답 기록 저장용 배열

/**
 * =============================================================
 * 3. 헬퍼 함수 (셔플 알고리즘)
 * =============================================================
 */
// 피셔-예이츠 셔플(Fisher-Yates Shuffle) 구현
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
 * 4. 화면 전환 제어 함수
 * =============================================================
 */
function showScreen(screenId) {
  // 모든 screen 요소에서 active 클래스를 제거하고 숨김
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });

  // 목표 screen을 표시하고 active 클래스를 추가해 서서히 페이드인 시킴
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add('active');
  }
}

/**
 * =============================================================
 * 5. 퀴즈 게임 로직
 * =============================================================
 */

// 퀴즈 시작 (초기화 및 문제 추출)
function startQuiz() {
  // 1. 상태 초기화
  currentQuestionIndex = 0;
  score = 0;
  userSelections = [];

  // 2. 문제 은행에서 무작위로 5문제 선정 (Fisher-Yates)
  const shuffledBank = shuffleArray(questionBank);
  currentQuizSet = shuffledBank.slice(0, 5);

  // 3. 첫 번째 문제 표시
  renderQuestion();
  showScreen('screen-quiz');
}

// 질문과 보기 렌더링
function renderQuestion() {
  const currentQuestion = currentQuizSet[currentQuestionIndex];
  
  // 프로그레스 바 및 텍스트 업데이트
  const progressText = document.getElementById('quiz-progress-text');
  const progressFill = document.getElementById('quiz-progress-fill');
  const currentNum = currentQuestionIndex + 1;
  
  progressText.textContent = `${currentNum} / 5`;
  progressFill.style.width = `${(currentNum / 5) * 100}%`;

  // 문제 번호와 질문 텍스트 삽입
  document.getElementById('question-number').textContent = `Q${currentNum}.`;
  document.getElementById('quiz-question').textContent = currentQuestion.question;

  // 보기(4지선다) 목록 셔플 후 동적 생성
  const shuffledOptions = shuffleArray(currentQuestion.options);
  const optionsContainer = document.getElementById('quiz-options');
  optionsContainer.innerHTML = ''; // 이전 보기 비우기

  shuffledOptions.forEach((optionText, index) => {
    const button = document.createElement('button');
    button.className = 'option-btn';
    
    // 번호와 보기 텍스트 결합
    button.innerHTML = `
      <span class="option-num">${index + 1}</span>
      <span class="option-text">${optionText}</span>
    `;

    // 보기 클릭 이벤트 핸들러 바인딩
    button.addEventListener('click', () => handleOptionClick(button, optionText, currentQuestion));
    optionsContainer.appendChild(button);
  });
}

// 보기 클릭 처리 (채점, 애니메이션 및 스킵 지연)
function handleOptionClick(selectedButton, selectedText, currentQuestion) {
  const optionsContainer = document.getElementById('quiz-options');
  const buttons = optionsContainer.querySelectorAll('.option-btn');

  // [오류 방지 1] 클릭하는 즉시 모든 보기 버튼 비활성화 (더블클릭 방지)
  buttons.forEach(btn => btn.disabled = true);

  const isCorrect = (selectedText === currentQuestion.answer);

  // 사용자 풀이 결과 기록 저장
  userSelections.push({
    question: currentQuestion.question,
    idiom: currentQuestion.idiom,
    selected: selectedText,
    answer: currentQuestion.answer,
    meaning: currentQuestion.meaning,
    example: currentQuestion.example,
    isCorrect: isCorrect
  });

  // 채점 시각 피드백 제공
  buttons.forEach(btn => {
    const btnTextElement = btn.querySelector('.option-text');
    const btnText = btnTextElement ? btnTextElement.textContent : '';

    if (btnText === currentQuestion.answer) {
      // 정답 버튼은 초록색 처리
      btn.classList.add('selected-correct');
    } else if (btn === selectedButton && !isCorrect) {
      // 틀렸다면 사용자가 클릭한 것만 빨간색 처리
      btn.classList.add('selected-incorrect');
    } else {
      // 그 외 보기들은 희미하게 투명화 처리
      btn.classList.add('dimmed');
    }
  });

  if (isCorrect) {
    score += 20; // 한 문제당 20점 계산
  }

  // [오류 방지 2] 애니메이션 감상 및 정답 상태 확인 후 부드럽게 화면 이동 (0.8초 대기)
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < 5) {
      renderQuestion();
    } else {
      showResult();
    }
  }, 800);
}

/**
 * =============================================================
 * 6. 결과 화면 및 오답 노트 렌더링
 * =============================================================
 */
function showResult() {
  // 1. 점수 출력
  const scoreElement = document.getElementById('result-score');
  
  // 점수가 서서히 올라가는 텍스트 효과 (점수 카운트업)
  let count = 0;
  scoreElement.textContent = '0';
  
  if (score > 0) {
    const countInterval = setInterval(() => {
      count += 5;
      scoreElement.textContent = count;
      if (count >= score) {
        clearInterval(countInterval);
        scoreElement.textContent = score; // 최종 고정
      }
    }, 40);
  } else {
    scoreElement.textContent = '0';
  }

  // 2. 점수별 메시지 피드백
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

  // 3. 오답 노트를 동적으로 렌더링
  const reviewListContainer = document.getElementById('review-list');
  reviewListContainer.innerHTML = ''; // 기존 콘텐츠 초기화

  userSelections.forEach((item, index) => {
    const reviewItem = document.createElement('div');
    reviewItem.className = `review-item ${item.isCorrect ? 'correct' : 'incorrect'}`;

    // 오답 전용 상세 레이아웃 빌드
    const statusText = item.isCorrect ? '정답' : '오답';
    
    // 오답일 때만 사용자 선택지와 정답을 함께 표시하여 가시성 증대
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

  showScreen('screen-result');
}

/**
 * =============================================================
 * 7. 이벤트 리스너 연결 및 초기화
 * =============================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  // 시작 버튼 바인딩
  document.getElementById('btn-start').addEventListener('click', startQuiz);
  
  // 재시작 버튼 바인딩
  document.getElementById('btn-restart').addEventListener('click', startQuiz);
});
