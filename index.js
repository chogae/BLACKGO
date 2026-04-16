const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'YOUR_VERY_SECRET_KEY';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(express.static('.'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client.html');
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ BLACK 데이터베이스 연결 성공!'))
    .catch(err => console.error('❌ DB 연결 실패:', err));

app.get('/', (req, res) => {
    res.send('BLACK RPG 서버가 가동 중입니다!');
});

const 포트 = process.env.PORT || 5000;

app.listen(포트, () => {
    console.log(`🚀 서버가 포트 ${포트}에서 실행 중입니다.`);
});

const 조회유저 = require('./user');
const 기록 = require('./log');

app.post('/api', async (req, res) => {
    const { 유형, 데이터 } = req.body;
    let 유저 = null;

    try {

        if (유형 !== '로그인' && 유형 !== '회원가입') {
            if (!데이터.토큰) {
                return res.status(401).json({ 성공: false, 메세지: "인증 토큰이 없습니다." });
            }
            const 해독됨 = jwt.verify(데이터.토큰, SECRET_KEY);
            해독된아이디 = 해독됨.아이디; // 여기서 한 번만 추출!
            유저 = await 조회유저.findOne({ 아이디: 해독된아이디 });
        }

        switch (유형) {
            case '회원가입':
                if (데이터.아이디.length > 6) {
                    return res.status(400).json({ 성공: false, 메세지: "아이디는 6자 이내여야 합니다." });
                }
                const 기존유저 = await 조회유저.findOne({ 아이디: 데이터.아이디 });
                if (기존유저) {
                    return res.status(400).json({ 성공: false, 메세지: "이미 존재하는 아이디입니다." });
                }

                // 새 유저 생성 및 저장
                const 새유저 = new 조회유저({
                    아이디: 데이터.아이디,
                    비밀번호: 데이터.비번
                });
                await 새유저.save();

                // [추가] 가입 로그 기록 (통합 기록 스키마 활용)
                const 가입로그 = new 기록({
                    유형: '로그',
                    아이디: 데이터.아이디,
                    내용: '새로운 유저가 블랙에 합류했습니다.'
                });
                await 가입로그.save();

                return res.json({ 성공: true, 메세지: "회원가입에 성공했습니다!" });

            case '로그인':
                const 찾은유저 = await 조회유저.findOne({ 아이디: 데이터.아이디 });
                if (!찾은유저) {
                    return res.status(401).json({ 성공: false, 메세지: "아이디를 다시 확인해주세요." });
                }

                const 비번일치 = await 찾은유저.비밀번호확인(데이터.비번);
                if (!비번일치) {
                    return res.status(401).json({ 성공: false, 메세지: "비밀번호가 틀렸습니다." });
                }

                const 토큰 = jwt.sign({ 아이디: 찾은유저.아이디 }, SECRET_KEY, { expiresIn: '1d' });

                유저스탯계산(찾은유저);

                await 찾은유저.save();

                return res.json({ 성공: true, 데이터: 찾은유저, 토큰: 토큰 });

            case '회원탈퇴':
                // 1. 실제 유저가 존재하는지 확인 (상단 if문에서 이미 검증됨)
                if (유저) {
                    // 2. [핵심] 실제 DB에서 해당 유저 삭제
                    // 조회유저(유저모델)를 사용하여 해당 아이디를 가진 문서를 삭제합니다.
                    await 조회유저.deleteOne({ 아이디: 유저.아이디 });

                    // 3. 탈퇴 로그 기록 (선택 사항)
                    const 탈퇴로그 = new 기록({
                        유형: '로그',
                        아이디: 유저.아이디,
                        내용: '유저가 실제로 DB에서 삭제되었습니다.'
                    });
                    await 탈퇴로그.save();

                    return res.json({
                        성공: true,
                        메세지: "회원탈퇴가 완료되었습니다. 모든 데이터가 삭제되었습니다."
                    });
                } else {
                    return res.status(404).json({
                        성공: false,
                        메세지: "유저 정보를 찾을 수 없습니다."
                    });
                }

            case '모험시작':

                if (!유저) {
                    return res.status(404).json({ 성공: false, 메세지: "유저 정보를 찾을 수 없습니다." });
                }

                유저.챕터정보.진행 = 1;
                유저.챕터정보.일수 = 1; // 시작 시 1일차부터 시작하도록 초기화

                유저.챕터정보.챕터현재체력 = 유저.최종체력;
                유저.챕터정보.챕터최대체력 = 유저.최종체력;
                유저.챕터정보.챕터공격력 = 유저.최종공격력;
                유저.챕터정보.챕터방어력 = 유저.최종방어력;

                await 유저.save();

                return res.json({
                    성공: true,
                    데이터: 유저,
                });


            case '모험포기':

                if (!유저) {
                    return res.status(404).json({ 성공: false, 메세지: "유저 정보를 찾을 수 없습니다." });
                }

                유저.챕터정보.진행 = 0;
                유저.챕터정보.일수 = 1;
                유저.챕터정보.이벤트 = 0;
                유저.챕터정보.레벨 = 1;
                유저.챕터정보.레벨업 = 0;
                유저.챕터정보.경험치 = 0;
                유저.챕터정보.획득골드 = 0;

                유저.챕터정보.챕터현재체력 = 0;
                유저.챕터정보.챕터최대체력 = 0;
                유저.챕터정보.챕터공격력 = 0;
                유저.챕터정보.챕터방어력 = 0;

                유저.챕터정보.몬스터생성 = 0;
                유저.챕터정보.몬스터체력 = 0;
                유저.챕터정보.몬스터공격력 = 0;
                유저.챕터정보.몬스터방어력 = 0;
                유저.챕터정보.몬스터현재분노 = 0;
                유저.챕터정보.몬스터최대분노 = 0;

                유저.챕터정보.일번레벨업스킬 = 0;
                유저.챕터정보.이번레벨업스킬 = 0;
                유저.챕터정보.삼번레벨업스킬 = 0;

                유저.챕터정보.챕터스킬.검기 = 0;
                유저.챕터정보.챕터스킬.화염 = 0;
                유저.챕터정보.챕터스킬.번개 = 0;
                유저.챕터정보.챕터스킬.수리검 = 0;

                await 유저.save();

                return res.json({
                    성공: true,
                    데이터: 유저,
                });






            default:
                return res.status(400).json({ 성공: false, 메세지: "잘못된 요청 유형입니다." });
        }
    } catch (에러) {
        console.error('서버 에러:', 에러);
        res.status(500).json({ 성공: false, 메세지: "서버 내부 오류가 발생했습니다." });
    }
});

const 이벤트확률표 = {
    1: 10, // 경험치
    2: 5, // 중박체력
    3: 5, // 중박공격력
    4: 5, // 중박방어력
    5: 4,//체력디버프
    6: 4,//공격력디버프
    7: 4,//방어력디버프
    8: 1,//대박체력
    9: 1,//대박공격력
    10: 1,//대박방어력
    11: 1,//대박경험치
    12: 1,//체력회복
    98: 5,//일반몬스터조우
};

const 일반스킬목록 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const 전설스킬목록 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const 신화스킬목록 = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const 스킬목록 = Array.from({ length: 9 }, (_, i) => i + 1);

const 스킬등급확률표 = {
    1: 60,
    2: 30,
    3: 10,
};

const 일반스킬확률표 = {
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

const 전설스킬확률표 = {
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

const 신화스킬확률표 = {
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



//함수정의
function 확률판정(확률퍼센트) {
    return Math.random() * 100 < 확률퍼센트;
}
function 숫자뽑기(min, max) {
    const min소수 = (min.toString().split(".")[1] || "").length;
    const max소수 = (max.toString().split(".")[1] || "").length;
    const 소수자리 = Math.max(min소수, max소수);

    // 정수 여부 판단
    const 정수범위 = 소수자리 === 0;

    const 값 = 정수범위
        ? Math.random() * (max - min + 1) + min   // 정수: max 포함
        : Math.random() * (max - min) + min;      // 소수: max 미포함

    return 정수범위
        ? Math.floor(값)
        : Number(값.toFixed(소수자리));
}

// [1,3,5,7] 중 랜덤숫자 뽑기
function 보기뽑기(...값들) {
    return 값들[Math.floor(Math.random() * 값들.length)];
}

// 1 3 4 7 순서 섞기
function 셔플(...값들) {
    for (let i = 값들.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [값들[i], 값들[j]] = [값들[j], 값들[i]];
    }
    return 값들;
}

function 랜덤뽑기(확률표) {
    let 합 = 0;
    for (const k in 확률표) 합 += 확률표[k];

    let r = Math.random() * 합;
    for (const k in 확률표) {
        r -= 확률표[k];
        if (r <= 0) return Number(k);
    }
}

//유저스탯계산함수
function 유저스탯계산(유저) {
    let 공 = 유저.공격력;
    let 체 = 유저.체력;
    let 방 = 유저.방어력;

    // 장착 장비 합산 (기본 스탯에 장비 스탯을 먼저 더합니다)
    유저.장비.filter(item => item.장착여부 === 1).forEach(템 => {
        공 += 템.공격력 ?? 0;
        체 += 템.체력 ?? 0;
        방 += 템.방어력 ?? 0;
    });

    // 보너스 적용 (예: 20% -> 1 + 20/100 = 1.2)
    // 체력보너스가 0이어도 1이 곱해지므로 안전합니다.
    유저.최종체력 = Math.floor(체 * (1 + (유저.체력보너스 ?? 0) / 100));
    유저.최종공격력 = Math.floor(공 * (1 + (유저.공격력보너스 ?? 0) / 100));
    유저.최종방어력 = Math.floor(방 * (1 + (유저.방어력보너스 ?? 0) / 100));

    // 전투력 공식 (최종 스탯 기준으로 계산하는 것이 더 정확합니다)
    유저.전투력 = Math.floor((유저.최종공격력 * 5.5) + (유저.최종체력 * 1.25) + (유저.최종방어력 * 20));
}


// git init
// git add .
// git commit -m "first deploy"
// git branch -M main
// git remote add origin https://github.com/chogae/BLACKGO.git
// git push -u origin main

// chogae71_db_user
// jrgPdoqdAalhkEwp

// mongodb+srv://chogae71_db_user:jrgPdoqdAalhkEwp@blackgo.xho8fhv.mongodb.net/?appName=BLACKGO