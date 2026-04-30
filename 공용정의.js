export function 확률판정(확률퍼센트) {
    return Math.random() * 100 < 확률퍼센트;
}

export function 숫자뽑기(최소, 최대) {
    const 최소소수 = (최소.toString().split(".")[1] || "").length;
    const 최대소수 = (최대.toString().split(".")[1] || "").length;
    const 소수자리 = Math.max(최소소수, 최대소수);
    const 정수범위 = 소수자리 === 0;
    const 값 = 정수범위
        ? Math.random() * (최대 - 최소 + 1) + 최소
        : Math.random() * (최대 - 최소) + 최소;

    return 정수범위
        ? Math.floor(값)
        : Number(값.toFixed(소수자리));
}

//배열 중 하나 랜덤
export function 선택랜덤뽑기(...값들) {
    return 값들[Math.floor(Math.random() * 값들.length)];
}

export function 랜덤뽑기(목록) {
    return 목록[Math.floor(Math.random() * 목록.length)];
}

export function 확률숫자뽑기(확률표) {
    let 합 = 0;
    for (const 키 in 확률표) 합 += 확률표[키];
    let 무작위값 = Math.random() * 합;
    for (const 키 in 확률표) {
        무작위값 -= 확률표[키];
        if (무작위값 <= 0) return Number(키);
    }
}

export function 확률문자뽑기(확률표) {
    let 합 = 0;
    for (const 키 in 확률표) 합 += 확률표[키];

    let 무작위값 = Math.random() * 합;

    for (const 키 in 확률표) {
        if (무작위값 < 확률표[키]) {
            return 키; // Number(키)를 하면 한글은 NaN이 됩니다. 그냥 키를 반환하세요.
        }
        무작위값 -= 확률표[키];
    }
}

export function 선택셔플(...값들) {
    for (let i = 값들.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [값들[i], 값들[j]] = [값들[j], 값들[i]];
    }
    return 값들;
}

export function 셔플(목록) {
    for (let i = 목록.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [목록[i], 목록[j]] = [목록[j], 목록[i]];
    }
    return 목록;
}


export function 객체생성(부모, 이름, ...스타일들) {

    const 기존엘리먼트 = document.getElementById(이름);
    if (기존엘리먼트) {
        return 기존엘리먼트; // 이미 있으면 기존 것을 반환하고 함수 종료
    }

    const 엘리먼트 = document.createElement('div');
    엘리먼트.id = 이름;

    // 1. 스타일들 배열에서 '숫자'만 골라냅니다.
    const 지속시간 = 스타일들.find(인자 => typeof 인자 === 'number');

    // 2. 숫자(숫자 0 제외)가 있다면 그 시간(초) 뒤에 삭제 로직 실행
    if (지속시간) {
        setTimeout(() => {
            if (엘리먼트.parentNode) {
                엘리먼트.remove();
                if (window[이름] === 엘리먼트) delete window[이름];
            }
        }, 지속시간 * 1000); // 초 단위를 밀리초로 변환
    }

    let 열개수 = 0;

    스타일들.forEach(인자 => {
        if (typeof 인자 === 'object' && 인자 !== null) {
            // 1. 만약 className 속성이 있다면 클래스로 추가
            if (인자.className) {
                엘리먼트.classList.add(인자.className);
            }

            else {
                // ★ '열' 속성이 있는지 확인
                if (인자.columnCount) {
                    열개수 = 인자.columnCount;
                }
                Object.assign(엘리먼트.style, 인자);
            }
        }
        else if (typeof 인자 === 'string') {
            if (스타일.색상 && 스타일.색상[인자]) {
                엘리먼트.style.color = 스타일.색상[인자];
            }
            else {
                엘리먼트.style.color = 인자;
            }
        }
    });

    // 3. 숫자를 제외한 나머지 '객체'들만 스타일로 적용합니다.
    const 실제스타일들 = 스타일들.filter(인자 => typeof 인자 === 'object');
    Object.assign(엘리먼트.style, ...실제스타일들);

    window[이름] = 엘리먼트;
    if (부모) 부모.appendChild(엘리먼트);

    return 엘리먼트;
}

