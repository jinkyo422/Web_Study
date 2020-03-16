const express = require('express')
const path = require('path')
const logger = require('morgan')
const app = express()

const dbPort = 27017

const connect = require('./schemas/index.js')
connect(dbPort)

const Chat = require('./schemas/chat.js')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(logger('dev'))

app.set('views', path.join(__dirname, 'views'))
app.set('views engine', 'ejs')

app.get('/', (req, res, err) => {
    res.redirect('/main')
})

app.get('/main', (req, res, err) => {
    Chat.find((err, chats) => {
        if(chats.length == 0){
            res.render('index.ejs', {
                msg: '서버에 저장된 메시지가 없습니다.'
            })
        }
        else{
            res.render('index.ejs', {
                msg: chats
            })
        }
    })
})

app.post('/data', (req, res, err) => {
    //console.log(req.body.msg, req.body.userId)
    const userId = req.body.userId
    const msg = req.body.msg
    const chat = new Chat({ userId, msg })
    chat.save((err) => {
        if (err) res.json({
            msg: '서버에 오류가 발생했습니다. 관리자에게 문의하세요.'
        })
        else{
            Chat.find({}, null, { sort: { 'date' : -1 }, limit: 100 }, (err, chats) => {
                let msg = undefined
                if(chats.length == 0)   msg = '서버에 저장된 메시지가 없습니다.'
                else    msg = chats
                res.json({ msg })
            })
        }
    })
})

app.listen(8000, ()=>{
    console.log('8000번 포트에서 대기중')
})
