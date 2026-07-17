/**
 * =============================================================
 * 1. 파이어베이스(Firebase) 설정 및 초기화
 * =============================================================
 */
const firebaseConfig = {
  apiKey: "AIzaSyBkkp_1uu2yq_gvIvm4FEu1o7Z6yDm9PPU",
  authDomain: "idiom-quiz-1d21d.firebaseapp.com",
  projectId: "idiom-quiz-1d21d",
  storageBucket: "idiom-quiz-1d21d.firebasestorage.app",
  messagingSenderId: "252362211165",
  appId: "1:252362211165:web:4e56da609b990ffa5032b4",
  measurementId: "G-L8YC96GZZ3"
};

// 파이어베이스 초기화
let auth, db;
if (typeof firebase !== 'undefined') {
  try {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
  } catch (error) {
    console.error("Firebase 초기화 에러:", error);
    alert("파이어베이스 연결 초기화 중 오류가 발생했습니다: " + error.message);
  }
} else {
  alert("파이어베이스 도구가 로드되지 않았습니다. 인터넷 상태를 확인해 주세요.");
}

/**
 * =============================================================
 * 2. 전역 데이터 상태 관리
 * =============================================================
 */
let allScores = []; // 데이터베이스에서 실시간으로 불러온 원본 성적 목록 보관함

/**
 * =============================================================
 * 3. 데이터베이스에서 모든 학생들의 성적 목록 불러오기
 * =============================================================
 */
