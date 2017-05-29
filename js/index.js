$(function(){
   //全局变量
   var row;
   var snake=[{x:0,y:0},{x:0,y:1},{x:0,y:2}];
   var dictSnake={'0-0':true,'0-1':true,'0-2':true}
   var food=[];
   var timeId;
   var fangxiang=39;
   var grade=0;
   var oldhead;
   var count=3;
   var time=200;

   $('.juesexuanze').animate({marginTop:200},500)
   var xuanjuese=function(){
     var cName=$(this).attr('class');
     // var cId=$(this).attr('id');
     $('.mengshe').attr('class','mengshe '+cName);
     // $('.she').css('backgroundImage','url(img/'+cId+'.png)')
   }
   $('.name-box ol').on('click',xuanjuese)
   //公用函数
   var xy2id=function(x,y){
     return x+'-'+y;
   }

   //画场景
   var render=function(){
     row=row||20;
     var i=0,j=0,
     sence=$('#sence'),
     wh=Math.floor(600/row);
     sence.empty();
     for(;i<row;i++){
       for(j=0;j<row;j++){
         $('<div>').addClass('block')
         .attr('id',xy2id(i,j))
         .width(wh-1).height(wh-1)
         .appendTo(sence);
       }
     }
     sence.width(wh*row).height(wh*row);
   }
   render();


   //画蛇
   var snakeRender=function(){
     snake.forEach(function(v){
       $('#'+xy2id(v.x,v.y))
       .addClass('she');
       })
   }
   snakeRender();

   //画食物
   var fangshiwu=function(){
     var _x,_y;
     do{
       _x=Math.floor(Math.random()*row);
       _y=Math.floor(Math.random()*row);
         // console.log(_x,_y)
     }while(dictSnake[_x+'-'+_y]);
     $('#'+xy2id(_x,_y))
     .addClass('shiwu');
      return{'x':_x,'y':_y};
   }
   food=fangshiwu();

      //开始游戏
   function reduce(){
    time-=10;
    clearInterval(timeId);
    timeId=setInterval(move,time);
   }
   var startGame=function(){
     clearInterval(timeId);
     timeId=setInterval(move,time);
     timeId_s=setInterval(reduce,1000*10);
     // return;
   }
   //暂停游戏
   var pauseGame=function(){
     clearInterval(timeId);
     clearInterval(timeId_s);
   }
   //重新开始游戏
   var restart=function(){
     pauseGame();
     $('#gameover').hide();
     snake=[{x:0,y:0},{x:0,y:1},{x:0,y:2}];
       shiwu=null;
       timeId=null;
       fangxiang=39;
       render();
       snakeRender();
       food=fangshiwu()
       startGame()
   }

   $('.start').on('click',function(){
     $('#game').css('display','block')
     $(this).closest('div').css('display','none')
   })
   //点击事件
      $('ul li').on('click',function(){
       // $('li.active').removeClass('active')
       // $(this).addClass('active');
       if($(this).attr('data-role')){//切换sence操作
         row=Number($(this).attr('data-role'));
           render();
           snakeRender()
           food=fangshiwu()
       }else if($(this).attr('data-ctrl')){//开始暂停
         if($(this).attr('data-ctrl')=='start'){
           startGame()
           $('ul li[data-role]').off();
         }else if($(this).attr('data-ctrl')=='pause'){
           pauseGame()
         }else if($(this).attr('data-ctrl')=='restart'){
           restart()
         }
       }
      })
      //键盘事件
   $('.row').on('keydown',function(e){
     row=$(this).val();
     if(e.keyCode===13){
       if(isNaN(Number(row))){
         alert('请输入数字！')
       }else if(row<5||row>40){
         alert('请输入5-40的数字！')
       }else{
         render()
         snakeRender()
       }
     }
   })

   var grades=localStorage.grades?JSON.parse(localStorage.grades):[];
   var move=function(){
     oldhead=snake[snake.length-1];
     var newhead;
     if(fangxiang==39){
       newhead={x:oldhead.x,y:oldhead.y+1}
     }else if(fangxiang==37){
       newhead={x:oldhead.x,y:oldhead.y-1}
     }else if(fangxiang==38){
       newhead={x:oldhead.x-1,y:oldhead.y}

     }else if(fangxiang==40){
       newhead={x:oldhead.x+1,y:oldhead.y}
     }

      //撞墙
     if(newhead.x<0||newhead.x>row-1||newhead.y<0||newhead.y>row-1){
       pauseGame();
       $('#gameover').css('display','block');
       if(grade>=10){
         $('.star').fadeIn(500)
       }else if(grade>=6){
         $('.star1').fadeIn(500).delay(500).next().fadeIn(500);
       }else if(grade>=3){
         $('.star1').fadeIn(500);
       }else if(grade<3){
         $('.stars').text('失败了(＞﹏＜)！')
       }
       grades.push(grade);
       localStorage.grades=JSON.stringify(grades);
       $('#gameover strong:eq(1)').text(Math.max.apply(Math,grades));
       return;
     }
     //吃到食物
     if(newhead.x===food.x&&newhead.y===food.y){
         $('#'+xy2id(food.x,food.y))
         .addClass('she')
         .removeClass('shiwu');
         food=fangshiwu()
         grade+=1;
         $('.grade-box').find('h2').text(grade)
         $('#gameover strong:eq(0)').text(grade)
     }else{
        var weiba=snake.shift();
        $('#'+xy2id(weiba.x,weiba.y))
        .removeClass('she');
        dictSnake[xy2id(weiba.x,weiba.y)]=false;
     }
     dictSnake[xy2id(newhead.x,newhead.y)]=true;

     $('#'+xy2id(newhead.x,newhead.y)).addClass('she')
     snake.push(newhead)
   }

   //改变蛇方向
   $(document).on('keydown',function(e){
     if(Math.abs(e.keyCode-fangxiang)===2){
       return;
     }
     if(e.keyCode==37||e.keyCode==38||e.keyCode==39||e.keyCode==40){
       fangxiang=e.keyCode;
     }else{
        return;
     }
   });
   window.onbeforeunload =function(){
     pauseGame();
   }
 })
