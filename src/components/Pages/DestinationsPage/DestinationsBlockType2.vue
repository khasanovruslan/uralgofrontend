<template>
    <div class="DestinationsBlockType2 mt-40 flex items-center ">
      <div class="flex-1 flex flex-col ml-10 mt-10">
        <p class="text-[32px] font-extrabold">{{ title }}</p>
        <p class="text-[20px] mt-2" v-html="description" />
        <button class="mt-8 self-center bg-no-repeat" @click="$emit('action')">
          <img :src="btnImg" alt="button" class="bg-no-repeat" />
        </button>
      </div>
      <button
        class="flex-1 bloki2"
        :style="{ backgroundImage: `url(${img})` }"
      />
    </div>
  </template>
  
  <script>
  export default {
    name: 'DestinationsBlockType2',
    props: {
      title: { type: String, required: true },
      description: { type: String, required: true },  // может содержать <br>
      img: { type: String, required: true },
      btnImg: { type: String, default: '/images/findTripPageFindBtn.svg' },
    },
  }
  </script>
  