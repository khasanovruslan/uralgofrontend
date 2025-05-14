<template>
    <div class="w-full flex flex-col items-center mt-20">
      <p class="font-black text-[48px]">Направления</p>
  
      <!-- Type1: Пермский край -->
      <DestinationsBlockType1
        title="Популярные места Пермского края"
        titlePositionClass="ml-[350px] -mt-[500px]"
        :items="permkrai"
      />
  
      <!-- Type2: Зимой -->
      <DestinationsBlockType2
        title="Зимой"
        description="Горнолыжный курорт “Губаха” - лучший<br>
                     склон на Урале. В вашем распоряжении<br>
                     18 трасс протяжённостью от 100 до 2600<br>
                     метров с максимальным перепадом высот 310 метров."
        img="/images/destinations/gubaha1.svg"
        @action="createTripRedirecting"
      />
  
      <!-- Type1: Свердловская область -->
      <DestinationsBlockType1
        title="Дальше по Уралу:<br>Свердловская область"
        titlePositionClass="ml-[575px] -mt-[500px] text-right leading-none"
        :items="sverdlovsk"
      />
  
      <!-- Type2: Любимые места -->
      <DestinationsBlockType2
        title="Любимые места..."
        description='жителей Урала можете найти в "Поездках"'
        img="/images/destinations/Frame202.jpg"
        @action="createTripRedirecting"
      />
  
      <!-- Type3: 2×2 сетка -->
      <div class="w-[1040px] flex flex-wrap justify-between mt-40 gap-y-10">
        <DestinationsBlockType3
          v-for="(item, i) in gridItems"
          :key="i"
          :img="item.img"
          :label="item.label"
          :description="item.description"
        />
      </div>
  
      <div class="h-[300px]" />
    </div>
  </template>
  
  <script>
  import { useRouter } from 'vue-router'
  import DestinationsBlockType1 from '@/components/Pages/DestinationsPage/DestinationsBlockType1.vue'
  import DestinationsBlockType2 from '@/components/Pages/DestinationsPage/DestinationsBlockType2.vue'
  import DestinationsBlockType3 from '@/components/Pages/DestinationsPage/DestinationsBlockType3.vue'
  
  export default {
    name: 'Destinations',
    components: {
      DestinationsBlockType1,
      DestinationsBlockType2,
      DestinationsBlockType3,
    },
    setup() {
      const router = useRouter()
      const createTripRedirecting = () => router.push('/createtrip')
  
      // Данные для блоков
      const permkrai = [
        {
          img: '/images/destinations/perm1.svg',
          description:
            'Скульптурная галерея на <br>открытом воздухе. Каждая<br>' +
            'скульптура создана авторами из<br>природного камня и вписана в<br>' +
            'невероятный окружающий<br>ландшафт',
          label: 'Каменный город',
        },
        {
          img: '/images/destinations/perm2.svg',
          description:
            'Уникальный каменный массив,<br>' +
            'вытянувшийся в длину на<br>' +
            'несколько километров и<br>' +
            'достигающий высоты 120<br>метров',
          label: 'Усьвинские столбы',
        },
        {
          img: '/images/destinations/perm3.svg',
          description:
            'Ветлан представляет собой<br>' +
            'практически отвесную систему<br>' +
            'высоких скалистых утесов, с<br>' +
            'которых открывается отличный<br>' +
            'вид на реку Вишера',
          label: 'Камень Ветлан',
        },
      ]
      const sverdlovsk = [
        {
          img: '/images/destinations/ekb1.svg',
          description:
            'Самый чистый и красивый<br>' +
            'затопленный карьер, который<br>' +
            'получил своё название благодаря<br>' +
            'кристально прозрачной воде<br>голубоватого цвета',
          label: 'Карьер Лазурный',
        },
        {
          img: '/images/destinations/ekb2.svg',
          description:
            'Глиняный карьер близ<br>' +
            'Екатеринбурга, который по сей<br>' +
            'день удивляет туристов<br>' +
            'космическими ландшафтом и<br>' +
            'неземной цветовой гаммой',
          label: 'Уральский Марс',
        },
        {
          img: '/images/destinations/ekb3.svg',
          description:
            'Уникальная каменная арка на<br>' +
            'реке Исеть. Если<br>' +
            'присмотреться, то в скале<br>' +
            'можно разглядеть древние<br>' +
            'окаменелости.',
          label: 'Каменные ворота',
        },
      ]
      const gridItems = [
        {
          img: '/images/destinations/taganay1.svg',
          label: 'Таганай',
          description:
            'Национальный парк “Таганай” — это уникальная<br>' +
            'возможность за один раз увидеть все типичные<br>' +
            'ландшафты горного Урала и побывать в разных<br>' +
            'климатических поясах',
        },
        {
          img: '/images/destinations/chert.svg',
          label: 'Чертово городище',
          description:
            'Величественные скалы на вершине одноименной<br>' +
            'горы. Вершина Чертова Городища достигает 347<br>' +
            'метров над уровнем моря, из них последние 20<br>' +
            'метров — могучий гранитный гребень',
        },
        {
          img: '/images/destinations/kolpaki.svg',
          label: 'Гора Колпаки',
          description:
            'Невысокие, но красивые скалы возвышаются на<br>' +
            'горе Колпаки на границе Европы и Азии, близ<br>' +
            'границы Пермского края со Свердловской<br>' +
            'областью',
        },
        {
          img: '/images/destinations/kungur.svg',
          label: 'Кунгурская ледяная пещера',
          description:
            'Кунгурская ледяная пещера — одна из<br>' +
            'крупнейших карстовых пещер в мире и одна из<br>' +
            'самых популярных достопримечательностей<br>' +
            'Урала. И да, там очень холодно',
        },
      ]
  
      return {
        createTripRedirecting,
        permkrai,
        sverdlovsk,
        gridItems,
      }
    },
  }
  </script>
  