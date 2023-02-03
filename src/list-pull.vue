<template>
  <van-pull-refresh
    v-bind="$attrs"
    v-on="$listeners"
    v-model="isTopPullLoading"
    :success-text="$attrs.successText || '刷新成功'"
    @refresh="onTopPullRefresh"

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
import { PullRefresh as vanPullRefresh, List as vanList, Toast } from "vant";
import "vant/lib/pull-refresh/style";
import "vant/lib/list/style";
const configInit = {
  isEnd: false,
  isInitLoading: false,
  pageNo: 1,
  isBottomPushLoading: false,
};

export default {
  name: "list-pull",
  props: {
    apiList: Function,
    pageSize: {
      default: 10,
    },
    // isDisabledRefreshSet: {
    //   default: false,
    // },
    isDisabledPushSet: {
      default: false,
    },
    textEmpty: {
      default: "暂无数据~",
    },
    imgEmpty: {
      default:
        "data:image/png;base64,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",
    },
    textEnd: {
      default: "已经到底了~",
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
    isDisabledRefreshSet(){
      return this.$attrs.disabled
    },
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
        message: "加载中...",
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
