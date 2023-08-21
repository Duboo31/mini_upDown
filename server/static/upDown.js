const startBtn = document.querySelector(".startBtn");
const restartBtn = document.querySelector(".restartBtn");
let inputEl = document.querySelector(".inputVal");
let hintText = document.querySelector(".hint");
let curCntText = document.querySelector(".curCnt");
let maxCntText = document.querySelector(".maxCnt");

let currentNum = 0;

let cnt = 0;

let maxCnt;

const printMaxCnt = () => {
  fetch("/readMaxCnt")
    .then((res) => res.json())
    .then((data) => {
      console.log(data.maxVal[0]["maxCnt"]);
      maxTxt = data.maxVal[0]["maxCnt"];
      maxCntText.innerText = maxTxt;
    });
};

// 랜덤 숫자 생성
const getNumber = () => {
  fetch("/readNumber")
    .then((res) => res.json())
    .then((data) => {
      currentNum = data.msg[0]["number"];
      console.log("랜덤값: ", typeof currentNum, currentNum);
    });
};

// 게임 시작시 인풋 활성화
const inputActive = () => {
  inputEl.disabled = false;
  inputEl.focus();
};

// 맥스 카운트 post
const postMaxCnt = () => {
  let formData = new FormData();
  formData.append("max_give", maxCnt);

  fetch("/maxCnt", { method: "POST", body: formData })
    .then((res) => res.json())
    .then((data) => {
      console.log("맥스카운트 보내기 성공", data);
    });

  location.reload();
};

const postInputVal = (e) => {
  if (e.key === "Enter") {
    let inputVal = inputEl.value;

    if (Number(inputVal) > 100 || Number(inputVal) <= 0) {
      console.log(inputVal);
      inputEl.value = null;
      alert("1부터 100까지 숫자만 입력가능");
    } else if (currentNum < inputVal) {
      hintText.innerText = `${inputEl.value} 다운`;
      inputEl.value = null;
      cnt++;
      curCntText.innerText = cnt;
    } else if (currentNum > inputVal && inputVal !== "") {
      hintText.innerText = `${inputEl.value} 업`;
      inputEl.value = null;
      cnt++;
      curCntText.innerText = cnt;
    } else if (currentNum === Number(inputVal)) {
      inputEl.value = null;
      maxCnt = cnt;
      console.log("최고 카운트: ", maxCnt);
      postMaxCnt();
      hintText.innerText = "정답";
      alert("정답");
      restartFn();
    }
  }
};

const restartFn = () => {
  inputEl.value = null;
  cnt = 0;
  curCntText.innerText = cnt;
  hintText.innerText = "업다운 힌트";

  fetch("/changeNumber", { method: "POST" })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    });
};

// 로드시 실행
printMaxCnt();

// 이벤트
startBtn.addEventListener("click", getNumber);
startBtn.addEventListener("click", inputActive);
inputEl.addEventListener("keypress", postInputVal);
restartBtn.addEventListener("click", restartFn);
