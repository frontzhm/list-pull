# list-pull

一个用于 H5 的列表组件，可以下拉刷新和上拉加载。

## 安装

```shell
yarn add @xdf/list-pull
```

## 使用

```vue
<template>
  <list-pull :apiList="apiListFormat" class="list">
    <template #item="item">
      <!-- item可以是组件 或 节点，能拿到item数据 -->
      <div class="item" :key="item.id">{{ item.name }}</div>
    </template>
  </list-pull>
</template>

<script>
import ListPull from 'list-pull';

export default {
  // ...
  methods: {
    async apiListFormat(params) {
      const res = await apiXX(params);
      const { status, data } = res.data;
      const isSuccess = status === 1;
      return { isSuccess, data };
    },
  },
};
</script>
```

> item 里面记得加`key`属性

## 属性

### apiList - 必传

返回`Promise`的函数，参数主要是`pageNo`，返回值必须固定是`{isSuccess:Boolean,data:[]}`，data 就是列表数据，数组形式

### pageSize

分页数。默认 20

### isDisabledRefresh

是否禁止刷新。默认是`false`

### isDisabledPush

是否禁止下拉加载。默认是`false`

### 其他参数

- `textEnd`，数据请求完的文本，默认是`到底了~`
- `textRefreshSuccess`，刷新成功的文本，默认是`刷新成功`
- `textEmpty`，空状态的文本，默认是`暂无数据~`
- `imgEmpty`，空状态的图像，默认是![x_empty](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/x_empty.png)

## 实例展示效果

![list_pull](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/list_pull.gif)

## 实例展示代码

父组件

```vue
<script>
import ListPull from '@xdf/list-pull';
import { resMock } from './mock';
const sleep = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
export default {
  name: 'ServeDev',
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
      console.log('res', res.data);
      const isSuccess = res.data.status === 1;
      const data = res.data.data.data;
      if (!isSuccess) {
        this.$toast(res.data.message);
      }
      return { isSuccess, data };
    },
  },
};
</script>

<template>
  <div id="app">
    <list-pull :apiList="apiListFormat" class="list" tabValue="1">
      <template #item="item">
        <div class="item">{{ item.className }}</div>
      </template>
    </list-pull>
  </div>
</template>
<style scoped>
.item {
  height: 100px;
  background-color: #f96;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}
</style>
```

考虑到方便 ，加了 mock 数据，`mock.js`

