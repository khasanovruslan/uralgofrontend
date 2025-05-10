<template>
  <main>
    <!-- 
      
      ОБЛОЖКА
    
    -->

    <div class="hidden xl:block">
      <p class="text-256px font-ProximaNova font-black text-stroke-1 text-stroke-black text-white -ml-10 -mt-20  ">
        uralgo
      </p>
    </div>
    <div class="">
      <p class="font-Montserrat font-black mt-6 text-2xl text-center xl:text-6xl xl:text-start xl:ml-24 xl:-mt-12 tracking-wide ">
        удобный сервис<br> для <span class="magic-effect">попутчиков</span>
      </p>
    </div>
    <div class="flex flex-col pt-8 space-y-3 items-center xl:space-y-10 xl:block xl:relative xl:h-[600px] xl:-mt-[300px]">
      <button class="bg-createTripRedirecting h-[35px] w-[175px] bg-no-repeat bg-contain xl:h-[70px] xl:w-[350px]  xl:absolute xl:right-[220px]" @click="createTripRedirecting">
      </button>
      <button class="bg-findTripRedirecting h-[35px] w-[175px] bg-no-repeat bg-contain xl:h-[70px] xl:w-[350px] xl:absolute xl:right-[140px] xl:top-[80px]" @click="findTripRedirecting">
      </button>
    </div>

    <!-- 
      
      ОБЛОЖКА
    
    -->

    <!-- 
      
      О НАС
    
    -->

    <div class="aboutUs paragraphTextPhone mt-14">
      <div class="xl:mt-16 non-draggable">
      <p class="xl:hidden text-center text-[32px] font-extrabold">О нас</p>
      <img src="/images/aboutUsHeader.svg" class="hidden xl:block non-draggable bg-no-repeat bg-contain">
      </div>
      <div class="xl:ml-[90px]  ml-[30px] mt-[20px] xl:mt-[80px]">
        <p class="xl:paragraphText tracking-wide leading-tight"><b>Uralgo</b> - сервис, созданный с 
          целью упрощения жизни простых <br>путешественников и популяризации туризма на 
          <b>Урале</b> и в <br><b>Приволжье.</b> <br><br>Наша цель - обеспечить своим клиентам комфортные, 
          <br>выгодные и интересные поездки по самым знаковым и необычным <br>местам Уральских 
          гор и их окрестностей.</p>
      </div>
      <div class="xl:w-screen xl:flex xl:justify-evenly hidden">
            <img src="/images/aboutUsNature1.svg" alt="Image 1" class="xl:w-[360px] xl:h-[360px] xl:mt-[120px] hidden xl:block">
            <img src="/images/aboutUsNature2.svg" alt="Image 2" class="xl:w-[360px] xl:h-[360px] xl:mt-[60px] hidden xl:block">
            <img src="/images/aboutUsNature3.svg" alt="Image 3" class="xl:w-[360px] xl:h-[360px] hidden xl:block">
      </div>
      <div class="xl:mr-[100px] xl:-mt-[50px]">
        <p class="text-right xl:mr-0 mr-8 xl:mt-20 mt-[30px] xl:paragraphText24 tracking-wide leading-tight">
          Здесь вы сможете как и <b>найти<br>
          себе попутчика</b> или <b>самому<br class="xl:hidden block"> побыть в роли попутчика,</b><br>
          так и изучить наиболее<br class="xl:hidden block"> интересные и значимые места<br>
          границы Европы и Азии в России.
        </p>
      </div>
    </div>

    <!-- 
      
      О НАС
    
    -->


    <!-- 
      
      НАПРАВЛЕНИЯ
    
    -->


    <div class="destinationsHeader paragraphTextPhone xl:paragraphText mt-14 xl:mt-64">
      <div class="xl:mt-16 non-draggable  ">
        <p class="xl:hidden text-center text-[32px] font-extrabold">Направления</p>
      <img src="/images/destinationsHeader.svg" class="hidden xl:block non-draggable bg-no-repeat bg-contain">
      </div>
      <div class="xl:mt-[40px] xl:ml-[100px] ml-[30px] mt-[30px] tracking-wide leading-tight">
        <p>
          <b>Туризм</b> - одна из основных<br class="xl:hidden block"> сторон нашего проекта.<br class="xl:hidden block"> Интересные маршруты,<br>
          достопримечательности,<br class="xl:hidden block"> приключения, эмоции - всё это<br class="xl:hidden block"> неотъемлемая часть<br class="hidden xl:block">
          любого<br class="xl:hidden block"> путешествия. <br class="xl:hidden block"><br class="xl:hidden block">
          <span class="xl:block hidden">Ниже для вас представлен список <b>интересных мест,</b> в<br>
          которые вы в любое время можете отправиться в автомобиле с попутчиком<br>
          или просто со своими друзьми в комфортной машине через <b>Uralgo.</b></span>
          <span class="block xl:hidden text-right mr-[30px]">
            Ниже вы можете просмотреть<br> 
            список <b>интересных мест,</b><br>
            в которые вы в любое время<br>
            можете отправиться в<br> 
            автомобиле с попутчиком или<br> 
            просто со своими друзьми в<br> 
            комфортной машине через<br> 
            <b>Uralgo.</b></span>
        </p>
      </div>
    </div>
    <div class="xl:hidden flex justify-center mt-[40px]">
      <button class="bg-goToDestinationsMobile bg-no-repeat bg-contain w-[276px] h-[48px]">
      </button>
    </div>

    <!-- 
      
      НАПРАВЛЕНИЯ
    
    -->

    <!-- 
      
      ГАЛЕРЕЯ
    
    -->

    <div class="slider-container">
    <div class="slider hidden xl:block">
        <div class="slides">
            <input type="radio" name="radio-btn" id="radio1">
            <input type="radio" name="radio-btn" id="radio2">
            <input type="radio" name="radio-btn" id="radio3">

        <div class="slide first">
            <img src="/images/galleryCenter.svg" alt="" class="non-draggable">
        </div>
        <div class="slide">
            <img src="/images/право.svg" alt="" class="non-draggable">
        </div>
        <div class="slide">
            <img src="/images/лево.svg" alt="" class="non-draggable">
        </div>

        <div class="navigation-auto">
            <div class="auto-btn1"></div>
            <div class="auto-btn2"></div>
            <div class="auto-btn3"></div>
        </div>

    </div>

    <div class="navigation-manual">
        <label for="radio1" class="manual-btn"></label>
        <label for="radio2" class="manual-btn"></label>
        <label for="radio3" class="manual-btn"></label>

    </div>
    </div>
    </div>

    <!-- 
      
      ГАЛЕРЕЯ
    
    -->

    <!-- 
      
      ВОЗМОЖНОСТИ
    
    -->

    <div class="possibilities tracking-wide leading-none">
      <div>
        <p class="xl:hidden text-center text-[32px] font-extrabold -mt-[30px]">Возможности</p>
        <img src="/images/headerPossibilities.svg" alt="header" class="hidden xl:block non-draggable bg-no-repeat bg-contain mt-[300px]">
      </div>
        <p class="xl:text-[40px] text-[16px] mt-[20px] xl:mt-[140px] font-black magic-effect text-center">
          с помощью Uralgo вы сможете:
        </p>
        
        <!-- ВОЗМОЖНОСТИ ПОД ТЕЛЕФОН -->

        <!-- 1 ВОЗМОЖНОСТЬ ТЕЛЕФОН -->
        <div class="xl:hidden flex flex-col mt-8 ml-4">
          <div class="flex">
            <p class="text-[128px] font-normal text-stroke-1 text-stroke-black text-white ">1</p>
            <p class="paragraphTextPhone14 mt-[16px]">
              отправиться в <b>путешествие</b><br>
              по достопримечательностям<br>
              <b>Урала</b> попутчиком
            </p>
          </div>
          <button class="-ml-[160px] bg-findTripButtonMobile bg-no-repeat bg-contain h-[48px] w-[350px]" @click="findTripRedirecting">
      </button>
        </div>
       <!-- 2 ВОЗМОЖНОСТЬ ТЕЛЕФОН -->
        <div class="xl:hidden flex flex-col mt-8 mr-4 items-end">
          <div class="flex">
            <p class="paragraphTextPhone14 mt-[65px] text-right">
              организовать<br> 
              <b>выгодную</b> поездку с<br>
              <b>интересными</b> людьми
            </p>
            <p class="text-[128px] font-normal text-stroke-1 text-stroke-black text-white ">2</p>
          </div>
          <button class="-mr-[60px] bg-createTripButtonMobile bg-no-repeat bg-contain h-[48px] w-[260px]" @click="createTripRedirecting">
      </button>
        </div>
        <!-- 3 ВОЗМОЖНОСТЬ ТЕЛЕФОН -->
        <div class="xl:hidden flex flex-col mt-8 ml-4">
          <div class="flex">
            <p class="text-[128px] font-normal text-stroke-1 text-stroke-black text-white ">3</p>
            <p class="paragraphTextPhone14 mt-[65px]">
              изучить наиболее<br>
               <b>значимые и интересные</b><br> 
               места <b>Уральских гор</b>
            </p>
          </div>
          <button class="-ml-[60px] bg-destinationsButtonMobile bg-no-repeat bg-contain h-[48px] w-[260px]" @click="destinationsRedirecting">
      </button>
        </div>

        <!-- ВОЗМОЖНОСТИ ПОД КОМП -->
        <!-- 1 ВОЗМОЖНОСТЬ КОМП -->
        <div class="hidden xl:flex ml-[100px] mt-[130px] ">
          <p class="text-[256px] font-normal">1</p>
          <div class="space-y-6">
            <p class="paragraphText24 mt-[50px]">
              отправиться в <b>путешествие</b> по достопримечательностям<br>
              <b>Урала</b> попутчиком
            </p>
            <button class="bg-findTripRedirecting bg-no-repeat bg-contain h-[70px] w-[350px]" @click="findTripRedirecting">
      </button>
          </div>
        </div>
        <!-- 2 ВОЗМОЖНОСТЬ КОМП -->
        <div class="hidden xl:flex justify-end mr-[100px] space-x-6 mt-[50px]">
          <div class="space-y-6">
            <p class="paragraphText24 mt-[50px] text-right">
              организовать <b>выгодную</b><br> поездку с <b>интересными<br></b> людьми
            </p>
            <button class="bg-createTripRedirecting bg-no-repeat bg-contain h-[70px] w-[350px]" @click="createTripRedirecting">
      </button>
          </div>
          <p class="text-[256px] font-normal ">2</p>
        </div>
        
        <!-- 3 ВОЗМОЖНОСТЬ КОМП -->
        <div class="hidden xl:flex ml-[100px] mt-[110px]">
          <p class="text-[256px] font-normal">3</p>
          <div class="space-y-6">
            <p class="paragraphText24 mt-[50px]">
              изучить наиболее <b>значимые и интересные</b><br> места <b>Уральских гор</b>
            </p>
            <button class="bg-destinations bg-no-repeat bg-contain h-[70px] w-[350px]" @click="destinationsRedirecting">
      </button>
          </div>
        </div>

        <!-- ВОЗМОЖНОСТИ ПОД КОМП -->
    </div>
    

    <!-- 
      
      ВОЗМОЖНОСТИ
    
    -->
    <div class="h-[100px] xl:h-[200px]">

    </div>




  </main>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'HomeView',
  setup() {
    const router = useRouter()

    const createTripRedirecting = () => {
      router.push('/createtrip')
    }

    const findTripRedirecting = () => {
      router.push('/findtrip')
    }

    const destinationsRedirecting = () => {
      router.push('/destinations')
    }

    return {
      createTripRedirecting,
      findTripRedirecting,
      destinationsRedirecting,
    }
  }
}
</script>



