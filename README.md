# list-pull

一个用于 H5 的 vue 列表组件，可以下拉刷新和上拉加载。
最简单参数是`apiList`。

## 安装

```shell
# yarn add list-pull
npm i list-pull

```

## 简单使用

```vue
<template>
  <list-pull :apiList="apiListFormat" class="list-pull">
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

### 页面特定高度元素内刷新

页面中如果特定元素限定高度内刷新的话，css 设定高度。
数据为空的时候，需要设定位置

```less
.list-pull {
  height: 300px;
}
/deep/ .empty {
  position: absolute;
  top: 10%;
}
```

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

## 组件逻辑

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
      <div class="end-tip" v-if="isEnd">{{ textEnd }}</div>
    </template>
    <div class="empty" v-if="isShowEmptyStatus">
      <img class="img" :src="imgEmpty" alt="" />
      <div class="text">{{ textEmpty }}</div>
    </div>
  </van-pull-refresh>
</template>
<script>
import { PullRefresh as vanPullRefresh, List as vanList, Toast } from 'vant';
import 'vant/lib/pull-refresh/style';
import 'vant/lib/list/style';
const configInit = {
  isEnd: false,
  isInitLoading: false,
  pageNo: 1,
  isBottomPushLoading: false,
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
        'https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/empty2.png',
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
      // 这个不放在configInit 因为下拉的时候 isTopPullLoading是true,此时请求结果还没回来，不能设置为false
      isTopPullLoading: false,
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
      this.updateData();
    },
    async updateData() {
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
        this.isInitLoading ||
        this.isTopPullLoading;
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
.end-tip {
  margin-top: 20px;
  padding-bottom: 20px;
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  color: #bbbbbb;
  line-height: 17px;
}
.van-pull-refresh {
  /* 有一定的高度 可以滚动 */
  height: auto;
  overflow: auto;
  /* min-height: 100vh; */
  position: relative;
}
.empty {
  /* position: absolute; */
  left: 0;
  right: 0;
  top: 40%;
  text-align: center;
  z-index: 3;
  /* transform: translate(0, -40%); */
  margin-top: 30px;
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
