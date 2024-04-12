const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        name: String,
        price: {
            type: Number,
            // required: true,
            // 自訂訊息寫法
            required: [true, '價格是必填欄位']
        },
        rating: Number,
        // 自訂時間戳記
        creatsAt: {
            type: Date,
            default: Date.now,
            select: false,
        }
    },
    {
        versionKey: false,
        // 寫死 collection 名稱
        // collection:'room',
        // 建立時間戳記
        // timestamps: true
    }
)

// 建立 Model
const Room = mongoose.model('Room', roomSchema);
// collections 命名時系統會自動做
// 1.第一個字母轉小寫
// 2.字尾加s

module.exports = Room;