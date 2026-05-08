import mongoose from 'mongoose';

const 기록스키마 = new mongoose.Schema({
    유형: { type: String, required: true, index: true }, // '채팅', '우편', '로그', '시스템'
    내용: { type: String, },
    아이디: { type: String, index: true }, // 관련 유저
    생성일: { type: Date, default: Date.now }
});

// module.exports 대신 export default를 사용합니다.
const 기록 = mongoose.model('Log', 기록스키마);
export default 기록;