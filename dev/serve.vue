<script>
import Vue from "vue";
import ListPull from "@/list-pull.vue";
import { resMock } from "./mock";
const sleep = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
export default Vue.extend({
  name: "ServeDev",
  components: {
    ListPull,
  },
  methods: {
    async apiListFormat(params) {
      await sleep();
      console.log(params);
      let res = resMock;
      if (params.pageNo >= 3) {
        res = { data: { ...res.data, data: { data: [] } } };
      }
      console.log("res", res.data);
      const isSuccess = res.data.status === 1;
      const data = res.data.data.data;
      if (!isSuccess) {
        this.$toast(res.data.message);
      }
      return { isSuccess, data };
    },
  },
});
</script>

<template>
  <div id="app">
    <list-pull class="pull-box" :apiList="apiListFormat" offset="500">
      <template #item="item">
        <div class="item">{{ item.className }}</div>
      </template>
    </list-pull>
  </div>
</template>
<style scoped>
.pull-box {
  height: 300px;
}
.item {
  height: 100px;
  background-color: #f96;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}
</style>
