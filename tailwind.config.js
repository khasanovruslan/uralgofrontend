module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Добавьте свои цвета здесь
      },
      fontFamily: {
        Montserrat: ["Montserrat", "sans-serif"],
        Roboto: ["Roboto", "sans-serif"],
        HelveticaNew: ["Helvetica Neue", "sans-serif"],
        ProximaNova: ["Proxima Nova", "sans-serif"],
      },
      text: {
        // Добавьте свои стили текста здесь
      },
      spacing: {
        '10': '40px',
      },
      borderRadius: {
        'full': '9999px',
      },
      backgroundImage: {
        'headerImage': "url('/images/headerMainPage.svg')",
        'loginBtn': "url('/images/loginBtn4.svg')",
        'createTrip': "url('/images/createTripButton.svg')",
        'findTrip': "url('/images/findTripButton.svg')",
        'createTripRedirecting': "url('/images/createTripRedirecting.svg')",
        'findTripRedirecting': "url('/images/findTripRedirecting.svg')",
        'destinations': "url('/images/napravleniya.svg')",
        'calendarMonth': "url('/images/calendarMonth.svg')",
        'aboutUsHeader': "url('/images/aboutUsHeader.svg')",
        'burgerIcon': "url('/images/burgerIcon.svg')",
        'userIcon': "url('/images/userIcon.svg')",
        'goToDestinationsMobile': "url('/images/goToDestinations.svg')",
        'findTripButtonMobile': "url('/images/findTripButtonMobile.svg')",
        'createTripButtonMobile': "url('/images/createTripButtonMobile.svg')",
        'destinationsButtonMobile': "url('/images/destinationsButtonMobile.svg')",
        'footer': "url('/images/footer.svg')",
        'calendarMonth': "url('/images/calendarMonth.svg')",
        'findTripPageFindBtn': "url('/findTripPageFindBtn.svg')",
        'createTripPageCreateTripBtn': "url('/createTripPageCreateTripBtn.svg')",
        'registerBG': "url('/регистрация.svg')",
        'LoginPageLoginButton': "url('/images/LoginPageLoginButton.svg')",
        'RegisterPageRegisterButton': "url('/images/RegPageRegButton.svg')",

      },
      letterSpacing: {
        '2pct': '2%',
      },
      fontSize: {
        '256px': '256px',
      },
      keyframes: {
        'background-pan': {
          '0%': { 'background-position': '0% center' },
          '100%': { 'background-position': '-200% center' },
        },
      },
      animation: {
        'background-pan': 'background-pan 3s linear infinite',
      },
      textStrokeWidth: {
        '1': '1px',
      },
      textStrokeColor: {
        black: '#000',
      },
    },
    screens: {
      "xl": '1280px',
    },
  },

  plugins: [
    function ({ addUtilities, addComponents, e, theme }) {
      addUtilities({
        '.magic-effect': {
          'animation': 'background-pan 5s linear infinite',
          //'background': 'linear-gradient(to right, lightgreen, green, rgb(29, 130, 29), lightgreen)',
          'background': 'linear-gradient(to right, #2CCBC1, #95F368, #53F2C2, #2CCBC1)',
          
          'background-size': '200%',
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'white-space': 'nowrap',
        },
        '.select': {
          '-webkit-appearance': 'none', /* Убираем стандартный стиль браузера */
          '-moz-appearance': 'none',
          'appearance': 'none',
        },
        '.paragraphText': {
          'font': "'Montserrat', 'sans-serif'",
          'font-weight': '400',
          'color': 'black',
          'font-size': '20px',
        },
        '.registerText': {
          'font': "'Montserrat', 'sans-serif'",
          'font-weight': '600',
          'color': 'white',
          'font-size': '14px',
        },
        '.paragraphText24': {
          'font': "'Montserrat', 'sans-serif'",
          'font-weight': '400',
          'color': 'black',
          'font-size': '24px',
        },
        '.paragraphTextWhite': {
          'font': "'Montserrat', 'sans-serif'",
          'font-weight': '400',
          'color': 'white',
          'font-size': '20px',
        },
        '.paragraphText24White': {
          'font': "'Montserrat', 'sans-serif'",
          'font-weight': '400',
          'color': 'white',
          'font-size': '24px',
        },
        '.paragraphTextPhone': {
          'font': "'Montserrat', 'sans-serif'",
          'font-weight': '400',
          'color': 'black',
          'font-size': '14px',
        },
        '.paragraphTextPhone14White': {
          'font': "'Montserrat', 'sans-serif'",
          'font-weight': '400',
          'color': 'white',
          'font-size': '14px',
        },
        '.paragraphTextPhone14': {
          'font': "'Montserrat', 'sans-serif'",
          'font-weight': '400',
          'color': 'black',
          'font-size': '14px',
          'tracking': 'wide',
        },
        '.non-draggable': {
          '-webkit-user-drag': 'none',
          '-khtml-user-drag': 'none',
          '-moz-user-drag': 'none',
          '-o-user-drag': 'none',
          'user-drag': 'none'
        },
        '.text-stroke-1': {
          '-webkit-text-stroke-width': '1px',
          'text-stroke-width': '1px',
        },
        '.text-stroke-black': {
          '-webkit-text-stroke-color': 'black',
          'text-stroke-color': 'black',
        },
        '.DestinationsBlockType1': {
          'font': 'Montserrat',
          'background-color':'#f1f1f1',
          'width': '1040px',
          'height': '620px',
          'border-radius': '35px',
          'display':'flex',
          'justify-content':'space-between',
          'padding-left':'34px',
          'padding-right':'34px',
          'align-items':'center',
        },
        
        '.DestinationsBlockType1SmallText':{
          'font-weight': '700',
          'font-size': '20px',
          'margin-top': '10px',
        },
        '.DestinationsBlockType2': {
          'font': 'Montserrat',
          'background-color': '#f1f1f1',
          'width': '1040px',
          'height': '400px',
          'border-radius': '35px',
          'display':'flex',
          'justify-content':'space-around',
          'align-items':'center',
        },
        '.bloki': {
          'width': '310px',
          'height': '386px',
          'border-radius': '17px',
          'text-align': 'left',
          'font-size': '16px',
          'font-family': 'Montserrat',
          'color': 'white',
          'padding-left': '15px',
          'padding-right': '15px',
          'padding-bottom': '10px',
          'font-weight': 'normal',
          'display': 'flex',
          'flex-direction': 'column',
          'justify-content': 'flex-end',
          'transition': 'transform 1s',
          'background-position': 'center',
          'background-repeat': 'no-repeat',
          'background-size': 'cover',
        },
        
        '.bloki:hover': {
          'transform': 'scale(1.025)',
        },
        '.bloki2': {
          'width': '483px',
          'height': '400px',
          'border-radius': '17px',
          'transition': 'transform 1s',
          'background-position': 'center',
          'background-repeat': 'no-repeat',
          'background-size': 'cover',
        },
        
        '.bloki2:hover': {
          'transform': 'scale(1.025)',
        },
        '.bloki3': {
          'width': '449px',
          'height': '294px',
          'border-radius': '35px',
          'transition': 'transform 1s',
          'background-position': 'center',
          'background-repeat': 'no-repeat',
          'background-size': 'cover'
          
        },
        '.bloki3:hover': {
          'transform': 'scale(1.025)',
        },
        '.DestinationsBlockType3': {
          'font': 'Montserrat',
          'background-color': '#f1f1f1',
          'width': '470px',
          'height': '398px',
          'border-radius': '35px',
          'display': 'flex',
          'flex-direction': 'column',
          'align-items': 'center'
        }

        

      }, ['responsive', 'hover']);

      addComponents({
        '@keyframes background-pan': {
          '0%': { 'background-position': '0% center' },
          '100%': { 'background-position': '-200% center' },
        }
      });
    },
  ],
};
