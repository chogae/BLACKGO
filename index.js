import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. 설정 및 기본 변수
dotenv.config();
const SECRET_KEY = 'YOUR_VERY_SECRET_KEY';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); // 한 번만 선언!
const 포트 = process.env.PORT || 5000;

// 2. 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// 3. 모델 및 공용 정의 임포트 (반드시 .js 확장자 포함)
import 조회유저 from './user.js';
import 기록 from './log.js';
import * as 정의 from "./공용정의.js";

for (const 이름 in 정의) {
    global[이름] = 정의[이름];
}

if (정의.스타일) {
    for (const 이름 in 정의.스타일) {
        global[이름] = 정의.스타일[이름];
    }
}

if (정의.색상) {
    for (const 이름 in 정의.색상) {
        global[이름] = 정의.색상[이름];
    }
}

// 4. DB 연결
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ BLACK 데이터베이스 연결 성공!'))
    .catch(err => console.error('❌ DB 연결 실패:', err));

// 5. 기본 라우트
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client.html'));
});

// 6. 통합 API 엔드포인트
app.post('/api', async (req, res) => {
    const { 유형, 데이터 } = req.body;
    let 유저 = null;
    const 접속IP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    try {
        // 토큰 검증 로직
        if (유형 !== '로그인' && 유형 !== '회원가입') {
            if (!데이터 || !데이터.토큰) {
                return res.status(401).json({ 성공: false, 메세지: "인증 토큰이 없습니다." });
            }

            try {
                const 해독됨 = jwt.verify(데이터.토큰, SECRET_KEY);
                // 변수 선언(const) 추가로 에러 방지
                const 해독된아이디 = 해독됨.아이디;
                유저 = await 조회유저.findOne({ 아이디: 해독된아이디 });

                if (!유저) {
                    return res.status(401).json({ 성공: false, 메세지: "유저를 찾을 수 없습니다." });
                }
            } catch (토큰에러) {
                return res.status(401).json({ 성공: false, 메세지: "인증이 만료되었습니다." });
            }
        }

        const 스탯목록 = [
            '생명최대치', '힘최대치', '인내최대치', '민첩최대치',
            '운최대치', '감각최대치', '지능최대치', '정신최대치'
        ];


        switch (유형) {
            case '회원가입':
                if (데이터.아이디.length > 6) {
                    return res.status(400).json({ 성공: false, 메세지: "아이디는 6자 이내여야 합니다." });
                }
                const 기존유저 = await 조회유저.findOne({ 아이디: 데이터.아이디 });
                if (기존유저) {
                    return res.status(400).json({ 성공: false, 메세지: "이미 존재하는 아이디입니다." });
                }

                const now = new Date();
                const 년월 = now.toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" });
                const 요일 = now.toLocaleDateString("ko-KR", { weekday: "long", timeZone: "Asia/Seoul" });
                const 시각 = now.toLocaleTimeString("ko-KR", { timeZone: "Asia/Seoul" });

                const ms = now.getTime();
                const 시 = Math.floor(ms / 3600000);
                const 분 = Math.floor(ms / 60000);
                const 초 = Math.floor(ms / 1000);
                // --- 시간 데이터 생성 끝 ---

                const 새유저 = new 조회유저({
                    아이디: 데이터.아이디,
                    비밀번호: 데이터.비번,
                    // 스키마에 추가할 시간 정보
                    생성정보: {
                        날짜: 년월,
                        요일: 요일,
                        시각: 시각,
                        타임스탬프: { 시, 분, 초 },
                        IP: 접속IP,
                    },
                    최근접속: {
                        날짜: 년월,
                        요일: 요일,
                        시각: 시각,
                        타임스탬프: { 시, 분, 초 },
                        IP: 접속IP,

                    }
                });
                새유저.주인장 = 새유저.생성정보.IP === `::1` ? 1 : 0;
                // const 새유저 = new 조회유저({
                //     아이디: 데이터.아이디,
                //     비밀번호: 데이터.비번
                // });
                await 새유저.save();
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
                if (유저) {
                    await 조회유저.deleteOne({ 아이디: 유저.아이디 });
                    return res.json({ 성공: true, 메세지: "탈퇴 완료" });
                }
                return res.status(404).json({ 성공: false, 메세지: "유저 없음" });


            case '레벨생명체크':
                if (!유저) return res.status(404).json({ 성공: false, 메세지: "유저 정보 없음" });
                if (!유저.주인장) {
                    유저.현재스태미너 -= 1;
                    유저.총스태미너 += 1;
                }
                유저.생명체크 = !유저.생명체크;
                await 유저.save();
                return res.json({ 성공: true, 데이터: 유저 });

            case '레벨힘체크':
                if (!유저) return res.status(404).json({ 성공: false, 메세지: "유저 정보 없음" });
                if (!유저.주인장) {
                    유저.현재스태미너 -= 1;
                    유저.총스태미너 += 1;
                }
                유저.힘체크 = !유저.힘체크;
                await 유저.save();
                return res.json({ 성공: true, 데이터: 유저 });

            case '레벨인내체크':
                if (!유저) return res.status(404).json({ 성공: false, 메세지: "유저 정보 없음" });
                if (!유저.주인장) {
                    유저.현재스태미너 -= 1;
                    유저.총스태미너 += 1;
                }
                유저.인내체크 = !유저.인내체크;
                await 유저.save();
                return res.json({ 성공: true, 데이터: 유저 });

            case '레벨민첩체크':
                if (!유저) return res.status(404).json({ 성공: false, 메세지: "유저 정보 없음" });
                if (!유저.주인장) {
                    유저.현재스태미너 -= 1;
                    유저.총스태미너 += 1;
                }
                유저.민첩체크 = !유저.민첩체크;
                await 유저.save();
                return res.json({ 성공: true, 데이터: 유저 });

            case '레벨운체크':
                if (!유저) return res.status(404).json({ 성공: false, 메세지: "유저 정보 없음" });
                if (!유저.주인장) {
                    유저.현재스태미너 -= 1;
                    유저.총스태미너 += 1;
                }
                유저.운체크 = !유저.운체크;
                await 유저.save();
                return res.json({ 성공: true, 데이터: 유저 });

            case '레벨감각체크':
                if (!유저) return res.status(404).json({ 성공: false, 메세지: "유저 정보 없음" });
                if (!유저.주인장) {
                    유저.현재스태미너 -= 1;
                    유저.총스태미너 += 1;
                }
                유저.감각체크 = !유저.감각체크;
                await 유저.save();
                return res.json({ 성공: true, 데이터: 유저 });

            case '레벨지능체크':
                if (!유저) return res.status(404).json({ 성공: false, 메세지: "유저 정보 없음" });
                if (!유저.주인장) {
                    유저.현재스태미너 -= 1;
                    유저.총스태미너 += 1;
                }
                유저.지능체크 = !유저.지능체크;
                await 유저.save();
                return res.json({ 성공: true, 데이터: 유저 });

            case '레벨정신체크':
                if (!유저) return res.status(404).json({ 성공: false, 메세지: "유저 정보 없음" });
                if (!유저.주인장) {
                    유저.현재스태미너 -= 1;
                    유저.총스태미너 += 1;
                }
                유저.정신체크 = !유저.정신체크;
                await 유저.save();
                return res.json({ 성공: true, 데이터: 유저 });

            case '레벨강화':
                if (!유저) return res.status(404).json({ 성공: false, 메세지: "유저 정보 없음" });

                const 합계 = 유저.생명최대치 + 유저.힘최대치 + 유저.인내최대치 + 유저.민첩최대치 +
                    유저.운최대치 + 유저.감각최대치 + 유저.지능최대치 + 유저.정신최대치;

                const 단계 = Math.floor((합계 - 800) / 100);
                const 레벨강화비용 = 10 * (2 ** Math.max(0, 단계));

                if (!유저.주인장) {
                    if (유저.현재숙련도 < 레벨강화비용) {
                        return res.json({ 성공: false, 메세지: "숙련도가 부족합니다." });
                    }
                    유저.현재숙련도 -= 레벨강화비용;
                    유저.총숙련도 += 레벨강화비용;
                }

                const 랜덤인덱스 = Math.floor(Math.random() * 스탯목록.length);
                const 결정된스탯 = 스탯목록[랜덤인덱스];

                유저[결정된스탯] += 1;

                await 유저.save();
                return res.json({ 성공: true, 데이터: 유저, 랜덤인덱스 });

            case '레벨풀강화':
                if (!유저) return res.status(404).json({ 성공: false, 메세지: "유저 정보 없음" });

                let 강화횟수 = 0;

                while (true) {
                    const 합계 = 유저.생명최대치 + 유저.힘최대치 + 유저.인내최대치 + 유저.민첩최대치 +
                        유저.운최대치 + 유저.감각최대치 + 유저.지능최대치 + 유저.정신최대치;

                    const 단계 = Math.floor((합계 - 800) / 100);
                    const 레벨풀강화비용 = 10 * (2 ** Math.max(0, 단계));

                    if (!유저.주인장) {
                        if (유저.현재숙련도 < 레벨풀강화비용) break;

                        유저.현재숙련도 -= 레벨풀강화비용;
                        유저.총숙련도 += 레벨풀강화비용;
                    } else {
                        if (강화횟수 >= 100) break;
                    }

                    // 2. 랜덤 스탯 강화
                    const 랜덤인덱스 = Math.floor(Math.random() * 스탯목록.length);
                    const 결정된스탯 = 스탯목록[랜덤인덱스];
                    유저[결정된스탯] += 1;

                    강화횟수++;
                }

                if (강화횟수 === 0) {
                    return res.json({ 성공: false, 메세지: "강화할 숙련도가 부족합니다." });
                }

                await 유저.save();
                return res.json({ 성공: true, 데이터: 유저 });

            case '레벨리롤':
                if (!유저) return res.status(404).json({ 성공: false, 메세지: "유저 정보 없음" });

                const 스탯정보 = [
                    { 명칭: '생명', 최대치: '생명최대치', 체크: 유저.생명체크 },
                    { 명칭: '힘', 최대치: '힘최대치', 체크: 유저.힘체크 },
                    { 명칭: '인내', 최대치: '인내최대치', 체크: 유저.인내체크 },
                    { 명칭: '민첩', 최대치: '민첩최대치', 체크: 유저.민첩체크 },
                    { 명칭: '운', 최대치: '운최대치', 체크: 유저.운체크 },
                    { 명칭: '감각', 최대치: '감각최대치', 체크: 유저.감각체크 },
                    { 명칭: '지능', 최대치: '지능최대치', 체크: 유저.지능체크 },
                    { 명칭: '정신', 최대치: '정신최대치', 체크: 유저.정신체크 }
                ];

                // 리롤할 항목들 (체크 안 된 것)
                const 리롤대상 = 스탯정보.filter(항목 => !항목.체크);

                // 잠긴 항목들 (체크 된 것) 개수 구하기
                const 잠금개수 = 스탯정보.length - 리롤대상.length;

                if (리롤대상.length === 0) {
                    return res.json({ 성공: false, 메세지: "리롤할 스탯이 없습니다. (모두 잠금 상태)" });
                }

                const 리롤비용 = 10 * (4 ** 잠금개수);

                if (!유저.주인장) {
                    if (유저.현재숙련도 < 리롤비용) {
                        return res.json({ 성공: false, 메세지: `숙련도가 부족합니다. (필요: ${리롤비용})` });
                    }
                    유저.현재숙련도 -= 리롤비용;
                    유저.총숙련도 += 리롤비용;
                }

                // 리롤 실행
                리롤대상.forEach(항목 => {
                    유저[항목.명칭] = 숫자뽑기(100, 유저[항목.최대치]);
                });

                유저스탯계산(유저);

                await 유저.save();
                return res.json({ 성공: true, 데이터: 유저 });


            case '전당조회':
                try {
                    const 유저들 = await 조회유저.find({})
                        .sort({ 전투력 })
                        .limit(100)
                        .lean();

                    return res.json({ 성공: true, 유저들: 유저들 });
                } catch (에러) {
                    return res.status(500).json({ 성공: false, 메세지: "데이터 조회 중 오류 발생" });
                }




            case '아래층으로':
                if (!유저) return res.status(404).json({ 성공: false, 메세지: "유저 정보 없음" });


                if (유저.악마성 === 1) {
                    return res.json({ 성공: false, 메세지: `마법진이 가로막습니다` });
                }

                유저.악마성--;

                await 유저.save();
                return res.json({ 성공: true, 데이터: 유저, });



            case '위층으로':
                if (!유저) return res.status(404).json({ 성공: false, 메세지: "유저 정보 없음" });


                if (유저.악마성 > 유저.최고층) {
                    return res.json({ 성공: false, 메세지: `마법진이 가로막습니다` });
                }

                유저.악마성++;

                await 유저.save();
                return res.json({ 성공: true, 데이터: 유저, });



            case '슬롯강화':
                if (!유저) return res.status(404).json({ 성공: false, 메세지: "유저 정보 없음" });

                const 슬롯강화비용 = 1000 * (유저[데이터.슬롯] + 1);
                if (!유저.주인장) {
                    if (유저.현재골드 < 슬롯강화비용) {
                        return res.json({ 성공: false, 메세지: `골드가 부족합니다` });

                    }

                    유저.현재골드 -= 슬롯강화비용;
                    유저.총골드 += 슬롯강화비용;

                }

                유저[데이터.슬롯]++;

                await 유저.save();
                return res.json({ 성공: true, 데이터: 유저, });



            case '악마성전투':
                if (!유저) return res.status(404).json({ 성공: false, 메세지: "유저 정보 없음" });

                if (!유저.주인장) {
                    if (유저.현재스태미너 <= 0) {
                        return res.json({ 성공: false, 메세지: `스태미너가 부족합니다` });
                    }
                    유저.현재스태미너 -= 1;
                    유저.총스태미너 += 1;
                }

                let 몬스터;
                let 전투결과 = {};
                let 히든;
                let 드랍템 = {};

                몬스터 = 몬스터스탯계산(유저);

                if (유저.히든) {
                    몬스터.아이디 = 등급테이블[유저.히든].몬스터;
                } else {
                    몬스터.아이디 = 랜덤뽑기(일반몬스터);
                }

                히든 = 유저.히든;
                전투결과 = 전투시뮬레이션(유저, 몬스터);

                유저.현재체력 = (전투결과.승패 === 0) ? 유저.최종체력 : 전투결과.유저현재체력;
                몬스터.현재체력 = 전투결과.상대현재체력;

                if (전투결과.승패) {
                    let 보상골드 = 숫자뽑기(유저.악마성 * 80, 유저.악마성 * 120);
                    유저.현재골드 += 보상골드;
                    유저.총골드 += 보상골드;
                    전투결과.골드 = 보상골드;

                    if (유저.최고층 < 유저.악마성) {
                        유저.최고층 = 유저.악마성;
                    }
                    유저.현재숙련도 += 유저.악마성;
                    유저.총숙련도 += 유저.악마성;

                    if (유저.히든) {
                        const 해당등급정보 = 등급테이블.find(v => v.등급 === 유저.히든);

                        if (해당등급정보 && 해당등급정보.아이템 && 해당등급정보.아이템.length > 0) {
                            // 2. 해당 등급의 아이템 배열 중 하나를 랜덤으로 선택
                            const 랜덤아이템 = 랜덤뽑기(해당등급정보.아이템);
                            드랍템.이름 = 랜덤아이템.이름;
                            드랍템.등급 = 유저.히든;
                            드랍템.효과 = 랜덤아이템.효과;
                            // 3. 인벤토리 배열에 추가 (기존 인벤토리 보존)
                            유저.인벤토리.push({
                                이름: 랜덤아이템.이름,
                                등급: 유저.히든,
                                효과: 랜덤아이템.효과,
                            });
                        }
                    }

                }

                if (확률판정(유저.주인장 ? 50 : 6)) {
                    유저.히든 = 확률숫자뽑기(유저.주인장 ? 주인장등급확률표 : 등급확률표);
                } else {
                    유저.히든 = 0;
                }

                유저스탯계산(유저);
                await 유저.save();

                return res.json({
                    성공: true,
                    데이터: 유저,
                    상대: 몬스터,
                    전투결과,
                    히든,
                    드랍템,
                });







            default:
                return res.status(400).json({ 성공: false, 메세지: "잘못된 요청" });
        }
    } catch (에러) {
        console.error('서버 에러:', 에러);
        res.status(500).json({ 성공: false, 메세지: "서버 내부 오류" });
    }
});