<style scoped>
/*

SLIDER

*/
img{
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none
}
.slider-container{
    padding-top: 65px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.slider{
    width: 961px;
    height: 563px;
    overflow: hidden;
}
.slides{
    width: 500%;
    height: 563px;
    display: flex;
}
.slides input{
    display: none;
}
.slide{
    width: 20%;
    transition: 2s;
}
.slide img{
    width: 961px;
    height: 563px;
}
.navigation-manual{
    position: absolute;
    width: 961px;
    margin-top: -40px;
    display: flex;
    justify-content: center;

}
.manual-btn{
    border: 2px solid black;
    padding: 5px;
    border-radius: 10px;
    cursor: pointer;
    transition: 1s;
}
.manual-btn:not(:last-child){
    margin-right: 40px;
}
.manual-btn:hover{
    background: black;
}
#radio1:checked ~ .first{
    margin-left: 0;
}
#radio2:checked ~ .first{
    margin-left: -20%;
}
#radio3:checked ~ .first{
    margin-left: -40%;
}
.navigation-auto{
    position: absolute;
    display: flex;
    width: 961px;
    justify-content: center;
    margin-top: 523px;
}
.navigation-auto div{
    border: 2px solid black;
    padding: 5px;
    border-radius: 10px;
    transition: 1s;
}
.navigation-auto div:not(:last-child){
    margin-right: 40px;
}
#radio1:checked ~ .navigation-auto .auto-btn1{
    background: black;
}
#radio2:checked ~ .navigation-auto .auto-btn2{
    background: black;
}
#radio3:checked ~ .navigation-auto .auto-btn3{
    background: black;
}
/*

SLIDER

*/

</style>
