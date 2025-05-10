<template>
    <p class="font-black text-[48px] ml-44 mt-20">Направления</p>
    <!-- Блок типовой номер один -->
    <div class="flex flex-col items-center">
        <div class="DestinationsBlockType1 mt-16">
            <p class="absolute ml-[350px] -mt-[500px] font-extrabold text-[32px]">Популярные места Пермского края</p>
            <div class="flex flex-col mt-[20px]">
                <button class="bloki bg-[url(/images/destinations/perm1.svg)]">
                    <p>Скульптурная галерея на <br>
                            открытом воздухе. Каждая<br>
                                скульптура создана авторами из<br>
                                    природного камня и вписана в<br>
                                невероятный окружающий<br>
                            ландшафт</p>
                </button>
                <p class="DestinationsBlockType1SmallText">
                    Каменный город
                </p>
            </div>
            <div class="flex flex-col mt-[20px]">

               <button class="bloki bg-[url(/images/destinations/perm2.svg)]">
                    <p>Уникальный каменный массив,<br>
                         вытянувшийся в длину на<br>
                          несколько километров и<br>
                           достигающий высоты 120<br> 
                           метров</p>
                </button>

                <p class="DestinationsBlockType1SmallText">
                    Усьвинские столбы
                </p>
            </div>
            <div class="flex flex-col mt-[20px]">
                <button class="bloki bg-[url(/images/destinations/perm3.svg)]">
                    <p>Ветлан представляет собой<br>
                        практически отвесную систему<br> 
                        высоких скалистых утесов, с<br>
                        которых открывается отличный<br> 
                        вид на реку Вишера</p>
                </button>
                <p class="DestinationsBlockType1SmallText">
                    Камень Ветлан
                </p>
            </div>
        </div>
        <!-- Блок типовой номер два -->
        <div class="DestinationsBlockType2 mt-40">
        <div class="flex flex-col ml-10 mt-10">
            <p class="text-[32px] font-extrabold">Зимой</p>
            <p class="text-[20px]">Горнолыжный курорт “Губаха” - лучший<br>
                 склон на Урале. В вашем распоряжении<br>
                  18 трасс протяжённостью от  100 до 2600<br>
                   метров с максимальным перепадом<br>
                   высот 310 метров.</p>
            <button class="ml-[200px] mt-16" @click="createTripRedirecting">
                <img src="/images/findTripPageFindBtn.svg" alt="">
            </button>
        </div>
        <button class="-mt-32 bloki2 bg-[url(/images/destinations/gubaha1.svg)]">
        </button>

    </div>
    <!-- Блок типовой номер 1-2 -->
    <div class="DestinationsBlockType1 mt-16">
            <p class="absolute ml-[575px] -mt-[500px] font-extrabold text-[32px] text-right leading-none">Дальше по Уралу:<br>
                Свердловская область</p>
            <div class="flex flex-col mt-[70px]">
                <button class="bloki bg-[url(/images/destinations/ekb1.svg)]">
                    <p>Самый чистый и красивый<br>
                         затопленный карьер, который<br>
                          получил своё название благодаря
                           кристально<br> прозрачной воде
                            голубоватого цвета</p>
                </button>
                
                <p class="DestinationsBlockType1SmallText">
                    Карьер Лазурный
                </p>

            </div>
            <div class="flex flex-col mt-[70px]">
                <button class="bloki bg-[url(/images/destinations/ekb2.svg)]">
                    <p>Глиняный карьер близ<br>
                         Екатеринбурга, который по сей<br>
                          день удивляет туристов<br>
                           космическими ландшафтом и<br>
                            неземной цветовой гаммой</p>
                </button>
                <p class="DestinationsBlockType1SmallText">
                    Уральский Марс
                </p>
            </div>
            <div class="flex flex-col mt-[70px]">
                <button class="bloki bg-[url(/images/destinations/ekb3.svg)]">
                    <p>Уникальная каменная арка на<br>
                         реке Исеть. Если<br>
                           присмотреться, то в скале<br>
                            можно разглядеть древние<br>
                             окаменелости.</p>
                </button>
                <p class="DestinationsBlockType1SmallText">
                    Каменные ворота
                </p>
            </div>
        </div>


        <!-- Блок типовой номер 2-2 -->
        <div class="DestinationsBlockType2 mt-40">
        <div class="flex flex-col ml-10 mt-10">
            <p class="text-[32px] font-extrabold">Любимые места...</p>
            <p class="text-[20px]">
                жителей Урала можете найти в "Поездках"</p>
            <button class="ml-[200px] mt-16" @click="createTripRedirecting">
                <img src="/images/findTripPageFindBtn.svg" alt="">
            </button>
        </div>
        <button class="-mt-32 bloki2 bg-[url(/images/destinations/Frame202.jpg)]">
        </button>

    </div>
    <div class="w-[1040px] h-[500px] flex justify-between mt-40">
        <div class="DestinationsBlockType3">
            <button class="bloki3 drop-shadow-lg -mt-[55px] bg-[url(/images/destinations/taganay1.svg)]">
                
            </button>
            <p class="DestinationsBlockType1SmallText -ml-[320px]">Таганай</p>
            <p>Национальный парк “Таганай” — это уникальная<br>
                 возможность за один раз увидеть все типичные<br>
                  ландшафты горного Урала и побывать в разных<br>
                   климатических поясах</p>
        </div>
        <div class="DestinationsBlockType3">
            <button class="bloki3 -mt-[55px] bg-[url(/images/destinations/chert.svg)]">
                
            </button>
            <p class="DestinationsBlockType1SmallText -ml-[215px]">Чертово городище</p>
            <p>Величественные скалы на вершине одноименной<br>
                 горы. Вершина Чертова Городища достигает 347 <br>
                   метров над уровнем моря, из них последние 20 <br>
                    метров — могучий гранитный гребень</p>
        </div>

    </div>

    <div class="w-[1040px] h-[400px] flex justify-between mt-10">
        <div class="DestinationsBlockType3">
            <button class="bloki3 drop-shadow-lg -mt-[55px] bg-[url(/images/destinations/kolpaki.svg)]">
                
            </button>
            <p class="DestinationsBlockType1SmallText -ml-[265px]">Гора Колпаки</p>
            <p>Невысокие, но красивые скалы возвышаются на<br>
                 горе Колпаки на на границе Европы и Азии, близ<br>
                  границы Пермского края со Свердловской<br>
                   областью</p>
        </div>
        <div class="DestinationsBlockType3">
            <button class="bloki3 -mt-[55px] bg-[url(/images/destinations/kungur.svg)]">
            
            </button>
            <p class="DestinationsBlockType1SmallText -ml-[195px]">Чертово городище</p>
            <p>Кунгурская ледяная пещера — одна из<br>
                 крупнейших карстовых пещер в мире и одна из<br>
                  самых популярных достопримечательностей<br>
                   Урала. И да, там очень холодно</p>
        </div>

    </div>






    </div>
    
    
    
    


    <div class="h-[300px]">

    </div>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
  name: "Destinations",
  setup() {
    const router = useRouter()

    const createTripRedirecting = () => {
      router.push('/createtrip')
    }
    return {
      createTripRedirecting,
    }
  }
}



</script>

<style lang="scss" scoped>
    img{
        -webkit-user-drag: none;
        -khtml-user-drag: none;
        -moz-user-drag: none;
        -o-user-drag: none;
        user-drag: none;
    }
</style>