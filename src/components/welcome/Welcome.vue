<template>
  <div id="welcome">
    <video id="video" autoplay loop>
      <source :src="video" type="video/mp4">
      Your browser does not support the video tag. 
    </video>
  </div>
</template>

<script>
  import video from '../game/videos/video.mp4';

  export default {
    name: 'Welcome',
    data() {
      return {
        video: video
      };
    },
    methods: {
      spaceEvent: function(e) {
        if(e.keyCode == 32) {
          this.$router.push({'name': 'Game'});
        }
      }
    },
    created: function() {
      document.addEventListener("keyup", this.spaceEvent);
    },
    beforeDestroy: function() {
      document.removeEventListener("keyup", this.spaceEvent);
    }
  };
</script> 

<style scoped>
  #video {
    width: 1472px;
    height: 100%;
    max-height: 888px;
    margin-left: calc((100vw - 1472px) / 2 );
  }
</style>
