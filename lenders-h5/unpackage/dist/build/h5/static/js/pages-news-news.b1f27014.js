(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-news-news"],{"1bd4":function(n,t,e){"use strict";var s;e.d(t,"b",(function(){return i})),e.d(t,"c",(function(){return o})),e.d(t,"a",(function(){return s}));var i=function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("v-uni-view",{staticClass:"news-info"},[e("v-uni-rich-text",{attrs:{nodes:n.newsInfo.news_content}})],1)},o=[]},3140:function(n,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s={data:function(){return{newsInfo:{},newsId:null}},onLoad:function(n){console.log(n),this.newsId=n.id,this.initNewsInfo()},methods:{initNewsInfo:function(){var n=this;if(!this.newsId)return!1;this.sessionService.fetchNewsInfo(this.newsId).then((function(t){console.log(t),n.newsInfo=t,uni.setNavigationBarTitle({title:t.news_title})}))}}};t.default=s},"6ec4":function(n,t,e){"use strict";e.r(t);var s=e("1bd4"),i=e("7b65");for(var o in i)"default"!==o&&function(n){e.d(t,n,(function(){return i[n]}))}(o);e("f198");var a,r=e("f0c5"),u=Object(r["a"])(i["default"],s["b"],s["c"],!1,null,"5ad47b5a",null,!1,s["a"],a);t["default"]=u.exports},"7b65":function(n,t,e){"use strict";e.r(t);var s=e("3140"),i=e.n(s);for(var o in s)"default"!==o&&function(n){e.d(t,n,(function(){return s[n]}))}(o);t["default"]=i.a},"7ff9":function(n,t,e){var s=e("d849");"string"===typeof s&&(s=[[n.i,s,""]]),s.locals&&(n.exports=s.locals);var i=e("4f06").default;i("7999e334",s,!0,{sourceMap:!1,shadowMode:!1})},d849:function(n,t,e){var s=e("24fb");t=s(!1),t.push([n.i,'@charset "UTF-8";\n/**\n * 这里是uni-app内置的常用样式变量\n *\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n *\n */\n/**\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n *\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\n */\n/* 颜色变量 */\n/* 行为相关颜色 */\n/* 文字基本颜色 */\n/* 背景颜色 */\n/* 边框颜色 */\n/* 尺寸变量 */\n/* 文字尺寸 */\n/* 图片尺寸 */\n/* Border Radius */\n/* 水平间距 */\n/* 垂直间距 */\n/* 透明度 */\n/* 文章场景相关 */uni-page-body[data-v-5ad47b5a]{max-width:100%;overflow:hidden;padding:%?20?%}',""]),n.exports=t},f198:function(n,t,e){"use strict";var s=e("7ff9"),i=e.n(s);i.a}}]);