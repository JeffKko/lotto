<template>
  <q-page class="flex column justify-end" style="padding:0 5vw;">

    <q-chat-message
      v-for="(msg, index) in history"
      :key="index"
      :bg-color="msg.role ? 'grey-4' : 'amber-5'"
      :sent="msg.role ? false : true"
      :name="msg.role ? bot[msg.bot].name : '露天小粉絲'"
      :avatar="msg.role ? bot[msg.bot].avatar : ''"
      :text="[msg.content]"
      :stamp="msg.stamp | formatDate"
    />

    <q-chat-message
      v-if="isLoading"
      bg-color="grey-4"
      :avatar="bot[currentAnswerBot].avatar"
      :name="bot[currentAnswerBot].name"
    >
      <q-spinner-dots size="2rem" />
    </q-chat-message>

    <div class="row fixed" style="width:90vw;bottom:80px;">
      <q-input class="col-10" dark inverted color="light" v-model="input"></q-input>
      <q-btn class="col-2" icon="send" color="primary" @click="sendMessage"/>
    </div>

  </q-page>
</template>

<style>
</style>

<script>

import axios from 'axios'
import { date } from 'quasar'

const storageKeyName = 'MESSAGE_HISTORY_V2'

const botAnswer = {
  win: [
    '哇哇哇！中獎了！🎉',
    '唉唷～運氣不錯，中了拉！🎊',
    '中獎！ 潮爽Der～🎊',
    'Bingoooooooooo！🎈',
    'Bingo~~~~~~ la~~~~~ XD💥',
    '中了耶，太爽了ㄅ～🌟',
    '中獎了！該請我吃飯了吧？💝',
    '中獎了！還不請我喝飲料？🎉',
    '中獎了！我早就看好你了拉～🎊',
    '竟然中了！號碼誰幫你選的啊？🎈',
    '中了！請大聲念出你的號碼！💥',
    '中了！很會選餒吼🌟',
    '中了中了～ 不枉費公司辛苦栽培你💝',
    'wait wait... what? 不對欸... 中獎了！🎉',
    '中了！比開心更開心的故事！🎊',
    '天哪！太幸運了吧！恭喜得獎啦🎈',
    'oh my god！這麼幸運的事竟然發生在你身上了！趕快去領獎💥',
    '不敢相信！你成為幸運得主了！🌟',
    '有拜有保佑！你竟然如此幸運！太厲害啦！🎉'
  ],
  lose: [
    '哭哭沒中獎～🐷',
    '再接再厲 加油～🧡',
    '哇哩咧...沒中獎 再輸入看看🧡',
    'Oh no... 再加油好嗎💪',
    '加油加油 下一張會更好！💪',
    '加油！下一張就是你的！',
    '沒中欸，我看你明年再買多一點囉',
    '沒中@@，比悲傷更悲傷',
    '沒中... 還是努力工作卡時在',
    '沒中... 我也哭惹',
    '沒中XD 來去喝一杯',
    '沒中欸，你會不會想打主持人？',
    '沒中哈哈， 你484想打我？',
    '沒中... 水行俠都救不了你QQ',
    '沒中... 100塊當乾爹囉～',
    '沒中... ok der 當日行一善啦',
    '沒中... 等老闆加碼好哩',
    '沒中... 錢財撒出去～獎號對不來～得獎的人發大財～',
    '沒中～～ 錢財撒出去～獎號對不來～得獎的人發大財～',
    '我想是這樣啦齁 這張應該是沒中獎',
    '拍謝... 這張沒中獎餒 🐷',
    '沒中 該加入福委改運一下了吧？',
    '沒中 ㄎㄎ',
    '沒中 5樓幫QQ',
    '又沒中 ...等等 你別激動！！',
    '又沒中 我哭惹',
    '沒中欸，這張可以撕掉惹... 開玩笑的',
    'ㄜ... 沒中R 下一張再努力'
  ],
  unready: [
    '都還沒開獎，對甚麼對！？',
    '等主持人抽獎好ㄇ',
    '還沒開獎，別急～',
    '賣鬧阿，還沒開獎餒',
    '齁，現在再怎麼輸入都沒用！',
    'stop~~~~',
    '莫急 莫慌 莫害怕'
  ],
  not4Number: [
    '叫你輸入四個數字齁',
    '大佬，輸入四個數字就好！',
    '別鬧哩',
    '哦... 不對欸',
    '輸入正確我才能幫你兌獎拉 XD！',
    '想兌獎嗎？ 輸入四位數字唄',
    '輸入四位數字484聽不懂？',
    '很好 你輸入了阿拉伯數字 但不是輸入四位數RRRR'
  ],
  else: [
    '你以為我是機器人嗎？你錯了！',
    '我不是機器人好ㄇ？',
    '尾牙還要加班，幫你們兌獎... 55555',
    '你們爽爽吃 爽爽玩 我在公司加班拉...',
    '誰可以帶volka回公司跟我喝一杯？',
    '彩票買下去～ 開獎開出來～ 露天發大財～',
    '想聊？',
    'hihi～ 我們來聊天阿～',
    'ZZ',
    '你好',
    'Hello',
    '真的假的',
    '好',
    '好啦',
    '你說的我都信',
    '我支持你',
    '可以',
    '沒問題',
    '痾',
    '喔',
    '恩',
    'ㄜ',
    'ㄜㄜ',
    '是喔',
    '喔喔',
    '恩恩',
    'fine.',
    'well...',
    'ok',
    'okok',
    '。',
    '...',
    'ㄜ...'
  ]
}



