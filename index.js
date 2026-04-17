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

        switch (유형) {
            case '회원가입':
                if (데이터.아이디.length > 6) {
                    return res.status(400).json({ 성공: false, 메세지: "아이디는 6자 이내여야 합니다." });
                }
                const 기존유저 = await 조회유저.findOne({ 아이디: 데이터.아이디 });
                if (기존유저) {
                    return res.status(400).json({ 성공: false, 메세지: "이미 존재하는 아이디입니다." });
                }

                const 새유저 = new 조회유저({
                    아이디: 데이터.아이디,
                    비밀번호: 데이터.비번
                });
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

            case '모험시작':
            case '모험포기':
                if (!유저) return res.status(404).json({ 성공: false, 메세지: "유저 정보 없음" });

                // 여기에 모험 관련 로직 추가 가능
                await 유저.save();
                return res.json({ 성공: true, 데이터: 유저 });

            case '회원탈퇴':
                if (유저) {
                    await 조회유저.deleteOne({ 아이디: 유저.아이디 });
                    return res.json({ 성공: true, 메세지: "탈퇴 완료" });
                }
                return res.status(404).json({ 성공: false, 메세지: "유저 없음" });

            default:
                return res.status(400).json({ 성공: false, 메세지: "잘못된 요청" });
        }
    } catch (에러) {
        console.error('서버 에러:', 에러);
        res.status(500).json({ 성공: false, 메세지: "서버 내부 오류" });
    }
});

// 7. 유저 스탯 계산 함수
function 유저스탯계산(유저) {
    let 공 = 유저.공격력;
    let 체 = 유저.체력;
    let 방 = 유저.방어력;

    if (유저.장비) {
        유저.장비.filter(item => item.장착 === 1).forEach(템 => {
            공 += 템.공격력 ?? 0;
            체 += 템.체력 ?? 0;
            방 += 템.방어력 ?? 0;
        });
    }

    유저.최종체력 = Math.floor(체 * (1 + (유저.보너스체력 ?? 0) / 100));
    유저.최종공격력 = Math.floor(공 * (1 + (유저.보너스공격력 ?? 0) / 100));
    유저.최종방어력 = Math.floor(방 * (1 + (유저.보너스방어력 ?? 0) / 100));
    유저.전투력 = Math.floor((유저.최종공격력 * 5.5) + (유저.최종체력 * 1.25) + (유저.최종방어력 * 20));
}

// 8. 서버 실행
app.listen(포트, () => {
    console.log(`🚀 서버가 포트 ${포트}에서 실행 중입니다.`);
});