function loadAllStudentScores() {
  if (!db) return;

  const tbody = document.getElementById('admin-tbody');
  tbody.innerHTML = `
    <tr>
      <td colspan="5" class="table-empty">서버에서 학생들의 최신 성적표를 받아오는 중입니다...</td>
    </tr>
  `;

  // 최상위 공용 성적 컬렉션(global_scores)에서 모든 데이터 쿼리
  db.collection("global_scores")
    .orderBy("timestamp", "desc")
    .get()
    .then(querySnapshot => {
      allScores = [];
      
      querySnapshot.forEach(doc => {
        const data = doc.data();
        allScores.push({
          id: doc.id,
          studentName: data.studentName || '익명 학생',
          studentEmail: data.studentEmail || '이메일 정보 없음',
          score: data.score !== undefined ? data.score : 0,
          correctCount: data.correctCount !== undefined ? data.correctCount : 0,
          timestamp: data.timestamp ? data.timestamp.toDate() : new Date()
        });
      });

      // 요약 지표 산정 및 표 그리기
      calculateSummaryStats();
      applyFilters();
    })
    .catch(error => {
      console.error("전체 성적 로딩 실패:", error);
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="table-empty" style="color:var(--error-color);">
            데이터를 불러오지 못했습니다. 파이어베이스 권한 규칙이나 네트워크를 확인해 주세요.
          </td>
        </tr>
      `;
    });
}

/**
 * =============================================================
 * 4. 대시보드 요약 통계(스탯) 연산 및 적용
 * =============================================================
 */
function calculateSummaryStats() {
  const totalCount = allScores.length;
  
  // 평균 점수 계산 (소수점 첫째 자리까지)
  let avgScore = 0;
  if (totalCount > 0) {
    const totalScoreSum = allScores.reduce((sum, item) => sum + item.score, 0);
    avgScore = (totalScoreSum / totalCount).toFixed(1);
  }

  // 만점자(100점) 인원수 계산
  const perfectCount = allScores.filter(item => item.score === 100).length;

  // 화면의 요약 카드 텍스트 업데이트
  document.getElementById('total-count').textContent = `${totalCount}회`;
  document.getElementById('average-score').textContent = `${avgScore}점`;
  document.getElementById('perfect-count').textContent = `${perfectCount}명`;
}

/**
 * =============================================================
 * 5. 검색 필터 및 정렬 방식 적용 통합 엔진
 * =============================================================
 */
function applyFilters() {
  const searchQuery = document.getElementById('search-input').value.toLowerCase().trim();
  const sortType = document.getElementById('sort-select').value;

  // 1. 검색어 필터링 (학생 이름 또는 이메일 매칭)
  let filteredData = allScores.filter(item => {
    return item.studentName.toLowerCase().includes(searchQuery) || 
           item.studentEmail.toLowerCase().includes(searchQuery);
  });

  // 2. 정렬 옵션 분기 처리
  filteredData.sort((a, b) => {
    switch (sortType) {
      case 'time-desc': // 최신 제출순
        return b.timestamp - a.timestamp;
      case 'time-asc':  // 과거 제출순
        return a.timestamp - b.timestamp;
      case 'score-desc': // 점수 높은순
        if (b.score !== a.score) return b.score - a.score;
        return b.timestamp - a.timestamp; // 점수 같으면 최신순
      case 'score-asc':  // 점수 낮은순
        if (a.score !== b.score) return a.score - b.score;
        return b.timestamp - a.timestamp;
      case 'name-asc':   // 이름 가나다순
        return a.studentName.localeCompare(b.studentName, 'ko');
      default:
        return b.timestamp - a.timestamp;
    }
  });

  // 가공 완료된 데이터로 표 새로 그리기
  renderTable(filteredData);
}

/**
 * =============================================================
 * 6. 데이터 테이블 렌더링 함수
 * =============================================================
 */
function renderTable(dataList) {
  const tbody = document.getElementById('admin-tbody');
  tbody.innerHTML = ''; // 테이블 내용 지우기

  if (dataList.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="table-empty">조회된 조건에 부합하는 학생 성적이 없습니다.</td>
      </tr>
    `;
    return;
  }

  dataList.forEach(item => {
    // 날짜 가독성 좋게 포맷팅 (YYYY. MM. DD. 오전/오후 HH:MM)
    const dateString = item.timestamp.toLocaleDateString("ko-KR", {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const isPerfect = (item.score === 100);
    const scoreBadgeClass = isPerfect ? 'badge-score badge-score-perfect' : 'badge-score';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${dateString}</td>
      <td style="font-weight:700; color:#1a202c;">${item.studentName}</td>
      <td style="color:var(--text-muted); font-size:0.88rem;">${item.studentEmail}</td>
      <td><strong>${item.correctCount} / 5 문항</strong></td>
      <td><span class="${scoreBadgeClass}">${item.score}점</span></td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * =============================================================
 * 7. 이벤트 바인딩 및 관리자 보안(Auth) 검증 연동
 * =============================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  if (!auth) {
    alert("파이어베이스 인증(Auth) 모듈을 불러오지 못했습니다. 메인 페이지로 이동합니다.");
    window.location.href = "index.html";
    return;
  }

  // 실시간 사용자 로그인 인증 감시
  auth.onAuthStateChanged(user => {
    if (user) {
      // 23narucho 대소문자 무시 검증
      const userEmail = (user.email || '').toLowerCase();
      const userName = (user.displayName || '').toLowerCase();
      const isAdmin = userEmail.startsWith("23narucho") || userName.includes("23narucho");

      if (isAdmin) {
        // [검증 통과]: 교사 관리자임이 확인되었으므로 성적 데이터 조회 구동
        loadAllStudentScores();
      } else {
        // [비인가 차단]: 다른 일반 계정은 접근 불허 및 메인으로 강제 팅겨내기
        alert("교사용 대시보드 접근 권한이 없습니다.\n관리자 계정(23narucho)으로 구글 로그인을 진행해 주세요.");
        window.location.href = "index.html";
      }
    } else {
      // [미로그인 차단]: 로그인을 전혀 안 한 상태는 메인 로그인 화면으로 이동
      alert("로그인이 만료되었습니다. 관리자 계정으로 먼저 구글 로그인을 완료해 주세요.");
      window.location.href = "index.html";
    }
  });

  // 검색창 실시간 타이핑 입력 이벤트 바인딩
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  // 정렬 셀렉트 박스 선택 변경 이벤트 바인딩
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', applyFilters);
  }
});
