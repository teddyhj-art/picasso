/**
 * 게르니카 작업실 — 제출하기 연동용 Google Apps Script
 *
 * [배포 방법]
 * 1) 연동하려는 구글 시트를 여세요:
 *    https://docs.google.com/spreadsheets/d/1mn9deeJC0ZtL9zohGg2xI8-hHjHwrODmo2_3z4tjiB8/edit
 * 2) 메뉴에서 확장 프로그램 → Apps Script 를 클릭합니다.
 * 3) 기본으로 열려 있는 코드를 모두 지우고, 이 파일의 코드를 그대로 붙여넣습니다.
 * 4) 저장(디스크 아이콘) → 상단의 "배포" → "새 배포" 클릭
 *    - 유형 선택(톱니바퀴)에서 "웹 앱" 선택
 *    - 실행 계정: 나(본인 구글 계정)
 *    - 액세스 권한: 전체 허용(Anyone)
 *    - "배포" 클릭 → 권한 승인(본인 계정으로 로그인) 진행
 * 5) 배포가 끝나면 나오는 "웹 앱 URL"을 복사합니다.
 * 6) picasso 저장소의 index.html 에서 아래 줄을 찾아 그 URL을 붙여넣습니다.
 *      const SHEET_WEBHOOK_URL = '';
 *    →  const SHEET_WEBHOOK_URL = '복사한 URL';
 *    그리고 다시 GitHub에 업로드하면 "제출하기" 버튼이 실제로 시트에 기록됩니다.
 *
 * [동작]
 * - 처음 제출이 들어오면 이 스프레드시트 안에 "게르니카_작업실_제출" 이라는
 *   새 탭을 자동으로 만듭니다 (기존의 다른 탭들은 전혀 건드리지 않습니다).
 * - 학생이 "제출하기"를 누를 때마다 한 줄씩 아래 항목이 새 탭에 쌓입니다:
 *   제출시간 / 학번 / 이름 / 선택한 목격 장면·모둠 메시지 / 상징 이름 / 뜻풀이 /
 *   표현하고 싶은 모습(구체적 아이디어) / 표현 의도 / 형태 / 재료·방법 / 포인트 컬러 / 포인트 컬러 메모
 */
function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = '게르니카_작업실_제출';
  var sh = ss.getSheetByName(sheetName);
  if (!sh) {
    sh = ss.insertSheet(sheetName);
    sh.appendRow(['제출시간', '학번', '이름', '선택한 목격 장면·모둠 메시지', '상징 이름', '뜻풀이', '표현하고 싶은 모습(구체적 아이디어)', '표현 의도', '형태', '재료·방법', '포인트 컬러', '포인트 컬러 메모']);
    sh.getRange(1, 1, 1, 12).setFontWeight('bold');
  }

  var data = {};
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    data = {};
  }

  sh.appendRow([
    new Date(),
    data.num || '',
    data.name || '',
    data.scene || '',
    data.symName || '',
    data.symMean || '',
    data.idea || '',
    data.intent || '',
    data.form || '',
    data.method || '',
    data.pointColor || '',
    data.colorNote || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