//몬스터스탯계산함수
function 몬스터스탯계산(유저) {

    const 최종체력 = Math.floor(유저.악마성 * 숫자뽑기(180, 220));
    const 현재체력 = 최종체력;
    const 최종공격력 = Math.floor(유저.악마성 * 숫자뽑기(35, 55));
    const 최종방어력 = Math.floor(유저.악마성 * 숫자뽑기(10, 15));
    const 최종속력 = Math.floor(유저.악마성 * 숫자뽑기(5, 15));

    const 최종치명 = Math.floor(유저.악마성 * 숫자뽑기(5, 15));
    const 최종치명계수 = Math.floor(유저.악마성 * 숫자뽑기(120, 180));
    const 최종회복 = Math.floor(유저.악마성 * 숫자뽑기(5, 15));
    const 최종회복계수 = Math.floor(유저.악마성 * 숫자뽑기(10, 20));
    let 아이디 = ``;
    return {
        최종체력,
        현재체력,
        최종공격력,
        최종방어력,
        최종속력,
        최종치명,
        최종치명계수,
        최종회복,
        최종회복계수,
        아이디,
    }


}

//전투시뮬레이션함수
function 전투시뮬레이션(유저, 상대) {
    let 로그 = {}; // ⭐️ 배열 대신 객체로 선언 {}
    let 유저현재체력 = 유저.현재체력;
    let 상대현재체력 = 상대.최종체력;
    let 턴 = 0;

    while (유저현재체력 > 0 && 상대현재체력 > 0) {
        턴++;
        로그[턴] = [];

        // 1. 유저 공격
        const 유저데미지 = Math.max(1, Math.floor(유저.최종공격력 - 상대.최종방어력));
        let 유저랜덤데미지 = Math.floor(숫자뽑기(유저데미지 * 0.8, 유저데미지 * 1.1));
        상대현재체력 -= 유저랜덤데미지;

        로그[턴].push({
            공격자: "유저",
            데미지: 유저랜덤데미지,
            유저현재체력: Math.max(0, 유저현재체력),
            상대현재체력: Math.max(0, 상대현재체력),
        });

        if (상대현재체력 <= 0) break;

        // 2. 상대 공격
        const 상대데미지 = Math.max(1, Math.floor(상대.최종공격력 - 유저.최종방어력));
        let 상대랜덤데미지 = Math.floor(숫자뽑기(상대데미지 * 0.8, 상대데미지 * 1.1));
        유저현재체력 -= 상대랜덤데미지;

        로그[턴].push({
            공격자: "상대",
            데미지: 상대랜덤데미지,
            상대현재체력: Math.max(0, 상대현재체력),
            유저현재체력: Math.max(0, 유저현재체력),
        });

        if (유저현재체력 <= 0) break;
        if (턴 >= 200) break;
    }

    let 승패 = 유저현재체력 > 0 ? 1 : 0;
    if (턴 >= 200) 승패 = 2;

    return { 승패, 로그, 유저현재체력, 상대현재체력 };
}

