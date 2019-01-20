<template>
  <q-page class="flex column justify-end" style="padding:0 5vw;">
    <q-chat-message
      name="我"
      :text="['hey, if you type in your pw', 'it will show as stars']"
      stamp="7 minutes ago"
    />
    <q-chat-message
      sent
      name="小露露"
      :text="['hey, if you type in your pw', 'it will show as stars']"
      stamp="2 minutes ago"
    />
    <q-chat-message
      name="我"
      :text="['hey, if you type in your pw', 'it will show as stars']"
      stamp="7 minutes ago"
    />
    <div class="row fixed" style="width:90vw;bottom:60px;">
      <q-input class="col-10" dark inverted color="light"></q-input>
      <q-btn class="col-2" icon="send" color="primary"/>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex'
}
</script>
