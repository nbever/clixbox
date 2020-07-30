<template>
  <div class="image-saver">
    <div class="image-display" v-if="imageUrl !== null">
      <div class="image-preview" :style="{ backgroundImage: `url(/images/${imageUrl})`}">
      </div>
    </div>
    <div class="image-picker">
      <md-field>
        <md-file v-model="imageFile" id="logoUpload"
          name="logoUpload"
          :placeholder="placeholder"
          @md-change="imageChosen($event)"
        >
        </md-file>
      </md-field>
    </div>
  </div>
</template>

<script>
  
  export default {
    name: 'image-saver',
    data: function() {
      return {
        imageUrl: null,
        imageFile: null
      };
    },
    props: {
      placeholder: String,
      imageName: Function
    },
    methods: {
      imageChosen: function ($e) {
        
        const fx = async () => {
          this.imageFile = $e[0];
          const imageUrl = await this.saveImage(this.imageFile);

          this.imageUrl = imageUrl;
          this.imageName(this.imageUrl);
        };

        fx();
      },
      deleteImage: function() {
        const fx = async () => {
          await this.deleteImage(this.imageUrl);
        };

        fx();
      }
    }
  };
</script>

<style lang="scss" scoped>

.image-display {
  position: relative;
}

.delete {
  position: absolute;
  right: 4px;
  top: 2px;
  opacity: 0.7;
  cursor: pointer;

  &:hover {
    opacity: 1.0;
  }
}

.image-preview {
  width: 150px;
  height: 150px;

  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

</style>