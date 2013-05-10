/*
combined files : 

gallery/reflection/1.1/index

*/
/**
 * @fileoverview 图片添加倒影
 * @author 元泉<yuanquan.wxr@taobao.com>
 * @module reflection
 **/
KISSY.add('gallery/reflection/1.1/index',function (S, Node,Base) {
    var D = S.DOM;
    /**
     * 图像倒影
     * @class Reflection
     * @constructor
     * @extends Base
     */
    function Reflection(comConfig) {
        var self = this;
        //调用父类构造函数
        Reflection.superclass.constructor.call(self, comConfig);
    }
    S.extend(Reflection, Base, /** @lends Reflection.prototype*/{
        /**
         * 增加倒影
         */
        render : function(){
            var _this = this;
            var rimages = D.query(_this.get("selector"));
            S.each(rimages,  function(img) {
                imgReady(img,function(){
                    var rheight = parseFloat(D.attr(img, 'data-rheight')) || _this.get('height');
                    var ropacity = parseFloat(D.attr(img, 'data-ropacity')) || _this.get('opacity');
                    _this.add(img, {
                        'height': rheight,
                        'opacity': ropacity
                    });
                });
            });
        },
        /**
         * 为一张图片增加倒影
         * @param image
         * @param options
         */
        add : function(image, options){
            /*将添加过倒影的图片移除倒影*/
            this.remove(image);
            var canvas = D.create('<canvas></canvas>');
            if('getContext' in canvas){
                this.renderByCanvas(canvas, image, options);
            }else{
                this.renderByFilter(image, options);
            }
        },
        /**
         * 使用canvas渲染
         * @param canvas
         * @param image
         * @param options
         */
        renderByCanvas : function(canvas, image, options){
            var d = D.create('<div></div>');
            var p = image;
            var newClasses = p.className;
            var reflectionHeight = Math.floor(p.height * options['height']);
            var divHeight = Math.floor(p.height * (1 + options['height']));
            var reflectionWidth = p.width;
            /* Copy original image's classes & styles to div */
            d.className = newClasses;
            p.className = 'reflected';
            d.style.cssText = p.style.cssText;
            p.style.cssText = 'vertical-align: bottom';
            canvas.height = reflectionHeight;
            canvas.width = reflectionWidth;
            d.style.width = reflectionWidth + 'px';
            d.style.height = divHeight + 'px';
            p.parentNode.replaceChild(d, p);
            d.appendChild(p);
            d.appendChild(canvas);
            var context = canvas.getContext("2d");
            context.save();
            context.translate(0, p.height - 1);
            context.scale(1, -1);
            context.drawImage(p, 0, 0, reflectionWidth, p.height);
            context.restore();
            // https://developer.mozilla.org/samples/canvas-tutorial/6_1_canvas_composite.html
            context.globalCompositeOperation = "destination-out";
            var gradient = context.createLinearGradient(0, 0, 0, reflectionHeight);
            gradient.addColorStop(0, "rgba(255, 255, 255, " + (1 - options['opacity']) + ")");
            gradient.addColorStop(1, "rgba(255, 255, 255, 1.0)");
            context.fillStyle = gradient;
            context.rect(0, 0, reflectionWidth, reflectionHeight);
            context.fill();
        },
        /**
         * 使用滤镜渲染
         * @param image
         * @param options
         */
        renderByFilter : function(image, options){
            var d = D.create('<div></div>');
            var p = image;
            var newClasses = p.className;
            var reflectionHeight = Math.floor(p.height * options['height']);
            var divHeight = Math.floor(p.height * (1 + options['height']));
            var reflectionWidth = p.width;
            /* Fix hyperlinks */
            if (p.parentElement.tagName == 'A') {
                d = D.create('<a></a>');
                d.href = p.parentElement.href;
            }
            /* Copy original image's classes & styles to div */
            d.className = newClasses;
            p.className = 'reflected';
            d.style.cssText = p.style.cssText;
            p.style.cssText = 'vertical-align: bottom';
            var reflection = new Image();
            reflection.onload = function(){
                reflection.style.width = reflectionWidth + 'px';
                reflection.style.display = 'block';
                reflection.style.height = p.height + "px";
                reflection.style.marginBottom = "-" + (p.height - reflectionHeight) + 'px';
                // http://msdn.microsoft.com/en-us/library/ms532972(v=vs.85).aspx
                var filter = 'flipv progid:DXImageTransform.Microsoft.Alpha(opacity='+(options['opacity']*100)+', style=1, finishOpacity=0, startx=0, starty=0, finishx=0, finishy='+(options['height']*100)+')';
                reflection.style.filter = filter;
                d.style.width = reflectionWidth + 'px';
                d.style.height = divHeight + 'px';
                p.parentNode.replaceChild(d, p);
                d.appendChild(p);
                d.appendChild(reflection);
            };
            reflection.src = p.src;
        },
        /**
         * 删除所有倒影
         */
        removeAll : function(){
            var rimages = D.query('.reflected');
            var _this = this;
            S.each(rimages,  function(img) {
                _this.remove(img);
            });
        },
        /**
         * 删除一个图片倒影
         * @param image
         */
        remove : function(image){
            image = D.get(image);
            if (image && image.className == "reflected") {
                image.className = image.parentNode.className;
                image.parentNode.parentNode.replaceChild(image, image.parentNode);
            }
        }
    }, {ATTRS : /** @lends Reflection*/{
        height : {
            value : 0.5
        },
        opacity : {
            value : 0.5
        },
        selector : {
            value : '.reflect'
        }
    }});

    function imgReady(img ,fn){
        if(img.complete){
            fn();
        }else{
            S.Event.on(img,"load",fn);
        }
    }

    return Reflection;
}, {requires:['node', 'base']});
