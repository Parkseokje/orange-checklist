<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-12">
        <b-card header="점포 목록">
          <b-button href="#" variant="primary">점포등록</b-button>
          <br><br>
          <table class="table table-bordered table-striped table-sm">
            <thead>
              <tr>
                <th>점포명</th>
                <th>주소</th>
                <th>전화번호</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items">
                <td>{{ item.shop_name }}</td>
                <td>{{ item.shop_tel }}</td>
                <td>{{ item.shop_addr }}</td>
              </tr>
            </tbody>
          </table>
          <!-- Pagination -->
          <nav>
            <ul class="pagination">
              <li class="page-item"><a class="page-link" href="#">Prev</a></li>
              <li class="page-item active">
                <a class="page-link" href="#">1</a>
              </li>
              <li class="page-item"><a class="page-link" href="#">2</a></li>
              <li class="page-item"><a class="page-link" href="#">3</a></li>
              <li class="page-item"><a class="page-link" href="#">4</a></li>
              <li class="page-item"><a class="page-link" href="#">Next</a></li>
            </ul>
          </nav>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
const items = [
  { shop_name: 'ABC', shop_addr: '서울시 서초구 양재동', shop_tel: '070-8845-0500' },
  { shop_name: 'ABC', shop_addr: '서울시 서초구 양재동', shop_tel: '070-8845-0500' }
]

export default {
  name: 'shop',
  data: function () {
    return {
      fields: [ '점포명', '전화번호', '주소' ],
      items: items
    }
  }
}
</script>