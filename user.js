import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const 유저스키마 = new mongoose.Schema({
    // 필수 정보
    아이디: { type: String, required: true, unique: true, trim: true },
    비밀번호: { type: String, required: true },

    생성정보: {
        날짜: String,
        요일: String,
        시각: String,
        타임스탬프: {
            시: Number,
            분: Number,
            초: Number
        },
        IP: { type: String, default: "" },
    },
    최근접속: {
        날짜: String,
        요일: String,
        시각: String,
        타임스탬프: {
            시: Number,
            분: Number,
            초: Number
        },
        IP: { type: String, default: "" },
    },

    현재스태미너: { type: Number, default: 1500 },
    최대스태미너: { type: Number, default: 1500 },
    총스태미너: { type: Number, default: 0 },

    현재골드: { type: Number, default: 0 },
    총골드: { type: Number, default: 0 },

    현재루비: { type: Number, default: 0 },
    총루비: { type: Number, default: 0 },

    접속일: { type: Number, default: 1 },

    주인장: { type: Number, default: 0 },

    악마성: { type: Number, default: 1 },
    최고층: { type: Number, default: 1 },
    히든: { type: Number, default: 0 },

    전투력: { type: Number, default: 0 },

    //스탯
    체력: { type: Number, default: 400 },
    공격력: { type: Number, default: 90 },
    방어력: { type: Number, default: 25 },
    속력: { type: Number, default: 10 },
    치명: { type: Number, default: 10 },
    치명계수: { type: Number, default: 150 },
    회복: { type: Number, default: 10 },
    회복계수: { type: Number, default: 15 },

    //보너스스탯
    생명: { type: Number, default: 100 },
    힘: { type: Number, default: 100 },
    인내: { type: Number, default: 100 },
    민첩: { type: Number, default: 100 },
    운: { type: Number, default: 100 },
    감각: { type: Number, default: 100 },
    지능: { type: Number, default: 100 },
    정신: { type: Number, default: 100 },

    생명최대치: { type: Number, default: 100 },
    힘최대치: { type: Number, default: 100 },
    인내최대치: { type: Number, default: 100 },
    민첩최대치: { type: Number, default: 100 },
    운최대치: { type: Number, default: 100 },
    감각최대치: { type: Number, default: 100 },
    지능최대치: { type: Number, default: 100 },
    정신최대치: { type: Number, default: 100 },

    생명체크: { type: Number, default: 0 },
    힘체크: { type: Number, default: 0 },
    인내체크: { type: Number, default: 0 },
    민첩체크: { type: Number, default: 0 },
    운체크: { type: Number, default: 0 },
    감각체크: { type: Number, default: 0 },
    지능체크: { type: Number, default: 0 },
    정신체크: { type: Number, default: 0 },

    현재체력: { type: Number, default: 0 },
    최종체력: { type: Number, default: 0 },
    최종공격력: { type: Number, default: 0 },
    최종방어력: { type: Number, default: 0 },
    최종속력: { type: Number, default: 0 },
    최종치명: { type: Number, default: 0 },
    최종치명계수: { type: Number, default: 0 },
    최종회복: { type: Number, default: 0 },
    최종회복계수: { type: Number, default: 0 },

    스킬: {
        번개: { type: Number, default: 0 },
        수리검: { type: Number, default: 0 },
        보호막: { type: Number, default: 0 },
        얼음가시: { type: Number, default: 0 },
        광창: { type: Number, default: 0 },
        화염파: { type: Number, default: 0 },

        강타: { type: Number, default: 0 },
        연타: { type: Number, default: 0 },
        강인: { type: Number, default: 0 },
        흡혈: { type: Number, default: 0 },
        회복: { type: Number, default: 0 },

    },

    장비: [{
        이름: { type: String, required: true },
        유형: { type: String, required: true },
        스킬: { type: String, default: "" },
        등급: { type: Number, default: 0 },
        레벨: { type: Number, default: 1 },
        장착: { type: Number, default: 0 },

        체력: { type: Number, default: 0 },
        공격력: { type: Number, default: 0 },
        방어력: { type: Number, default: 0 },
        속력: { type: Number, default: 0 },

        치명: { type: Number, default: 0 },
        치명계수: { type: Number, default: 0 },
        회복: { type: Number, default: 0 },
        회복계수: { type: Number, default: 0 },
    }],

    장비슬롯: {
        무기레벨: { type: Number, default: 0 },
        방어구레벨: { type: Number, default: 0 },
        장갑레벨: { type: Number, default: 0 },
        신발레벨: { type: Number, default: 0 },
        목걸이레벨: { type: Number, default: 0 },
        반지레벨: { type: Number, default: 0 },
    },

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