<template>
    <div class="DestinationsBlockType1 mt-16 relative">
      <p
        class="absolute font-extrabold text-[32px]"
        :class="titlePositionClass"
        v-html="title"
      />
      <div class="flex space-x-8 mt-[70px] md:mt-[20px]">
        <div
          v-for="(item, i) in items"
          :key="i"
          class="flex flex-col items-center"
        >
          <button
            class="bloki bg-[url(/images/destinations/placeholder.svg)]"
            :style="{ backgroundImage: `url(${item.img})` }"
          >
            <p v-html="item.description" />
          </button>
          <p class="DestinationsBlockType1SmallText mt-4">{{ item.label }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DestinationsBlockType1',
    props: {
      title: { type: String, required: true },              // заголовок (может быть с <br>)
      titlePositionClass: { type: String, default: 'ml-[350px] -mt-[500px]' },
      items: {
        type: Array,
        required: true,
        // каждый элемент: { img: String, description: String с <br>, label: String }
      },
    },
  }
  </script>
  
  <style scoped lang="scss">
  /* Можно тут вынести .bloki и .DestinationsBlockType1SmallText */
  </style>
  