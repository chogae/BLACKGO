import mongoose from 'mongoose';

const 유저서브스키마 = new mongoose.Schema({
    아이디: { type: String, required: true, unique: true, index: true },
    업데이트: { type: Number, default: 0 },
    점검중: { type: Number, default: 0 },
    버전: { type: Number, default: 0 },

    접속날짜: { type: String },
    접속요일: { type: String },
    접속시각: { type: String },
    접속시: { type: Number },
    접속분: { type: Number },
    접속초: { type: Number },
    접속IP: { type: String, default: "" },

    우편: [
        {
            이름: { type: String },
            내용: { type: String },

            날짜: { type: String },
            요일: { type: String },
            시각: { type: String },

            수량: { type: Number },
        },
    ],

});

const UserSub = mongoose.model('UserSub', 유저서브스키마);
export default UserSub;