// 7. 유저 스탯 계산 함수
function 유저스탯계산(유저) {
    let 장비체 = 0;
    let 장비공격 = 0;
    let 장비방어 = 0;
    let 장비속 = 0;

    let 장비치 = 0;
    let 장비치계 = 0;
    let 장비회 = 0;
    let 장비회계 = 0;

    if (유저.장비) {
        유저.장비.filter(item => item.장착 === 1).forEach(템 => {
            장비체 += 템.체력 ?? 0;
            장비공격 += 템.공격력 ?? 0;
            장비방어 += 템.방어력 ?? 0;
            장비속 += 템.속력 ?? 0;

            장비치 += 템.치명 ?? 0;
            장비치계 += 템.치명계수 ?? 0;
            장비회 += 템.회복 ?? 0;
            장비회계 += 템.회복계수 ?? 0;
        });
    }


    유저.최종체력 = Math.floor((유저.체력 + 장비체) * (유저.생명 * 0.01));
    유저.현재체력 = 유저.현재체력 ? 유저.현재체력 : 유저.최종체력;
    유저.최종공격력 = Math.floor((유저.공격력 + 장비공격) * (유저.힘 * 0.01));
    유저.최종방어력 = Math.floor((유저.방어력 + 장비방어) * (유저.인내 * 0.01));
    유저.최종속력 = Math.floor((유저.속력 + 장비속) * (유저.민첩 * 0.01));

    유저.최종치명 = Math.floor((유저.치명 + 장비치) * (유저.운 * 0.01));
    유저.최종치명계수 = Math.floor((유저.치명계수 + 장비치계) * (유저.감각 * 0.01));

    유저.최종회복 = Math.floor((유저.회복 + 장비회) * (유저.지능 * 0.01));
    유저.최종회복계수 = Math.floor((유저.회복계수 + 장비회계) * (유저.정신 * 0.01));

    유저.전투력 = Math.floor(
        0
        + (유저.최종체력 * 1)
        + (유저.최종공격력 * 4.4)
        + (유저.최종방어력 * 16)
        + (유저.최종속력 * 40)

        + (유저.최종치명 * 40)
        + (유저.최종치명계수 * 2.5)
        + (유저.최종회복 * 40)
        + (유저.최종회복계수 * 26)
    );

}

// 8. 서버 실행
app.listen(포트, () => {
    console.log(`🚀 서버가 포트 ${포트}에서 실행 중입니다.`);
});