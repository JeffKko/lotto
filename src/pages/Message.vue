<template>
  <q-page class="flex column justify-end" style="padding:0 5vw;">

    <q-chat-message
      v-for="(msg, index) in history"
      :key="index"
      :bg-color="msg.role ? 'grey-4' : 'amber-5'"
      :sent="msg.role ? false : true"
      :name="msg.role ? '小露露' : '露天小粉絲'"
      :avatar="msg.role ? 'statics/ruru.png' : ''"
      :text="[msg.content]"
      :stamp="msg.stamp | formatDate"
    />

    <q-chat-message
      v-if="isLoading"
      bg-color="grey-4"
      avatar="statics/ruru.png"
      name="小露露"
    >
      <q-spinner-dots size="2rem" />
    </q-chat-message>

    <div class="row fixed" style="width:90vw;bottom:60px;">
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

const botAnswer = {
  win: [
    '哇哇哇！中獎了！',
    '唉唷～運氣不錯，中了拉！',
    '中獎！ 潮爽Der～',
    'Bingoooooooooo！',
    'Bingo~~~~~~ la~~~~~ XD',
    '中了耶，太爽了ㄅ～',
    '中獎了！該請我吃飯了吧？',
    '中獎了！還不請我喝飲料？',
    '中獎了！我早就看好你了拉～',
    '竟然中了！號碼誰幫你選的啊？',
    '中了！請大聲念出你的號碼！',
    '中了！很會選餒吼',
    '中了中了～ 不枉費公司辛苦栽培你',
    'wait wait... what? 不對欸... 中獎了！',
    '中了！比開心更開心的故事！',
    '天哪！太幸運了吧！恭喜得獎啦',
    'oh my god！這麼幸運的事竟然發生在你身上了！趕快去領獎',
    '敢相信！你成為幸運得主了！',
    '有拜有保佑！你竟然如此幸運！太厲害啦！'
  ],
  lose: [
    '哭哭沒中獎～',
    '再接再厲 加油～',
    '哇哩咧...沒中獎 再輸入看看',
    'Oh no... 再加油好嗎💪'
  ],
  unready: [
    '都還沒開獎，對甚麼對！？'
  ],
  not4Number: [
    '叫你輸入四個數字齁'
  ],
  else: [
    '你以為我是機器人嗎？你錯了！',
    '我不是機器人，我是小露露',
    '尾牙還要加班，幫你們兌獎... 55555',
    '你們爽爽吃 爽爽玩 我在公司加班拉...',
    '誰可以帶volka回公司跟我喝一杯？'
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
  props: ['q'],
  data () {
    return {
      history: [],
      input: '',
      isLoading: false
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
    const history = this.$q.localStorage.get.item('MESSAGE_HISTORY')
    if(history) {
      this.history = history
    }
    this.ruruResponce('ㄤㄤ打給後，挖喜小露露，輸入四位數獎號窩可以告訴尼有沒有中獎喔！！ ^_^', true)
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
    // this.$q.localStorage.remove('MESSAGE_HISTORY')
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
      this.chechRequest(this.input)
      this.input = ''
    },
    chechRequest (text) {

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

            this.ruruResponce(responseList[this.randomBetween(0, responseList.length -1)])
          })
          .catch(error => {
            console.log(error)
            // this.$q.notify({
            //   color: 'negative',
            //   position: 'top',
            //   message: 'Loading failed',
            //   icon: 'report_problem'
            // })
            this.ruruResponce('系統領便當去囉...')
          })
      // 輸入非4位數獎號
      } else if(new RegExp(/^(\d)/g).test(text)) {
        const responseList = botAnswer.not4Number
        this.ruruResponce(responseList[this.randomBetween(0, responseList.length -1)])
      // 輸入其他內容
      } else {
        const responseList = botAnswer.else
        this.ruruResponce(responseList[this.randomBetween(0, responseList.length -1)])
      }

    },
    ruruResponce (text, ignoreSave = false) {
      this.isLoading = true
      this.scrollToBottom()
      setTimeout(() => {
        this.history.push({role: 1, content: text, stamp: new Date().getTime(), ignoreSave})
        this.scrollToBottom()
        this.isLoading = false
      }, this.randomBetween(300, 1000))
    },
    saveHistory () {
      this.$q.localStorage.set('MESSAGE_HISTORY', [...this.history.filter(item => !item.ignoreSave)])
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