export function 인풋생성(부모, 이름, 속성들, ...스타일들) {
    const 엘리먼트 = document.createElement('input');

    엘리먼트.id = 이름;
    엘리먼트.autocomplete = 'off';
    // 3. input 전용 속성 설정 (type, placeholder, value 등)
    // 예: { type: 'text', placeholder: '이름을 입력하세요' }
    if (속성들) {
        Object.assign(엘리먼트, 속성들);
    }

    Object.assign(엘리먼트.style, ...스타일들);

    window[이름] = 엘리먼트;

    if (부모) 부모.appendChild(엘리먼트);

    return 엘리먼트;
}

export function 어썸아이콘정제(svgStr, size = 14) {
    let 정제된SVG = svgStr;

    const 크기스타일 = `style="width:${size}px; height:${size}px;"`;
    if (정제된SVG.includes('<svg')) {
        정제된SVG = 정제된SVG.replace('<svg', `<svg ${크기스타일}`);
    }

    if (정제된SVG.includes('fill=')) {
        정제된SVG = 정제된SVG.replace(/fill="[^"]*"/g, 'fill="currentColor"');
    } else {
        정제된SVG = 정제된SVG.replace(/<path/g, '<path fill="currentColor"');
    }

    return 정제된SVG;
}

export function 게임아이콘정제(svgStr, size = 14) {
    let 정제된SVG = svgStr;

    // 1. 배경색 및 크기 스타일 설정
    // 배경색(#121314)과 선/글자색(#C9D1D9)을 기본값으로 세팅합니다.
    const 기본스타일 = `style="width:${size}px; height:${size}px; background-color:#121314; color:#C9D1D9;"`;

    if (정제된SVG.includes('<svg')) {
        정제된SVG = 정제된SVG.replace('<svg', `<svg ${기본스타일}`);
    }

    if (정제된SVG.includes('stroke=')) {
        정제된SVG = 정제된SVG.replace(/stroke="[^"]*"/g, 'stroke="#C9D1D9"');
    } else {
        // stroke 속성이 없는 경우를 대비해 추가
        정제된SVG = 정제된SVG.replace(/<path/g, '<path stroke="#C9D1D9"');
    }
    return 정제된SVG;
}

export function n(num) {
    if (typeof num !== 'number') return num;
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString(); // 1,000 미만은 콤마만 찍기
}

export function 숫자(num) {
    if (typeof num !== 'number') return num;
    if (num >= 100000000) return (num / 100000000).toFixed(1) + '억';
    if (num >= 10000) return (num / 10000).toFixed(1) + '만';
    return num.toLocaleString(); // 1,000 미만은 콤마만 찍기
}

export const 스킬목록 = Array.from({ length: 9 }, (_, i) => i + 1);