```js
export const dataHas = [
  {
    schoolId: 20000,
    studentCode: 'LXDF0122135589',
    classCode: '20234005',
    className: '小学英语寒假本地自研班',
    status: 3,
    startDate: '2023-01-21 08:00:00',
    endDate: '2023-02-25 09:50:00',
    teacherName: '乐学东方005',
    subjectCode: '3',
    subjectName: '英语',
    applyId: null,
  },
  {
    schoolId: 20000,
    studentCode: 'LXDF0122135589',
    classCode: '20234009',
    className: '小学英语寒假本地自研班',
    status: 3,
    startDate: '2023-01-27 05:00:00',
    endDate: '2023-03-03 06:50:00',
    teacherName: '李冰冰',
    subjectCode: '3',
    subjectName: '英语',
    applyId: 12,
  },
  {
    schoolId: 20000,
    studentCode: 'LXDF0122135589',
    classCode: '20234002',
    className: '小初衔接数学寒假好学班',
    status: 3,
    startDate: '2023-01-27 08:00:00',
    endDate: '2023-02-06 09:50:00',
    teacherName: '乐学东方一号',
    subjectCode: '2',
    subjectName: '数学',
    applyId: null,
  },
  {
    schoolId: 20000,
    studentCode: 'LXDF0122135589',
    classCode: '20231001',
    className: '小学英语寒假本地自研班',
    status: 3,
    startDate: '2023-01-27 08:00:00',
    endDate: '2023-02-06 09:50:00',
    teacherName: '乐学东方7777',
    subjectCode: '3',
    subjectName: '英语',
    applyId: null,
  },
  {
    schoolId: 20000,
    studentCode: 'LXDF0122135589',
    classCode: '20234008',
    className: '小学英语寒假本地自研班',
    status: 3,
    startDate: '2023-01-31 08:00:00',
    endDate: '2023-03-07 09:50:00',
    teacherName: '乐学东方一号',
    subjectCode: '3',
    subjectName: '英语',
    applyId: null,
  },
  {
    schoolId: 20000,
    studentCode: 'LXDF0122135589',
    classCode: 'TTT001',
    className: '小初衔接数学寒假好学班',
    status: 3,
    startDate: '2023-02-01 08:00:00',
    endDate: '2023-02-06 09:50:00',
    teacherName: '',
    subjectCode: '2',
    subjectName: '数学',
    applyId: null,
  },
  {
    schoolId: 20000,
    studentCode: 'LXDF0122135589',
    classCode: '20234011',
    className: '小初衔接数学寒假好学班',
    status: 3,
    startDate: '2023-02-01 08:00:00',
    endDate: '2023-02-06 09:50:00',
    teacherName: '',
    subjectCode: '2',
    subjectName: '数学',
    applyId: null,
  },
  {
    schoolId: 20000,
    studentCode: 'LXDF0122135589',
    classCode: '20234007',
    className: '小学英语寒假本地自研班',
    status: 3,
    startDate: '2023-02-07 08:00:00',
    endDate: '2023-03-14 09:50:00',
    teacherName: '乐学东方002',
    subjectCode: '3',
    subjectName: '英语',
    applyId: null,
  },
  {
    schoolId: 20000,
    studentCode: 'LXDF0122135589',
    classCode: '20234012',
    className: '小学英语寒假本地自研班',
    status: 3,
    startDate: '2023-02-18 08:00:00',
    endDate: '2023-03-25 09:50:00',
    teacherName: '乐学东方10000',
    subjectCode: '3',
    subjectName: '英语',
    applyId: null,
  },
  {
    schoolId: 20000,
    studentCode: 'LXDF0122135589',
    classCode: '20234003',
    className: '小初衔接数学寒假好学班',
    status: 3,
    startDate: '2023-02-22 08:00:00',
    endDate: '2023-03-29 09:50:00',
    teacherName: '乐学东方7758',
    subjectCode: '2',
    subjectName: '数学',
    applyId: null,
  },
];
export const dataEmpty = [];
export const data = {
  status: 1,
  message: '操作成功',
  data: { data: dataHas },
  code: '200',
};
export const resMock = { data };
```

## 组件代码和组件逻辑注释

