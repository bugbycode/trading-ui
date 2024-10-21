<template>
  <router-view />
</template>
<script setup>
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const router = useRouter()
  const route = useRoute()

  router.push("/login")

  const search = computed({
    get() {
      return route.query.search ?? ''
    },
    set(search) {
      router.replace({ query: { search } })
    }
  })
</script>