const http = require("http");
// model 命名建議開頭大寫，以視區別
const Room = require("./models/room");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { resolveSoa } = require("dns");

dotenv.config({ path: "./config.env" });
console.log(process.env.PORT);

const DB = process.env.DATABASE.replace(
    "<password>",
    process.env.DATABASE_PASSWORD
);

// 連接資料庫
// mongoose.connect('mongodb://127.0.0.1:27017/hotel')
// mongoose.connect('mongodb://localhost:27017/hotel')
// mongoose.connect('mongodb+srv://touki741:a0975217832@cluster0.jqxtsu7.mongodb.net/hotel?retryWrites=true&w=majority&appName=Cluster0')
mongoose.connect(DB)
    .then(() => {
        console.log('資料庫連線成功');
    }).catch((error) => {
        console.log(error)
    });

// const roomSchema = new mongoose.Schema(
//     {
//         name: String,
//         price: {
//             type: Number,
//             // required: true,
//             // 自訂訊息寫法
//             required: [true, '價格是必填欄位']
//         },
//         rating: Number,
//         // 自訂時間戳記
//         creatsAt: {
//             type: Date,
//             default: Date.now,
//             select: false,
//         }
//     },
//     {
//         versionKey: false,
//         // 寫死 collection 名稱
//         // collection:'room',
//         // 建立時間戳記
//         // timestamps: true
//     }
// )


// // 建立 Model
// const Room = mongoose.model('Room', roomSchema);
// // collections 命名時系統會自動做
// // 1.第一個字母轉小寫
// // 2.字尾加s

// // 法2：使用 create() 新增資料
// Room.create(
//     {
//         name: '我是測試房3',
//         price: 2000,
//         rating: 4.5,
//     }
// ).then(() => {
//     console.log('新增資料成功');
// }).catch((error) => {
//     console.log(error.errors);
// });

// 法1：建立實體來新增資料
// // 建立實例(instance)
// const testRoom = new Room({
//     name: '我是測試房',
//     price: 2000,
//     rating: 4.5,
// });

// // 新增資料
// testRoom.save()
//     .then(() => {
//         console.log('新增資料成功');
//     }).catch(error => {
//         console.log(error.errors);
//     });

// 測試"刪除單筆"邏輯
// Room.findByIdAndDelete("6618f88b3254cc0ae9680716").then(() => {
//     console.log("更新成功");
// });

// 測試"更新單筆"邏輯
// Room.findByIdAndUpdate("6618f944fd2570d99645a277", {
//     // 修改的欄位可以不用全部都寫
//     "name": "預購5月房型優惠"
// }).then(() => {
//     console.log("更新成功")
// });

const requestListener = async (req, res) => {
    // console.log(req.url);
    let body = '';
    req.on('data', (chunk) => {
        // console.log(chunk);
        body += chunk;
    });
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    };
    if (req.url == "/rooms" && req.method == "GET") {
        // 撈 Model Room 裡的東西
        // 非同步回傳後才執行下面 res 語法
        const rooms = await Room.find();
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            rooms
        }));
        res.end();
    } else if (req.url == "/rooms" && req.method == "POST") {
        req.on("end", async () => {
            try {
                const data = JSON.parse(body)
                // console.log(data);
                // rooms.js 有寫 Schema 規格，所以可以寫下面這樣
                const newRoom = await Room.create(
                    {
                        name: data.name,
                        price: data.price,
                        rating: data.rating,
                    }
                )
                res.writeHead(200, headers);
                res.write(JSON.stringify({
                    "status": "success",
                    rooms: newRoom
                }));
                res.end();
            } catch (error) {
                res.writeHead(400, headers);
                res.write(JSON.stringify({
                    "status": "false",
                    "message": "欄位沒有正確，或沒有此 ID",
                    "error": error
                }));
                res.end();
            };
        });
    } else if (req.url == "/rooms" && req.method == "DELETE") {
        const rooms = await Room.deleteMany({});
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "sucess",
            // rooms
            rooms: []
        }));
        res.end();
    } else if (req.url == "/rooms" && req.method == "OPTIONS") {
        res.writeHead(200, headers);
        res.end();
    } else {
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            "status": 'false',
            "message": 'not found pages'
        }));
        res.end();
    };
};

const server = http.createServer(requestListener);
// server.listen(3005);
server.listen(process.env.PORT);