```vue
<template>
  <van-pull-refresh
    v-model="isTopPullLoading"
    :success-text="textRefreshSuccess"
    @refresh="onTopPullRefresh"
    :disabled="isDisabledRefresh"
  >
    <template v-if="list.length">
      <van-list
        class="list"
        immediate-check
        v-model="isBottomPushLoading"
        :finished="isEnd"
        finished-text=""
        @load="onBottomPushLoad"
      >
        <template v-for="item in list">
          <slot name="item" v-bind="item"></slot>
        </template>
      </van-list>
      <div class="tip" v-if="isEnd">{{ textEnd }}</div>
    </template>
    <div class="empty" v-if="isShowEmptyStatus">
      <img class="img" :src="imgEmpty" alt="" />
      <div class="text">{{ textEmpty }}</div>
    </div>
  </van-pull-refresh>
</template>
<script>
import { PullRefresh as vanPullRefresh, List as vanList, Toast } from 'vant';
const configInit = {
  isEnd: false,
  isLoading: false,
  pageNo: 1,
  isBottomPushLoading: false,
  isTopPullLoading: false,
};

export default {
  name: 'list-pull',
  props: {
    apiList: Function,
    pageSize: {
      default: 10,
    },
    isDisabledRefreshSet: {
      default: false,
    },
    isDisabledPushSet: {
      default: false,
    },
    textEmpty: {
      default: '暂无数据~',
    },
    imgEmpty: {
      default:
        'https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/xd_empty.png',
    },
    textEnd: {
      default: '已经到底了~',
    },
    textRefreshSuccess: {
      default: '刷新成功',
    },
  },
  components: {
    vanPullRefresh,
    vanList,
  },
  data() {
    return {
      isAlreadyRequested: false,
      list: [],
      ...configInit,
    };
  },

  mounted() {
    this.requestInit();
  },
  computed: {
    /**
     * 显示空状态同时满足两个条件
     *  1. 请求过了
     *  2. 空数据
     */
    isShowEmptyStatus() {
      return this.isAlreadyRequested && this.list.length === 0;
    },
    /**
     * 不能下拉刷新，任意满足一个条件
     *  - 设置了isDisabledRefreshSet
     *  - 显示空状态了
     */
    isDisabledRefresh() {
      return this.isDisabledRefreshSet || this.isShowEmptyStatus;
    },
  },

  methods: {
    /** 初始请求，需要显示加载图标，且请求完成之后，设置请求过的flag，以控制空状态的显示和是否能刷新 */
    async requestInit() {
      const toast = Toast.loading({
        message: '加载中...',
        forbidClick: true,
      });
      this.list = await this._apiListRequest();
      toast.clear();
      this.isAlreadyRequested = true;
    },

    /**
     * 顶部下拉刷新
     * 如果禁止下拉的话，isTopPullLoading始终为false，不会触发此函数
     * 下拉的时候，isTopPullLoading自动触发为true，触发onTopPullRefresh
     * 下拉主要是刷新，重置页面部分配置，然后请求，请求回来之后，手动设置isTopPullLoading，结束下拉加载状态
     * */
    async onTopPullRefresh() {
      this._resetConfig();
      this.list = await this._apiListRequest();
      this.isTopPullLoading = false;
    },
    /**
     * 底部上拉加载
     * 上拉的时候，isBottomPushLoading自动触发为true，触发onBottomPushLoad
     * 不加载但可能触发上拉的情形：父组件不需要上拉加载、数据完结了、正在加载、正在刷新
     * 触发下拉加载
     *  1. 如果不能加载，直接isBottomPushLoading为false，结束上拉加载状态
     *  2. 如果能加载，页数加一再请求，请求成功之后，数据追加，设置isBottomPushLoading为false，结束上拉加载状态
     */
    async onBottomPushLoad() {
      const isDisabledPush =
        this.isDisabledPush ||
        this.isEnd ||
        this.isLoading ||
        this.isRefreshing;
      if (isDisabledPush) {
        this.isBottomPushLoading = false;
        return;
      }
      this.pageNo += 1;
      const newList = await this._apiListRequest();
      this.list = [...this.list, ...newList];
      this.isBottomPushLoading = false;
    },

    /**
     * 三种情况发生请求：初始请求、下拉刷新请求、上拉加载请求
     * 但三种请求前后的逻辑并不相同，这边抽离共同逻辑，只返回list数据，其他逻辑各自处理
     * 请求的参数，主要是pageNo，如果不成功，返回[]，成功的话，list的数据少于pageSize，表示到底，返回data
     */
    async _apiListRequest() {
      const res = await this.apiList({
        pageNo: this.pageNo,
      });
      const { data, isSuccess } = res;
      if (!isSuccess) {
        return [];
      }
      this.isEnd = data.length < this.pageSize;
      return data;
    },
    /** 下拉刷新的时候，页面部分配置初始化 */
    async _resetConfig() {
      Object.keys(configInit).forEach((key) => {
        this[key] = configInit[key];
      });
    },
  },
};
</script>
<style scoped>
.tip {
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  color: #bbbbbb;
  line-height: 17px;
}
.van-pull-refresh {
  min-height: 80vh;
}
.empty {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 3;
  margin-top: -20px;
  justify-content: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.img {
  display: block;
  width: 110px;
}
.text {
  font-size: 14px;
  font-weight: 300;
  color: #999999;
  line-height: 20px;
  margin-top: 10px;
}
</style>
```
