###综述
图片倒影，基于HTML5 Canvas，IE使用滤镜实现

* 版本：1.1
* 基于：kissy1.2.0+
* 作者：元泉

###演示页面
[DEMO](http://gallery.kissyui.com/reflection/1.1/demo/index.html)


## 组件使用

kissy1.2下需要gallery的包配置：

```javascript
KISSY.config({
    packages:[
        {
            name:"gallery",
            path:"http://a.tbcdn.cn/s/kissy/",
            charset:"utf-8"
        }
    ]
});
```

kissy1.3就不需要该配置。



### 加载Reflection模块,初始化Reflection

```javascript
KISSY.use('gallery/reflection/1.0/index', function (S, Reflection) {
	var reflection = new Reflection({
		selector : '.reflect',
		height:0.5,
		opacity:0.7
	});
	S.one('#J_Add').on("click", function(e){
		e.halt();
		reflection.render();
	});
	S.one('#J_Cancel').on("click", function(e){
		e.halt();
		reflection.removeAll();
	});
});
```


### Class ###
- Reflection

### Attributes
- **selector**
  + {String} 需要添加倒影的图片选择器，默认.reflect
- **height**
  + {Number} 倒影高度比例，默认.5
- **opacity**
  + {Number} 倒影透明度，默认.5


### Method
- **render()**
  + 渲染方法，为selector选择器匹配的图片创建倒影
  + 高度为配置的height（默认为0.5）,优先使用伪属性data-rheight
  + 透明度为配置的opacity（默认为0.5）,优先使用伪属性data-ropacity
- **add(image,config)**
  + 为一张图片添加倒影，config.height高度比例，config.opacity透明度
- **removeAll()**
  + 删除selector选择器匹配的图片的倒影
- **remove(image)**
  + 删除image的倒影