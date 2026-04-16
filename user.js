import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const 유저스키마 = new mongoose.Schema({
    // 필수 정보
    아이디: { type: String, required: true, unique: true, trim: true },
    비밀번호: { type: String, required: true },

    현재스태미너: { type: Number, default: 30 },
    최대스태미너: { type: Number, default: 30 },
    총스태미너: { type: Number, default: 0 },

    현재골드: { type: Number, default: 0 },
    총골드: { type: Number, default: 0 },
    현재다이아: { type: Number, default: 0 },
    총다이아: { type: Number, default: 0 },

    접속일: { type: Number, default: 1 },

    체력: { type: Number, default: 400 },
    공격력: { type: Number, default: 90 },
    방어력: { type: Number, default: 25 },
    전투력: { type: Number, default: 0 },

    보너스체력: { type: Number, default: 0 },
    보너스공격력: { type: Number, default: 0 },
    보너스방어력: { type: Number, default: 0 },
    치명타확률: { type: Number, default: 0 },
    치명타데미지: { type: Number, default: 0 },

    최종체력: { type: Number, default: 0 },
    최종공격력: { type: Number, default: 0 },
    최종방어력: { type: Number, default: 0 },

    챕터정보: {
        챕터: { type: Number, default: 1 },
        진행: { type: Number, default: 0 },
        레벨: { type: Number, default: 1 },
        레벨업: { type: Number, default: 0 },
        획득경험치: { type: Number, default: 0 },
        획득골드: { type: Number, default: 0 },
        경험치: { type: Number, default: 0 },
        최고생존일수: { type: Number, default: 1 },
        일수: { type: Number, default: 1 },
        이벤트: { type: Number, default: 0 },
        챕터현재체력: { type: Number, default: 0 },
        챕터최대체력: { type: Number, default: 0 },
        챕터공격력: { type: Number, default: 0 },
        챕터방어력: { type: Number, default: 0 },
        분노: { type: Number, default: 0 },

        몬스터생성: { type: Number, default: 0 },
        몬스터체력: { type: Number, default: 0 },
        몬스터공격력: { type: Number, default: 0 },
        몬스터방어력: { type: Number, default: 0 },
        몬스터현재분노: { type: Number, default: 0 },
        몬스터최대분노: { type: Number, default: 0 },

        일번레벨업스킬: { type: Number, default: 0 },
        이번레벨업스킬: { type: Number, default: 0 },
        삼번레벨업스킬: { type: Number, default: 0 },

        챕터스킬: {
            검기: { type: Number, default: 0 },
            화염: { type: Number, default: 0 },
            번개: { type: Number, default: 0 },
            수리검: { type: Number, default: 0 },
        },
    },

    발동스킬: {
        검기: { type: Number, default: 0 },
        화염: { type: Number, default: 0 },
        번개: { type: Number, default: 0 },
        수리검: { type: Number, default: 0 },
    },

    장비: [{
        이름: { type: String, required: true },
        유형: { type: String, required: true },
        스킬: { type: String, default: "" },
        등급: { type: Number, default: 1 },
        레벨: { type: Number, default: 1 },
        장착: { type: Number, default: 0 },
        체력: { type: Number, default: 0 },
        공격력: { type: Number, default: 0 },
        방어력: { type: Number, default: 0 },
    }]
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