import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import * as 정의 from "./공용정의.js";

const 유저스키마 = new mongoose.Schema({
    아이디: { type: String, required: true, unique: true, trim: true },
    비밀번호: { type: String, required: true },

    생성날짜: { type: String },
    생성요일: { type: String },
    생성시각: { type: String },
    생성시: { type: Number },
    생성분: { type: Number },
    생성초: { type: Number },
    생성IP: { type: String, default: "" },

    접속날짜: { type: String },
    접속요일: { type: String },
    접속시각: { type: String },
    접속시: { type: Number },
    접속분: { type: Number },
    접속초: { type: Number },
    접속IP: { type: String, default: "" },

    n일차: { type: Number, default: 1 },

    유저: { type: Number, default: 1 },
    주인장: { type: Number, default: 0 },

    배터리: { type: Number, default: 50 },
    최대배터리: { type: Number, default: 50 },
    총배터리: { type: Number, default: 0 },

    다이아: { type: Number, default: 0 },
    총다이아: { type: Number, default: 0 },

    골드: { type: Number, default: 0 },
    총골드: { type: Number, default: 0 },

    스톤: { type: Number, default: 0 },
    총스톤: { type: Number, default: 0 },

    양피지: { type: Number, default: 0 },
    총양피지: { type: Number, default: 0 },

    유물: [{
        이름: { type: String, required: true },
        활성: { type: Number, default: 0 },
        등급: { type: Number, default: 0 },
        효과: [],
    }],

    특성: {
        체력: { type: Number, default: 0 },
        공격력: { type: Number, default: 0 },
        방어력: { type: Number, default: 0 },
        속력: { type: Number, default: 0 },
    },
    계정: {
        ...정의.스탯스키마,
    },
    어빌리티: [{
        이름: { type: String, default: "" },
        등급: { type: Number, default: 0 },
    }],
    최종: {
        ...정의.스탯스키마,
    },
    장비: [{
        이름: { type: String, required: true },
        유형: { type: String, required: true },
        등급: { type: Number, default: 0 },
        장착: { type: Number, default: 0 },
        수량: { type: Number, default: 0 },
    }],

    무한지하감옥: {
        최고생존일수: { type: Number, default: 1 },
    },

    모험: {
        ...정의.스탯스키마,

        //초기화x
        악마성: { type: Number, default: 1 },
        최고생존일수: { type: Number, default: 1 },

        //초기화 0
        진행: { type: Number, default: 0 },
        전투: { type: Number, default: 0 },
        경험치: { type: Number, default: 0 },
        일반: { type: Number, default: 0 },
        히든: { type: Number, default: 0 },
        현재체력: { type: Number, default: 0 },
        최대체력: { type: Number, default: 0 },

        //초기화 1
        현재일수: { type: Number, default: 1 },
        레벨: { type: Number, default: 1 },

        //초기화 ""
        이벤트: { type: String, default: "" },
        보상메세지: { type: String, default: "" },

        스킬: [{
            이름: { type: String },
            등급: { type: String },
            레벨: { type: Number, default: 0 }
        }],

        스킬뽑기: [{
            이름: { type: String },
        }],

        획득스킬: { type: String },
    },

    쪽박체력: { type: Number, default: 0 },
    쪽박공격력: { type: Number, default: 0 },
    쪽박방어력: { type: Number, default: 0 },

    중박체력: { type: Number, default: 0 },
    중박공격력: { type: Number, default: 0 },
    중박방어력: { type: Number, default: 0 },

    대박체력: { type: Number, default: 0 },
    대박공격력: { type: Number, default: 0 },
    대박방어력: { type: Number, default: 0 },

    초대박체력: { type: Number, default: 0 },
    초대박공격력: { type: Number, default: 0 },
    초대박방어력: { type: Number, default: 0 },

    전투력: { type: Number, default: 0 },

    장비도감: {
        릴리트: { type: [Number], default: [0, 0, 0] },
        디아블로: { type: [Number], default: [0, 0, 0] },
        레비아탄: { type: [Number], default: [0, 0, 0] },
        벨제부브: { type: [Number], default: [0, 0, 0] },
        사탄: { type: [Number], default: [0, 0, 0] },
        루시퍼: { type: [Number], default: [0, 0, 0] },
        베히모스: { type: [Number], default: [0, 0, 0] },
        아바돈: { type: [Number], default: [0, 0, 0] },
        바론: { type: [Number], default: [0, 0, 0] },
    },

    장비슬롯: {
        무기: { type: Number, default: 0 },
        방어구: { type: Number, default: 0 },
        장갑: { type: Number, default: 0 },
        신발: { type: Number, default: 0 },
        목걸이: { type: Number, default: 0 },
        반지: { type: Number, default: 0 },
    },

    장비레벨: {
        무기: { type: Number, default: 0 },
        방어구: { type: Number, default: 0 },
        장갑: { type: Number, default: 0 },
        신발: { type: Number, default: 0 },
        목걸이: { type: Number, default: 0 },
        반지: { type: Number, default: 0 },
    },

    스킬도감: [String],

    인벤토리: [
        {
            이름: { type: String, required: true },
        }
    ],

}, {
    timestamps: {
        createdAt: '생성일시',
        updatedAt: '수정일시'
    }
});

유저스키마.pre('save', async function () {
    if (!this.isModified('비밀번호')) return;

    try {
        const 솔트 = await bcrypt.genSalt(10);
        this.비밀번호 = await bcrypt.hash(this.비밀번호, 솔트);
    } catch (에러) {
        throw 에러;
    }
});

유저스키마.methods.비밀번호확인 = async function (입력비번) {
    return await bcrypt.compare(입력비번, this.비밀번호);
};

const User = mongoose.model('User', 유저스키마);
export default User;