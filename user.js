import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const 유저스키마 = new mongoose.Schema({
    // 필수 정보
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

    현재스태미너: { type: Number, default: 1500 },
    최대스태미너: { type: Number, default: 1500 },
    총스태미너: { type: Number, default: 0 },

    현재골드: { type: Number, default: 0 },
    총골드: { type: Number, default: 0 },

    현재루비: { type: Number, default: 0 },
    총루비: { type: Number, default: 0 },

    현재숙련도: { type: Number, default: 0 },
    총숙련도: { type: Number, default: 0 },

    현재가루: { type: Number, default: 0 },
    총가루: { type: Number, default: 0 },

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

    생명물약최대치: { type: Number, default: 0 },
    힘물약최대치: { type: Number, default: 0 },
    인내물약최대치: { type: Number, default: 0 },
    민첩물약최대치: { type: Number, default: 0 },
    운물약최대치: { type: Number, default: 0 },
    감각물약최대치: { type: Number, default: 0 },
    지능물약최대치: { type: Number, default: 0 },
    정신물약최대치: { type: Number, default: 0 },

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

    },

    장비: [{
        이름: { type: String, required: true },
        유형: { type: String, required: true },
        스킬: { type: String, default: "" },
        등급: { type: Number, default: 0 },
        레벨: { type: Number, default: 1 },
        장착: { type: Number, default: 0 },

        현재내구도: { type: Number, default: 0 },
        최대내구도: { type: Number, default: 0 },


        체력: { type: Number, default: 0 },
        공격력: { type: Number, default: 0 },
        방어력: { type: Number, default: 0 },
        속력: { type: Number, default: 0 },

        치명: { type: Number, default: 0 },
        치명계수: { type: Number, default: 0 },
        회복: { type: Number, default: 0 },
        회복계수: { type: Number, default: 0 },

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
        },

    }],

    무기슬롯: { type: Number, default: 0 }, //공
    방어구슬롯: { type: Number, default: 0 }, //방
    장갑슬롯: { type: Number, default: 0 }, //속
    신발슬롯: { type: Number, default: 0 }, //체
    목걸이슬롯: { type: Number, default: 0 }, //치 치계
    반지슬롯: { type: Number, default: 0 }, //회 회계

    인벤토리: [
        {
            이름: { type: String, required: true },
            등급: { type: Number, default: 0 },
            효과: { type: String, required: true },

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