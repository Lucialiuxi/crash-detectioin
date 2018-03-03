window.onload = function(){
    //封装判断是否碰撞的函数
    function ElementsCrash(box1,box2){
        if(box1.getBoundingClientRect().right < box2.getBoundingClientRect().left ||
            box1.getBoundingClientRect().left > box2.getBoundingClientRect().right ||
            box1.getBoundingClientRect().bottom < box2.getBoundingClientRect().top ||
            box1.getBoundingClientRect().top > box2.getBoundingClientRect().bottom
        ){//没有碰上
            return false;

        }else{//碰上了
            return true;
        }
    }
    var box = document.getElementsByTagName('div');
    var findClosed = document.getElementById('findClosed')
    
    //框选
    document.onmousedown = function(ev){
        //框选和碰撞不能一起，要框选的时候碰撞元素回到最开始位置
        findClosed.style.top = '';
        findClosed.style.left = '';
        //并且要清空所有box的innerHTML和恢复颜色
        for( var i = 0; i < box.length; i++){
            box[i].style.backgroundColor = '';
            box[i].innerHTML = '';
        }

        //创建框选元素
        var dragSelect = document.createElement('div');
        dragSelect.classList.add('dragSelect')
        document.body.appendChild(dragSelect)
        dragSelect.style.backgroundColor = 'palegreen'

        //获取点击的时候鼠标在可视区域的坐标位置
        var x = ev.clientX;
        var y = ev.clientY;

        document.onmousemove = function(ev){
            //框选元素的大小是鼠标按下是鼠标的位置和移动时鼠标位置的差值
            dragSelect.style.width = Math.abs(ev.clientX-x)+'px';
            dragSelect.style.height = Math.abs(ev.clientY-y)+'px'

            //框选元素到浏览器可视区域的位置：用鼠标开始和结束位置比较，值小的就说明是框选元素上面（top）和左边（left）最近
            dragSelect.style.left = Math.min(ev.clientX,x)+ 'px';
            dragSelect.style.top = Math.min(ev.clientY,y) + 'px';

            //取消浏览器默认行为
            ev.preventDefault();
            
            //调用碰撞元元素,被框选的元素改变颜色
            for( var i = 0; i < box.length; i++){
                if(ElementsCrash(dragSelect,box[i])){
                    box[i].classList.add('aaa')
                }
            }
        }
        //鼠标开启
        document.onmouseup = function(){
            document.onmousemove = document.onmouseup = null;
            //移出框选元素
            dragSelect.remove();
            for( var i = 0; i < box.length; i++){
                box[i].removeAttribute('class')
            }

        }
    }

    //拖拽元素findClosed能走的最大值
    var findClosedMaxX = document.documentElement.clientWidth - findClosed.offsetWidth;
    var findClosedMaxY = document.documentElement.clientHeight - findClosed.offsetHeight;
    // console.log(findClosedMaxX,findClosedMaxY)

    //点击拖拽findClosed碰撞box
   findClosed.onmousedown = function(ev){
    
        //鼠标到被点击拖拽元素左边和上面的距离
        var mouseLocaleX = ev.clientX - findClosed.offsetLeft;
        var mouseLocaleY = ev.clientY - findClosed.offsetTop;
        
        document.onmousemove = function(ev){
            //取消浏览器的默认行为
            ev.preventDefault();
            //定义一个空数组去存碰撞到的元素的中心点 到 findClosed的中心点的距离
            var arr = [];

            //被拖拽元素到可视区域左边的位置
            var x = ev.clientX - mouseLocaleX;
            var y = ev.clientY - mouseLocaleY;
            //拖拽的元素必须是要在可视区域
            if(x<0) x=0;
            if(y<0) y=0;
            if(x>findClosedMaxX) x=findClosedMaxX;
            if(y>findClosedMaxY) y=findClosedMaxY;
            findClosed.style.left = x +'px';
            findClosed.style.top = y + 'px';
            
            //找到findClosed的中心点的位置
            var findClosedCenterX = findClosed.getBoundingClientRect().left +findClosed.offsetWidth/2
            var findClosedCenterY = findClosed.getBoundingClientRect().top +findClosed.offsetWidth/2

            //调用碰撞元元素,被碰撞的元素改变颜色
            for( var i = 0; i < box.length; i++){
                box[i].innerHTML = ''
                if(ElementsCrash(findClosed,box[i])){
                    box[i].style.backgroundColor = 'yellow'
                    arr.push(box[i])

                }else{//如果没有碰撞，就恢复原本的颜色
                    box[i].style.backgroundColor = 'salmon';
                    
                }
            }
            
            //如果有元素被碰撞到
            if(arr.length>0){
                
                //定义一个变量赋值一个最大值，去跟所有碰撞的到的元素的中心点对比，找到最小值
                var getMin = Infinity;
                //定义一个变量存距离拖拽元素最近的元素
                var ele = null;
                for(var i = 0; i < arr.length; i++){
                    //找到碰撞到的这项的中心点
                    var centerX = arr[i].getBoundingClientRect().left + arr[i].offsetWidth/2;
                    var centerY = arr[i].getBoundingClientRect().top + arr[i].offsetHeight/2;

                    //findClosed的中心距离到 被碰撞到的box的中心点的距离，等于两个中心点的z^2 = x^2 + y^2
                    var ZPow = Math.pow(centerX-findClosedCenterX,2)+Math.pow(centerY-findClosedCenterY,2)
                    if(ZPow<getMin){
                        getMin = ZPow;
                        el = arr[i]
                    }
                }
                
               //如果找到了离拖拽元素最近的元素，那改变其颜色
               if(el){
                //    console.log('最近的是',el)
                  el.style.backgroundColor = 'pink';
                  el.innerHTML='Och!'
               }
               
            }

        }
        document.onmouseup = function(){
            document.onmousemove = document.onmouseup = null;
        }
        //相同的事件，在冒泡的时候会执行document上的，所以要阻止冒泡
        ev.stopPropagation()

    }   












































}