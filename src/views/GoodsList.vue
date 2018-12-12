<template>
    <div>
      <nav-header></nav-header>
      <nav-bread>
          <span>商品列表</span>
      </nav-bread>

      <div class="accessory-result-page accessory-page">
          <div class="container">
            <!-- 排序，默认排序和按价格排序 -->
            <div class="filter-nav">
              <span class="sortby">排序:</span>
              <a href="javascript:void(0)" class="default cur">默认</a>
              <!-- 加载动画，use元素在SVG文档内取得目标节点，并在别的地方复制它们。 -->
              <a href="javascript:void(0)" class="price" v-bind:class="{'sort-up':sortFlag}" @click="sortGoods()">价格 <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
            </div>
            <div class="accessory-result">
              <!-- 价格过滤 -->
              <div class="filter stopPop" id="filter">
                <dl class="filter-price">
                  <dt>价格:</dt>
                  <dd><a href="javascript:void(0)" @click="setPriceFilter('all')" v-bind:class="{'cur':priceChecked=='all'}">All</a></dd>
                  <dd v-for="(item,index) in priceFilter" v-bind:key="item.id">
                    <!-- 给选中的价格区间添加cur类 -->
                    <a href="javascript:void(0)" @click="setPriceFilter(index)" v-bind:class="{'cur':priceChecked==index}">{{item.startPrice}} - {{item.endPrice}}</a>
                  </dd>
                </dl>
              </div>

              <!-- 搜索的商品列表 -->
              <div class="accessory-list-wrap">
                <div class="accessory-list col-4">
                  <ul>
                    <!-- 单个商品信息 -->
                    <li v-for="item in goodsList" v-bind:key="item.productId">
                    <div class="pic">
                        <a href="#"><img v-lazy="'static/'+item.productImage" v-bind:alt="item.productName"></a>
                      </div>
                      <div class="main">
                        <div class="name">{{item.productName}}</div>
                        <div class="price">{{item.salePrice | currency('￥')}}</div>
                        <div class="btn-area">
                          <a href="javascript:;" class="btn btn--m" @click="onAddCart(item.productId)">加入购物车</a>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <!-- 模态窗口, 提示登录模态窗口 -->
                <modal v-bind:mdShow="mdShow" v-on:close="closeModal">
                  <p slot="message">请先登录,否则无法加入到购物车中!</p>
                  <div slot="btnGroup">
                    <a href="JavaScript:void(0);" class="btn btn--m" @click="closeModal">关闭</a>
                  </div>
                </modal>
                <!-- 模态窗口，加入购物车成功提示和继续购物、查看购物车按钮 -->
                <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
                 <p slot="message">
                    <svg class="icon-status-ok">
                      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
                    </svg>
                    <span>加入购物车成功!</span>
                  </p>
                  <div slot="btnGroup">
                    <a href="JavaScript:void(0);" @click="mdShowCart=false" class="btn btn--m">继续购物</a>
                    <router-link to="/cart" class="btn btn--m btn--red">查看购物车</router-link>
                  </div>
                </modal>
                <!-- 一个加载图标 -->

                <div class="view-more-normal"
                    v-infinite-scroll="loadMore"
                    infinite-scroll-disabled="busy"
                    infinite-scroll-distance="20">
                    <!-- 使用v-infinite-scroll启用滚动加载，是否禁止下拉加载和滚动加载的距离属性 -->
                    <!-- 是否显示加载图片 -->
                  <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">
                </div>
              </div>
            </div>
          </div>
        </div>
        <nav-footer></nav-footer>
    </div>
</template>

<script>
import NavHeader from 'components/NavHeader'
import NavFooter from 'components/NavFooter'
import NavBread from 'components/NavBread'
import Modal from 'components/Modal'
import { goodsList, addCart } from 'api/apiInterface'
import {mapMutations} from 'vuex'

export default {
  data () {
    return {
      goodsList: [],
      sortFlag: true,
      page: 1,
      pageSize: 4,
      busy: true,
      loading: false,
      mdShow: false,
      mdShowCart: false,
      priceFilter: [
        {
          startPrice: '0.00',
          endPrice: '100.00'
        },
        {
          startPrice: '100.00',
          endPrice: '500.00'
        },
        {
          startPrice: '500.00',
          endPrice: '1000.00'
        },
        {
          startPrice: '1000.00',
          endPrice: '5000.00'
        }
      ],
      priceChecked: 'all',
      filterBy: false,
      overLayFlag: false
    }
  },
  mounted () {
    this.getGoodsList()
  },
  methods: {
    ...mapMutations({
      UPDATE_CART_COUNT: 'UPDATE_CART_COUNT'
    }),
    getGoodsList (flag) {
      var param = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceLevel: this.priceChecked
      }
      this.loading = true
      // 请求商品列表
      goodsList(param).then(response => {
        var res = response.data
        // loading加载
        setTimeout(() => {
          this.loading = false
        }, 3000)
        // 请求数据是否成功
        if (res.status === '200') {
          // 是否请求新数据
          if (flag) {
            this.goodsList = this.goodsList.concat(res.result.list)
            // 小于4的话禁止滚动加载，否则继续滚动加载
            if (res.result.count < 4) {
              this.busy = true
            } else {
              this.busy = false
            }
          } else {
            this.goodsList = res.result.list
            this.busy = false
          }
        } else {
          this.goodsList = []
        }
      })
    },
    sortGoods () {
      this.sortFlag = !this.sortFlag
      this.page = 1
      this.getGoodsList()
    },
    // 在原来的基础上继续加载数据
    loadMore () {
      this.busy = true
      setTimeout(() => {
        this.page++
        this.getGoodsList(true)
      }, 500)
    },
    // 过滤价格后，就要重新向数据库请求数据
    setPriceFilter (index) {
      this.priceChecked = index
      this.page = 1
      this.getGoodsList()
    },
    onAddCart (productId) {
      addCart({ productId: productId }).then(response => {
        var res = response.data
        if (res.status === '200') {
          this.mdShowCart = true
          this.UPDATE_CART_COUNT(1)
        } else {
          this.mdShow = true
        }
      })
    },
    closeModal () {
      this.mdShow = false
      this.mdShowCart = false
    }
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Modal
  }
}
</script>
