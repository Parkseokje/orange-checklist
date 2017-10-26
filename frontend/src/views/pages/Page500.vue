<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="clearfix">
            <h1 class="float-left display-3 mr-4">500</h1>
            <h4 class="pt-3">죄송합니다</h4>
            <p class="text-muted">
              찾으시는 페이지는 일시적으로 접근이 불가한 상태입니다.
              <button class="btn btn-info" type="button" @click="goBack">돌아가기</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page404',
  methods: {
    goBack () {
      this.$router.push('/')
    }
  }
}
</script>