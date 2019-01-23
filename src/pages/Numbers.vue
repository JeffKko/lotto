<template>
  <q-page class="flex flex-center">
    <q-card style="width: 80vw;">
      <q-card-title>
        開獎號碼
      </q-card-title>
      <q-card-separator />
      <q-list>
        <q-item :key="'item' + index" v-for="(item, index) in normal">
          <q-item-side>
            <q-item-tile color="amber-9" icon="stars" />
          </q-item-side>
          <q-item-main>
            {{item}}
          </q-item-main>
        </q-item>
      </q-list>
    </q-card>
    <q-card style="width: 80vw;">
      <q-card-title>
        特獎
      </q-card-title>
      <q-card-separator />
      <q-list>
        <q-item>
          <q-item-side>
            <q-item-tile color="amber-9" icon="stars" />
          </q-item-side>
          <q-item-main>
            {{special}}
          </q-item-main>
        </q-item>
      </q-list>
    </q-card>
  </q-page>
</template>

<style>
</style>

<script>

import axios from 'axios'

export default {
  data () {
    return {
      normal: null,
      special: null
    }
  },
  beforeRouteEnter (to, from, next) {
    axios.get(`numbers.json?${new Date().getTime()}`)
      .then((response) => {
        next(vm => {
          vm.normal = response.data.normal
          vm.special = response.data.special
        })
      })
      .catch(() => {
        next()
        // this.$q.notify({
        //   color: 'negative',
        //   position: 'top',
        //   message: 'Loading failed',
        //   icon: 'report_problem'
        // })
      })
  }
}
</script>