export default {
  name: 'PageIndex',
  beforeRouteEnter (to, from, next) {
    next(vm => vm.scrollToBottom())
  },
  filters : {
    formatDate (timeStamp) {
      return date.formatDate(timeStamp, 'A h:mm')
    }
  },
  data () {
    return {
      history: [],
      input: '',
      isLoading: false,
      currentAnswerBot: 'ruru',
      bot: {
        ruru: {
          name: '小露露',
          avatar: 'statics/ruru.png'
        },
        eagle: {
          name: '一哥',
          avatar: 'statics/eagle.png'
        },
        moneyGod: {
          name: '財神露',
          avatar: 'statics/money_god.png'
        },
        pig: {
          name: '小豬',
          avatar: 'statics/pig.png'
        },
        kangaroo: {
          name: '袋鼠',
          avatar: 'statics/kangaroo.jpg'
        }
      }
    }
  },
  computed: {
    botList() {
      return Object.keys(this.bot)
    }
  },
  watch: {
    history: {
      handler () {
        this.saveHistory()
      },
      deep: true
    }
  },
  created () {
    const history = this.$q.localStorage.get.item(storageKeyName)
    if(history) this.history = history
    this.responceByBot('ㄤㄤ打給後，挖喜小露露，輸入四位數獎號窩可以告訴尼有沒有中獎喔！！ ^_^', 'ruru', true)
  },
  mounted () {
    if(this.$route.query.n) {
      let n = this.$route.query.n
      setTimeout(() => {
        this.input = n
        this.sendMessage()
      }, 1001)
      this.$router.replace({ path: 'message'})
    }
    this.scrollToBottom()
    // this.$q.localStorage.remove(storageKeyName)
  },
  methods: {
    sendMessage () {
      if(this.input.trim() === '') return

      const payload = {
        role: 0,
        content: this.input,
        stamp: new Date().getTime()
      }
      this.history.push(payload)
      this.scrollToBottom()
      this.checkRequest(this.input)
      this.input = ''
    },
    checkRequest (text) {

      // 輸入4位數獎號
      if(new RegExp(/^\d{4}$/).test(text)) {

        axios.get(`numbers.json?${new Date().getTime()}`)
          .then((response) => {
            const normalNumers = response.data.normal
            let responseList

            if(normalNumers.length) {

              let isBingo = normalNumers.some(number => {
                number = String(number)
                return text.indexOf(number.substr(0, 3)) === 0 || text.indexOf(number.substr(1, 3)) === 1 || number === text
              })

              responseList = isBingo ? botAnswer.win : botAnswer.lose

              // vm.normal = response.data.normal
              // vm.special = response.data.special
            } else {
              responseList = botAnswer.unready
            }

            this.responceByBot(responseList[this.randomBetween(0, responseList.length -1)])
          })
          .catch(error => {
            console.log(error)
            // this.$q.notify({
            //   color: 'negative',
            //   position: 'top',
            //   message: 'Loading failed',
            //   icon: 'report_problem'
            // })
            this.responceByBot('系統領便當去囉...')
          })
      // 輸入非4位數獎號
      } else if(new RegExp(/^(\d)/g).test(text)) {
        const responseList = botAnswer.not4Number
        this.responceByBot(responseList[this.randomBetween(0, responseList.length -1)])
      // 輸入其他內容
      } else {
        const responseList = botAnswer.else
        this.responceByBot(responseList[this.randomBetween(0, responseList.length -1)])
      }

    },
    responceByBot (text, bot = this.botList[this.randomBetween(0, this.botList.length -1)], ignoreSave = false) {
      this.currentAnswerBot = bot
      this.isLoading = true
      this.scrollToBottom()
      setTimeout(() => {
        this.history.push({role: 1, content: text, stamp: new Date().getTime(), bot: this.currentAnswerBot, ignoreSave})
        this.scrollToBottom()
        this.currentAnswerBot = null
        this.isLoading = false
      }, this.randomBetween(300, 1000))
    },
    saveHistory () {
      this.$q.localStorage.set(storageKeyName, [...this.history.filter(item => !item.ignoreSave)])
    },
    randomBetween (min, max) {
      return Math.floor( Math.random() * (max-min+1) + min )
    },
    scrollToBottom () {
      this.$nextTick(() => window.scrollTo(0, 99999999999999999999))
    }
  }

}
</script>
