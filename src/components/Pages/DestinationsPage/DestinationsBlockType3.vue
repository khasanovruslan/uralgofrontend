<template>
    <div class="DestinationsBlockType3 flex flex-col mt-20 items-start">
      <button
        class="bloki3 drop-shadow-lg -mt-[55px] w-full h-48 bg-cover bg-center"
        :style="{ backgroundImage: `url(${img})` }"
      />
      <p class="DestinationsBlockType1SmallText mt-4">{{ label }}</p>
      <p class="mt-2 text-base" v-html="description" />
    </div>
  </template>
  
  <script>
  export default {
    name: 'DestinationsBlockType3',
    props: {
      img: { type: String, required: true },
      label: { type: String, required: true },
      description: { type: String, required: true },  // может содержать <br>
    },
  }
  </script>
  