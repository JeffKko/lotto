<template>
  <q-page class="flex column justify-end" style="padding:0 5vw;">
    <q-chat-message
      v-for="(msg, index) in history"
      :key="index"
      size="8"
      :sent="msg.role ? true : false"
      :name="msg.role ? '小露露' : '露天小粉絲'"
      :avatar="msg.role ? 'statics/ruru.png' : ''"
      :text="[msg.content]"
      stamp="2 minutes ago"
    />
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

const data = [
  {
    role: 0,
    content: '問你一個學校的問題',
    stamp: ''
  },
  {
    role: 1,
    content: '問啥校?'
  },
  {
    role: 0,
    content: '最帥的人是不是劉以豪?'
  },
]


export default {
  name: 'PageIndex',
  beforeRouteEnter (to, from, next) {
    next(vm => vm.scrollToBottom())
  },
  data () {
    return {
      history: [],
      input: '',
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
    this.scrollToBottom()
  },
  methods: {
    sendMessage () {
      if(this.input.trim() === '') return

      const payload = {
        role: 0,
        content: this.input
      }
      this.history.push(payload)
      this.scrollToBottom()
      this.botResponce(this.input)
      this.input = ''
    },
    botResponce (text) {
      const isLottoNumber = new RegExp(/^\d{4}$/).test(text)
      if(isLottoNumber) {
        axios.get('numbers.json')
          .then((response) => {
            if(response.data.normal.length) {
              const normalNumers = response.data.normal
              let isBingo = normalNumers.filter(number => {
                number = String(number)
                return number.substr(0, 3) === text || number.substr(1, 3) === text || number === text
              })

              if(isBingo.length) {
                this.ruruResponce('中獎拉！！！')
              } else {
                this.ruruResponce('哭哭沒中獎～')
              }
              
              // vm.normal = response.data.normal
              // vm.special = response.data.special
            } else {
              this.ruruResponce('都還沒開獎，對甚麼對！')
            }
          })
          .catch(error => {
            console.log(error)
            // this.$q.notify({
            //   color: 'negative',
            //   position: 'top',
            //   message: 'Loading failed',
            //   icon: 'report_problem'
            // })
          })
      } else {
        this.ruruResponce('前端Jeff豪棒棒！')
      }
    },
    ruruResponce (text, ignoreSave = false) {
      this.history.push({role: 1, content: text, ignoreSave})
      this.scrollToBottom()
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