//스타일정의
export const 스타일 = {
    숨기기: { display: 'none', },
    가림막: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'none',
        cursor: 'wait',
        backgroundColor: 'transparent',
    },
    알림점: {
        position: 'absolute',
        top: '0px',
        right: '0px',
        backgroundColor: '#FF0000',
        borderRadius: '50%',
        display: 'none'
    },
    메뉴: {
        position: 'absolute',
        top: '100%',
        right: '0',
        backgroundColor: '#121314',
    },
    가로: (값) => ({ width: `${값}px` }),
    세로: (값) => ({ height: `${값}px` }),
    사각형: (값) => ({ width: `${값}px`, height: `${값}px` }),
    투명도: (값) => ({ opacity: 값 }),
    제트: (값) => ({ zIndex: 값 }),
    플렉스: (값) => ({ flex: 값 }),

    팝업배경: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    팝업창: {
        width: '380px',
        padding: '20px',
        backgroundColor: '#1c1c1c',
        borderRadius: '8px',
        boxShadow: '0 0 15px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    왼쪽: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        textAlign: 'left'
    },
    오른쪽: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        textAlign: 'right'
    },

    가로정렬: {
        display: 'flex',
        flexDirection: 'row',
    },
    세로정렬: {
        alignItems: 'flex-start',
        // justifyContent: `flex-start`,
    },
    중앙: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    양쪽: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    가로꽉: {
        width: '100%'
    },
    화면중앙: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
    여백: { padding: '5px', },
    노여백: { padding: '0px', },
    큰여백: { padding: '10px', },
    테두리: {
        border: '1px solid #8B949E',
        borderRadius: '10px',

    },
    밑줄: {
        borderBottom: '1px solid #8B949E',
        borderRadius: `0px`,
    },
    윗줄: { borderTop: '1px solid #8B949E' },
    컨테이너: { maxWidth: '400px', width: '400px' },

    최상단: {
        position: 'fixed',
        top: 0,
    },
    좌상단: {
        position: 'absolute',
        top: '5px',
        left: '5px'
    },
    우상단: {
        position: 'absolute',
        top: '5px',
        right: '5px'
    },
    좌하단: {
        position: 'absolute',
        bottom: '5px',
        left: '5px'
    },
    우하단: {
        position: 'absolute',
        bottom: '5px',
        right: '5px'
    },
    버튼: {
        cursor: 'pointer',
        className: `버튼`,
        borderRadius: '10px',
        padding: `5px`,
    },
    작은글씨: {
        fontSize: '12px'
    },

    큰글씨: {
        fontSize: '16px'
    },

    테두리마력: (색상 = '#C9D1D9') => ({
        animation: '색흐름 2s linear infinite',
        border: `2px solid ${색상}`,
        boxShadow: `0 0 10px ${색상}, inset 0 0 10px ${색상}`,
    }),

    글자마력: (색상 = '#C9D1D9') => ({
        animation: '색흐름 2s linear infinite',
        color: 색상, // border 대신 color를 사용
        textShadow: `0 0 3px ${색상}`,
    }),

    열: (개수) => ({ columnCount: 개수 }),

    // 스타일 객체에 추가
    노줄: { whiteSpace: 'nowrap' },

};


