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
const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_SATTACK = 'STRONG_ATTACK';

let playerInputName = prompt('플레이어의 이름을 입력하세요.', '플레이어');
let currentMonsterHealth;
let currentPlayerHealth;

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

// 체력 프로그레스바 초기화
function initHealthProgress(health) {
  monsterProgress.max = health;
  monsterProgress.value = health;
  playerProgress.max = health;
  playerProgress.value = health;
  currentMonsterHealth = health;
  currentPlayerHealth = health;
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

// 몬스터 공격 (일반/강공)
function attackMonster(mode) {
  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    return;
  }

  let maxDamage;
  if (mode === MODE_ATTACK) {
    maxDamage = ATTACK_VALUE;
  } else if (mode === MODE_STRONG_SATTACK) {
    maxDamage = STRONG_ATTACK_VALUE;
  }
  const dealDamage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= dealDamage;
  // player 공격 및 라운드 정리
  endRound();
}

function endRound() {
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert(`${playerInputName}님이 승리하셨습니다!🥳`);
  } else if (currentMonsterHealth > 0 && currentPlayerHealth <= 0) {
    alert(`몬스터가 승리했습니다!😭`);
  } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    alert(`무승부네요!🤔`);
  }
}

function attackHandler() {
  attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
  attackMonster(MODE_STRONG_SATTACK);
}

btnAttack.addEventListener('click', attackHandler);
btnStrongAttack.addEventListener('click', strongAttackHandler);
