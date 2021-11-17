<template>
    <div :class="`movebox ${className}`">
        <div class="movego"></div>
        <div class="txt" id="txt">{{$t('tips.loginVerification')}}</div>
        <div
          class="move moveBefore"
          v-move="moveend"
        ></div>
   </div>
</template>

<script>
  export default {
    name: 'movebar',
    props: {
    },
    data() {
      return {
        cancelMove: false, //满足条件时取消这个move事件
        verifyBar:false,
        className:''
      }
    },
    directives: {
      move(el, binding) {
        // console.log(el)

        var self = "";
        if (typeof binding.value == "function") {
          self = binding.value();
        }
        // self.className = '';
        document.onselectstart = function() {
          return false;
        };

        el.onmousedown = function(e) {
          var x = e.clientX;
          // console.log(1)

          var X = x - el.offsetLeft;
          // var X = e.clientX - el.offsetLeft
          document.onmousemove = function(e) {
            self.verifyBar = false;
            var y = e.clientX;
            // console.log(1)

            var endx = y - X;
            // var endx = e.clientX - X
            el.className = "move moveBefore";
            el.style.left = endx + "px";
            // console.log(el.parentNode.children[0])
            var width = $(".movebox").width() - $(".move").width();
            el.parentNode.children[0].style.width = endx + "px";
            el.parentNode.children[1].innerHTML = self.$t('tips.loginVerificationdrag');
            //临界值小于
            if (endx <= 0) {
              el.style.left = -1 + "px";
              el.parentNode.children[0].style.width = 0 + "px";
              // $('.movego').width(0)
            }

            //临界值大于
            // console.log(el.style.left)
            if (parseInt(el.style.left) >= width - 1) {
              el.style.left = width + 1 + "px";
              el.parentNode.children[0].style.width = width + 1 + "px";
              el.parentNode.children[1].innerHTML = self.$t('tips.loginVerificationsucceed');
              el.className = "move moveSuccess";
              self.className = 'moveSuccessbar';
              el.onmousedown = null;
              self.verifyBar = true;
              // console.log(self)
              // self.arrow = true;
              document.onmousemove = null;
            }
          };
        };
        document.onmouseup = function() {
          document.onmousemove = null;
          var width = $(".movebox").width() - $(".move").width();
          if (parseInt(el.style.left) < width - 1) {
            el.style.left = -1 + "px";
            el.parentNode.children[0].style.width = 0 + "px";
            el.parentNode.children[1].innerHTML =  self.$t('tips.loginVerification');
          }
        };
      }
  },
    methods: {
       //将this传入自定义组件里面
        moveend() {
          this.$emit('on-change',this.verifyBar) 
          return this;
        },
    
    }
  }

</script>