// 2. 브라우저 로드시 자동 실행 (이게 있으면 따로 등록 안 해도 됨)
if (typeof document !== 'undefined') {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
@keyframes 색흐름 {
    0% { 
        filter: hue-rotate(-20deg); /* 지정한 색의 왼쪽 인접색 */
    }
    20% { 
        filter: hue-rotate(20deg);  /* 지정한 색의 오른쪽 인접색 */
    }
    100% { 
        filter: hue-rotate(-20deg); /* 다시 돌아옴 */
    }
}


    `;
    document.head.appendChild(styleTag);
}

export const 색상 = {
    빨강: '#FF0000', // Red
    주황: '#FFA500', // Orange
    노랑: '#FFFF00', // Yellow
    초록: '#008000', // Green
    파랑: '#0000FF', // Blue
    남색: '#4B0082', // Indigo
    보라: '#800080', // Purple (Violet)
    검정: '#000000',
    흰색: '#FFFFFF',
    회색: '#808080',

    배경: '#121314',
    글자: '#C9D1D9',
    주석: '#8B949E',

    진빨: '#FF7B72',
    중빨: '#FFA198',
    연빨: '#CE9178',

    진주: '#D96D00',
    중주: '#FFA657',
    연주: '#FFD1A0',

    진노: '#F1C40F',
    중노: '#E3CF65',
    연노: '#D7BA7D',

    진초: '#3FB950',
    중초: '#7EE787',
    연초: '#AFF5B4',

    진파: '#569CD6',
    중파: '#79C0FF',
    연파: '#A5D6FF',

    진남: '#4D58D1',
    중남: '#6E76FF',
    연남: '#B1B8FF',

    진보: '#BC8CFF',
    중보: '#D2A8FF',
    연보: '#E2C5FF',

    진핑: '#F692CE',
    중핑: '#FFB1E3',
    연핑: '#FFD1EE'
};

export const 등급테이블 = [
    {
        등급: 0,
        이름: ``,
        색상: ``,
        몬스터: ``,
    },

    {
        등급: 1,
        이름: `일반`,
        색상: '#C9D1D9',
        몬스터: `CXIII. 릴리트`,
    },

    {
        등급: 2,
        이름: `레어`,
        색상: '#3FB950',
        몬스터: `C. 디아블로`,
        아이템: [
            {
                이름: `동상자`,
                효과: `녹슨 장비가 담겨있다`,
            },
            {
                이름: `영약`,
                효과: `랜덤한 스탯 최대치가 1 증가한다`,
            },
        ],
    },

    {
        등급: 3,
        이름: `신화`,
        색상: '#569CD6',
        몬스터: `CIX. 레비아탄`,
        아이템: [
            {
                이름: `은상자`,
                효과: `멋진 장비가 담겨있다`,
            },

            {
                이름: `숙련의책`,
                효과: `사용하면 캐릭터의 숙련도가 1,000 오른다`,
            },
            {
                이름: `보따리`,
                효과: `100,000 Gold가 들어있다`,
            },

        ],
    },

    {
        등급: 4,
        이름: `고대`,
        색상: '#D96D00',
        몬스터: `LXXXVIII. 벨제부브`,
        아이템: [
            {
                이름: `금상자`,
                효과: `강력한 장비가 담겨있다`,
            },


        ],
    },

    {
        등급: 5,
        이름: `태초`,
        색상: '#F1C40F',
        몬스터: `DCLXVI. 사탄`,
        아이템: [
            {
                이름: `정십이면체`,
                효과: `가공하여 루비를 만들 수 있다`,
            },

            {
                이름: `결정`,
                효과: `랜덤한 스탯 최대치를 5 증가시킨다`,
            },
        ],
    },

    {
        등급: 6,
        이름: `타락`,
        색상: '#FF7B72',
        몬스터: `CXXXI. 루시퍼`,
        아이템: [
            {
                이름: `칠색상자`,
                효과: `눈부신 장비가 들어있다`,
            },


        ],
    },

    {
        등급: 7,
        이름: `진화`,
        색상: '#4D58D1',
        몬스터: `CIII. 베히모스`,
        아이템: [
            {
                이름: `정이십면체`,
                효과: `가공하면 다량의 루비를 만들 수 있다`,
            },

        ],

    },

    {
        등급: 8,
        이름: `멸망`,
        색상: '#BC8CFF',
        몬스터: `CX. 아바돈`,
        아이템: [
            {
                이름: `소원의열매`,
                효과: `???`,
            },

        ],
    },

    {
        등급: 9,
        이름: `공허`,
        색상: '#F692CE',
        몬스터: `CXXXII. 바론`,
        아이템: [
            {
                이름: `공허지기`,
                효과: `??????`
            },

        ],
    },

];

// export const 등급확률표 = {
//     1: 362880,
//     2: 40320,
//     3: 5040,
//     4: 720,
//     5: 120,
//     6: 24,
//     7: 6,
//     8: 2,
//     9: 1,

// };

export const 등급확률표 = (인자) => {
    return {
        1: 362880 * 인자,
        2: 40320 * Math.pow(인자, 1.5),
        3: 5040 * Math.pow(인자, 2),
        4: 720 * Math.pow(인자, 2.5),
        5: 120 * Math.pow(인자, 3),
        6: 24 * Math.pow(인자, 3.5),
        7: 6 * Math.pow(인자, 4),
        8: 2 * Math.pow(인자, 4.5),
        9: 1 * Math.pow(인자, 5)
    };
};

export const 아이템확률표 = (인자) => {
    return {
        1: 65536 * 인자,
        2: 16384 * Math.pow(인자, 1.5),
        3: 4096 * Math.pow(인자, 2),
        4: 1024 * Math.pow(인자, 2.5),
        5: 256 * Math.pow(인자, 3),
        6: 64 * Math.pow(인자, 3.5),
        7: 16 * Math.pow(인자, 4),
        8: 4 * Math.pow(인자, 4.5),
        9: 1 * Math.pow(인자, 5)
    };
};

const 보상 = [
    () => {
        let 히든숙련도 = 숫자뽑기(100, 500);
        유저.현재숙련도 += 히든숙련도;
        유저.총숙련도 += 히든숙련도;
        히든보상 = `보너스 숙련도 ${히든숙련도} 획득!`;

    },
    () => {
        let 히든골드 = 100 * 숫자뽑기(유저.악마성 * 80, 유저.악마성 * 120);
        유저.현재골드 += 히든골드;
        유저.총골드 += 히든골드;
        히든보상 = `보너스 골드 ${히든골드} 획득!`;

    },
    () => {
        let 히든루비 = 숫자뽑기(10, 30);
        유저.현재루비 += 히든루비;
        유저.총루비 += 히든루비;
        히든보상 = `보너스 루비 ${히든루비} 획득!`;
    },
];


export const 주인장등급확률표 = {
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 1,
    6: 1,
    7: 1,
    8: 1,
    9: 1,

};

export const 일반몬스터 = [
    "I. 디나르", "II. 에리곤", "III. 도레알", "IV. 크로셀", "V. 루페스", "VI. 벨", "VII. 시에르", "VIII. 세레우스", "IX. 버알베리스", "X. 발라크",
    "XI. 로노베", "XII. 자간", "XIII. 안드라멜리우스", "XIV. 니로스", "XV. 에이몬", "XVI. 라에스", "XVII. 아라타바", "XVIII. 바티바스", "XIX. 아몬", "XX. 안드로말리우스",
    "XXI. 바피메트", "XXII. 오로이아스", "XXIII. 오세", "XXIV. 아미", "XXV. 데카브리아", "XXVI. 벨리알", "XXVII. 디카리브", "XXVIII. 세이르", "XXIX. 오로버스", "XXX. 무루무르",
    "XXXI. 카이미", "XXXII. 알로세스", "XXXIII. 샤르나크", "XXXIV. 샤크", "XXXV. 사브낙", "XXXVI. 라하브", "XXXVII. 말포르스", "XXXVIII. 하우레스", "XXXIX. 피닉스", "XL. 바알",
    "XLI. 푸르카스", "XLII. 가프", "XLIII. 아스모데우스", "XLIV. 포르카스", "XLV. 보락스", "XLVI. 글라시아라볼라스", "XLVII. 나베리우스", "XLVIII. 아이몬", "XLIX. 프루푸스", "L. 살로스",
    "LI. 하프리", "LII. 페니악스", "LIII. 다이몬", "LIV. 스틸", "LV. 마르코시아스", "LVI. 보트스", "LVII. 제파르", "LVIII. 엘리고스", "LIX. 레리어", "LX. 베레트",
    "LXI. 시트리", "LXII. 구시온", "LXIII. 부에르", "LXIV. 카임", "LXV. 포르네우스", "LXVI. 부네", "LXVII. 아몬", "LXVIII. 마라바스", "LXIX. 푸르손", "LXX. 말파스",
    "LXXI. 파임", "LXXII. 바르바토스"
];

export const 히든몬스터 = [
    "CXIII. 릴리트",     // 113  창세기 1:3 기반 고유코드
    "C. 디아블로",       // 100  지옥 9층 최하층 코드화
    "CIX. 레비아탄",     // 109  7대죄 질투의 심연코드 확장
    "LXXXVIII. 벨제부브",// 88   식탐 군주의 죄악 확장코드
    "DCLXVI. 사탄",      // 666  절대악 숫자
    "CXXXI. 루시퍼",     // 131  빛의 아들 상징 숫자
    "CIII. 베히모스",    // 103  욥기 심연코드 변환
    "CX. 아바돈",        // 110  요한계시록 9:11 변환
    "CXXXII. 바론"       // 132  바론 삼디 죽음의식 코드
];


export const 접두사 = [
    [``],

    ["낡은", "허름한", "불량", "깨진", "먼지쌓인", "녹슨", "뒤틀린", "악취나는", "쓸모없는"],


    ["평범한", "흔한", "조잡한", "거친", "무딘", "가벼운", "나무", "투박한", "연습용", "기본"],


    ["정교한", "날카로운", "단단한", "무거운", "강철", "강화된", "단련된", "숙련자의", "빛나는", "안정적인"],


    ["희귀한", "은빛", "마력이깃든", "바람의", "대지의", "불꽃의", "냉기의", "고대", "비밀스러운", "명품"],


    ["영웅의", "용맹한", "불굴의", "강인한", "학살자의", "기사의", "파괴적인", "검은", "심판의", "수호자의"],


    ["전설적인", "금빛", "찬란한", "잊혀진", "심연의", "성스러운", "저주받은", "금단의", "황혼의", "영광스러운"],


    ["신화적인", "불멸의", "초월적인", "무한한", "파멸의", "절대적인", "영원의", "우주의", "운명의", "천상의"],


    ["창조의", "소멸의", "심판자의", "신의숨결", "차원의", "질서의", "혼돈의", "빛의인도", "태초의", "진화된"],


    ["성역의", "신의권능", "세상의끝", "무의영역", "삼라만상", "절대신", "영생의", "최초의빛", "우주근원", "종말의"]
];

export const 장비명 = {
    "무기": ["검", "활", "지팡이", "도끼", "단검", "창", "둔기", "총",],

    "방어구": ["갑옷", "로브", "코트", "흉갑", "도복", "플레이트", "메일", "슈트"],

    "장갑": ["장갑", "건틀릿", "핸드글러브", "브레이서"],

    "신발": ["장화", "부츠", "샌들", "그리브", "워커",],

    "목걸이": ["목걸이", "펜던트", "초커", "아뮬렛",],

    "반지": ["반지", "링", "고리",]
};

export const 스탯테이블 = {
    "기본스탯": [`체력`, `공격력`, `방어력`, `속력`, `치명`, `치명계수`, `회복`, `회복계수`,],
    "어빌리티스탯": [`생명`, `힘`, `인내`, `민첩`, `운`, `감각`, `지능`, `정신`,],
    "최대치스탯": [`생명최대치`, `힘최대치`, `인내최대치`, `민첩최대치`, `운최대치`, `감각최대치`, `지능최대치`, `정신최대치`,],
    "물약스탯": [`생명물약최대치`, `힘물약최대치`, `인내물약최대치`, `민첩물약최대치`, `운물약최대치`, `감각물약최대치`, `지능물약최대치`, `정신물약최대치`,],
    "최종스탯": [`최종체력`, `최종공격력`, `최종방어력`, `최종속력`, `최종치명`, `최종치명계수`, `최종회복`, `최종회복계수`,],

};

export const 장비테이블 = {
    "유형": [`무기`, `장갑`, `목걸이`, `방어구`, `신발`, `반지`,],
    "슬롯": [`무기슬롯`, `장갑슬롯`, `목걸이슬롯`, `방어구슬롯`, `신발슬롯`, `반지슬롯`,],
};

export const 스킬테이블 = [
    `번개`, `수리검`, `보호막`, `얼음가시`, `광창`, `화염파`, `강타`, `강인`, `흡혈`,
];