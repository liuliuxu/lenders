(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-contact-customer-service-contact-customer-service"],{"0674":function(t,e,n){"use strict";n.r(e);var i=n("ad63"),c=n("1b07");for(var a in c)"default"!==a&&function(t){n.d(e,t,(function(){return c[t]}))}(a);n("8898");var o,s=n("f0c5"),r=Object(s["a"])(c["default"],i["b"],i["c"],!1,null,"97959144",null,!1,i["a"],o);e["default"]=r.exports},"1b07":function(t,e,n){"use strict";n.r(e);var i=n("9295"),c=n.n(i);for(var a in i)"default"!==a&&function(t){n.d(e,t,(function(){return i[t]}))}(a);e["default"]=c.a},"4d31":function(t,e,n){var i=n("e302");"string"===typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);var c=n("4f06").default;c("358c2b35",i,!0,{sourceMap:!1,shadowMode:!1})},8898:function(t,e,n){"use strict";var i=n("4d31"),c=n.n(i);c.a},9295:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i={data:function(){return{token:"",customerService:{email:"deagfa@daffws.com",phone:"400-898-8888",time:"9:00-21:00"},phone:"",content:""}},onLoad:function(t){var e=t.token;uni.setNavigationBarTitle({title:"Contact service"}),e&&(uni.setStorageSync(this.APP_CONFIG.tokenKey,e),this.getCustomerServiceInfo())},methods:{getCustomerServiceInfo:function(){var t=this;this.sessionService.fetchCustomerServiceInfo().then((function(e){t.customerService=e}))},submit:function(){var t=this,e=this,n=null;if(e.phone?e.content||(n="Please enter the feedback！"):n="Please enter Mobile Number！",n)return this.http.showToast(n);var i={feedback_content:this.content,contact_information:this.phone};this.sessionService.submitFeedback(i).then((function(e){uni.showToast({title:"Submit feedback success",duration:800,mask:!0}),t.phone="",t.content=""}))}}};e.default=i},ad63:function(t,e,n){"use strict";var i;n.d(e,"b",(function(){return c})),n.d(e,"c",(function(){return a})),n.d(e,"a",(function(){return i}));var c=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-uni-view",{staticClass:"contact-customer-service-main"},[n("v-uni-view",{staticClass:"contact-customer-service-header"},[n("v-uni-view",{staticClass:"row"},[n("v-uni-view",{staticClass:"col-auto"},[t._v("Customer service email")]),n("v-uni-view",{staticClass:"col text-right"},[t._v(t._s(t.customerService.email))])],1),n("v-uni-view",{staticClass:"row"},[n("v-uni-view",{staticClass:"col-auto"},[t._v("Manual customer service")]),n("v-uni-view",{staticClass:"col text-right"},[t._v(t._s(t.customerService.phone))])],1),n("v-uni-view",{staticClass:"row m-b-5"},[n("v-uni-view",{staticClass:"col-auto"},[t._v("Service time")]),n("v-uni-view",{staticClass:"col text-right"},[t._v(t._s(t.customerService.time))])],1),n("v-uni-view",{staticClass:"title"},[t._v("The manual service may wait too long, please be patient")])],1),n("v-uni-view",{staticClass:"line"}),n("v-uni-view",{staticClass:"contact-customer-service-content"},[n("v-uni-view",{staticClass:"title-con"},[t._v("Online feedback")]),n("v-uni-view",{staticClass:"content"},[n("v-uni-view",{staticClass:"row title-con m-t-20"},[n("v-uni-view",{staticClass:"col-auto"},[t._v("Contact")]),n("v-uni-view",{staticClass:"col text-right"},[n("v-uni-input",{attrs:{type:"text",placeholder:"Please enter Mobile Number"},model:{value:t.phone,callback:function(e){t.phone=e},expression:"phone"}})],1)],1),n("v-uni-textarea",{attrs:{placeholder:"Please enter the feedback"},model:{value:t.content,callback:function(e){t.content=e},expression:"content"}})],1)],1),n("v-uni-view",{staticClass:"contact-customer-service-footer"},[n("v-uni-button",{attrs:{type:"primary"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.submit.apply(void 0,arguments)}}},[t._v("Submit feedback")])],1)],1)},a=[]},e302:function(t,e,n){var i=n("24fb");e=i(!1),e.push([t.i,'@charset "UTF-8";\n/**\n * 这里是uni-app内置的常用样式变量\n *\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n *\n */\n/**\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n *\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\n */\n/* 颜色变量 */\n/* 行为相关颜色 */\n/* 文字基本颜色 */\n/* 背景颜色 */\n/* 边框颜色 */\n/* 尺寸变量 */\n/* 文字尺寸 */\n/* 图片尺寸 */\n/* Border Radius */\n/* 水平间距 */\n/* 垂直间距 */\n/* 透明度 */\n/* 文章场景相关 */uni-page-body[data-v-97959144]{color:#6c6f71;font-size:%?28?%}uni-page-body .contact-customer-service-main .contact-customer-service-header[data-v-97959144]{padding:%?40?%}uni-page-body .contact-customer-service-main .contact-customer-service-header > uni-view.row[data-v-97959144]{margin-bottom:%?18?%}uni-page-body .contact-customer-service-main .contact-customer-service-header > uni-view.row.m-b-5[data-v-97959144]{margin-bottom:%?5?%}uni-page-body .contact-customer-service-main .contact-customer-service-header .title[data-v-97959144]{font-size:%?24?%}uni-page-body .contact-customer-service-main .line[data-v-97959144]{height:%?5?%;background:#ddd}uni-page-body .contact-customer-service-main .contact-customer-service-content[data-v-97959144]{padding:%?40?% %?30?%}uni-page-body .contact-customer-service-main .contact-customer-service-content .title-con[data-v-97959144]{padding-left:%?10?%}uni-page-body .contact-customer-service-main .contact-customer-service-content .content .row uni-input[data-v-97959144]{font-size:12px}uni-page-body .contact-customer-service-main .contact-customer-service-content .content uni-textarea[data-v-97959144]{font-size:%?24?%;background:#f9f9f9;width:100%;border-radius:%?10?%;padding:%?20?%;margin-top:%?25?%;box-sizing:border-box;height:%?500?%}uni-page-body .contact-customer-service-main .contact-customer-service-footer[data-v-97959144]{padding:%?40?%;margin-top:%?30?%;box-sizing:border-box}',""]),t.exports=e}}]);