// 요소
const playerName = document.querySelector('.player__name');
const monsterProgress = document.querySelector('.monster__health');
const playerProgress = document.querySelector('.player__health');

const btnAttack = document.querySelector('.btn-attack');
const btnStrongAttack = document.querySelector('.btn-strong-attack');
const btnHeal = document.querySelector('.btn-heal');
const btnLog = document.querySelector('.btn-log');

// 전역 변수
const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;
const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_SATTACK = 'STRONG_ATTACK';

const LOG_EVENT_ATTACK = '플레이어 공격';
const LOG_EVENT_STRONG_ATTACK = '플레이어 강한 공격';
const LOG_EVENT_HEAL = '플레이어 체력 보충';
const LOG_EVENT_MONSTER_ATTACK = '몬스터 공격';
const LOG_EVENT_GAME_OVER = '게임오버';

let playerInputName = prompt('플레이어의 이름을 입력하세요.', '플레이어');
let currentMonsterHealth;
let currentPlayerHealth;
let initailHealth; // 최종적으로 설정된 체력값
let battleLogs = [];

// player 이름을 입력하지 않은 경우 초기값
if (!playerInputName) {
  playerInputName = '플레이어';
}
setPlayerName(playerInputName);

// player 이름 설정
function setPlayerName(name) {
  playerName.textContent = `${playerName.textContent} ${name}`;
  setMaxHealth();
}

// 체력 설정
function setMaxHealth() {
  const inputHealth = prompt('최대 체력을 입력하세요!', 100);
  const chosenHealth = parseInt(inputHealth);
  if (isNaN(chosenHealth) || chosenHealth <= 0) {
    initHealthProgress(100);
    return;
  }
  initHealthProgress(chosenHealth);
}

// 전투이력 쌓기
function writeToLog(ev, val, monsterHealth, playerHealth) {
  let logEntry = {
    event: ev,
    value: val,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth,
  };

  if (ev === LOG_EVENT_ATTACK || LOG_EVENT_STRONG_ATTACK) {
    logEntry.target = '몬스터';
  } else if (ev === LOG_EVENT_HEAL || LOG_EVENT_MONSTER_ATTACK) {
    logEntry.target = playerInputName;
  }

  battleLogs.push(logEntry);
}

// 체력 프로그레스바 초기화
function initHealthProgress(health) {
  monsterProgress.max = health;
  monsterProgress.value = health;
  playerProgress.max = health;
  playerProgress.value = health;
  currentMonsterHealth = health;
  currentPlayerHealth = health;
  initailHealth = health;
}

// 몬스터 데미지
function dealMonsterDamage(damage) {
  let dealDamage = Math.random() * damage;
  monsterProgress.value -= parseInt(dealDamage);
  return dealDamage;
}

// 플레이어 데미지
function dealPlayerDamage(damage) {
  let dealDamage = Math.random() * damage;
  playerProgress.value -= parseInt(dealDamage);
  return dealDamage;
}

// 플레이어 힐
function setPlayerHeal(heal) {
  playerProgress.value += heal;
}

// 몬스터 공격 (일반/강공)
function attackMonster(mode) {
  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    return;
  }

  let maxDamage;
  let logEvent;
  if (mode === MODE_ATTACK) {
    maxDamage = ATTACK_VALUE;
    logEvent = LOG_EVENT_ATTACK;
  } else if (mode === MODE_STRONG_SATTACK) {
    maxDamage = STRONG_ATTACK_VALUE;
    logEvent = LOG_EVENT_STRONG_ATTACK;
  }
  const dealDamage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= dealDamage;
  writeToLog(logEvent, dealDamage, currentMonsterHealth, currentPlayerHealth);

  // player 공격 및 라운드 정리
  endRound();
}

function endRound() {
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(LOG_EVENT_MONSTER_ATTACK, playerDamage, currentMonsterHealth, currentPlayerHealth);

  let gameResult;
  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert(`${playerInputName}님이 승리하셨습니다!🥳`);
    gameResult = 'win🥳';
  } else if (currentMonsterHealth > 0 && currentPlayerHealth <= 0) {
    alert(`몬스터가 승리했습니다!😭`);
    gameResult = 'lose😭';
  } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    alert(`무승부네요!🤔`);
    gameResult = 'draw🤔';
  }

  // 게임 리셋
  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    writeToLog(LOG_EVENT_GAME_OVER, gameResult, currentMonsterHealth, currentPlayerHealth);
    resetGame();
  }
}

function resetGame() {
  initHealthProgress(initailHealth);
}

function attackHandler() {
  attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
  attackMonster(MODE_STRONG_SATTACK);
}

function healHandler() {
  let healValue;
  if (currentPlayerHealth >= initailHealth - HEAL_VALUE) {
    alert('최대 체력을 보충했습니다.');
    healValue = initailHealth - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  currentPlayerHealth += healValue;
  setPlayerHeal(healValue);
  writeToLog(LOG_EVENT_HEAL, healValue, currentMonsterHealth, currentPlayerHealth);
  endRound();
}

function battleLogHandler() {
  // for문 사용해서 로그 찍어보기
  battleLogs.forEach(function (log) {
    let logMessage;
    if (log.event === LOG_EVENT_GAME_OVER) {
      logMessage = `${log.event}\n게임 결과 : ${log.value}`;
    } else if (log.event === LOG_EVENT_HEAL) {
      logMessage = `${log.event}\n보충 체력 : ${log.value}\n몬스터 체력 : ${log.currentMonsterHealth}\n${playerInputName} 체력 : ${log.currentPlayerHealth}`;
    } else {
      logMessage = `${log.event}\n데미지 : ${log.value}\n몬스터 체력 : ${log.currentMonsterHealth}\n${playerInputName} 체력 : ${log.currentPlayerHealth}`;
    }
    console.log(logMessage);
  });
}

btnAttack.addEventListener('click', attackHandler);
btnStrongAttack.addEventListener('click', strongAttackHandler);
btnHeal.addEventListener('click', healHandler);
btnLog.addEventListener('click', battleLogHandler);
