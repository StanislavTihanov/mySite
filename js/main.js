"use strict"

jQuery(document).ready(function () {
    
  $(".phone").mask("+7 (999) 999-99-99"); 
  
  jQuery('.send-form').click( function() {
    var form = jQuery(this).closest('form');
    
    if ( form.valid() ) {
      form.css('opacity','.5');
      var actUrl = form.attr('action');

      jQuery.ajax({
        url: actUrl,
        type: 'post',
        dataType: 'html',
        data: form.serialize(),
        success: function(data) {
          form.html(data);
          form.css('opacity','1');
                  form.find('.status').html('форма отправлена успешно');
                  //$('#myModal').modal('show') // для бутстрапа
        },
        error:	 function() {
            form.find('.status').html('серверная ошибка');
        }
      });
    }
  });


});



//------------------------------------------------------------------------Меню-Бургер
const burgerMenu = document.querySelector('.header__burger');
const menuBody= document.querySelector('.menu');

if(burgerMenu) {
    burgerMenu.addEventListener("click", function (e) {
      burgerMenu.classList.toggle('_active');
      menuBody.classList.toggle('_active');
    });
}
//------------------------------------------------------------------------закрытие меню при клике вне его
document.addEventListener ('click', (e) => {
  if (!burgerMenu.contains(e.target)) {
    menuBody.classList.remove('_active');
    burgerMenu.classList.remove('_active');
  }
})
//------------------------------------------------------------------------закрытие меню при клике вне его


//------------------------------------------------------------------------Прокрутка при клике
let buttons = document.querySelectorAll('.menu__link');

buttons.forEach((elem)=>{
  elem.addEventListener('click',()=>{
    menuBody.classList.remove('_active');
    burgerMenu.classList.remove('_active');
  })
})

const menuLinks = document.querySelectorAll('.menu__link[data-goto]');

if (menuLinks.length > 0) {
  menuLinks.forEach(menuLink => {
    menuLink.addEventListener("click", onMenuLinkClick);
  });
  function onMenuLinkClick(e) {
    const menuLink = e.target;
    if(menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
        const gotoBlock = document.querySelector(menuLink.dataset.goto);
        const gotoBlockValue = gotoBlock.getBoundingClientRect().top + scrollY - document.querySelector('header').offsetHeight;
      
        window.scrollTo({
        top:gotoBlockValue,
        behavior: "smooth"
      });
      e.preventDefault();
    }
  }
}
//------------------------------------------------------------------------Прокрутка при клике



//------------------------------------------------------------------------Слайдер
const slider = new Swiper('.swiper', {
  direction: 'horizontal',
  loop: true,
  spaceBetween: 20,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  speed: 2000,
});

new Swiper('.feedback__slider', {
  direction: 'horizontal',
  loop: true,
  spaceBetween: 20,
  slidesPerView: 3,
  autoHeight: true,
  a11y: {
    prevSlideMessage: 'Previous slide',
    nextSlideMessage: 'Next slide',
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  speed: 2000,
  breakpoints: {
    // when window width is >= 320px
    320: {
      slidesPerView: 1,
      spaceBetween: 20
    },
    // when window width is >= 480px
    480: {
      slidesPerView: 2,
      spaceBetween: 30
    },
    770: {
      slidesPerView: 3,
      spaceBetween: 30
    },
  }
});
//------------------------------------------------------------------------Слайдер


//------------------------------------------------------------------------popup
const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll(".lock-padding");


let unlock = true;

const timeout = 800;

if (popupLinks.length > 0) {
  for (let index = 0; index < popupLinks.length; index++) {
    const popupLink = popupLinks[index];
    popupLink.addEventListener("click", function (e) {
      const popupName = popupLink.getAttribute('href').replace('#', '');
      const currentPopup = document.getElementById(popupName);
      popupOpen(currentPopup);
      e.preventDefault();
    });
  }
}

const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
  for (let index = 0; index < popupCloseIcon.length; index++) {
    const el = popupCloseIcon[index];
    el.addEventListener('click', function (e) {
      popupClose(el.closest('.popup'));
      e.preventDefault();
    })
  }
}

function popupOpen(currentPopup) {
  if (currentPopup && unlock) {
    const popupActive = document.querySelector('.popup.open');
    if (popupActive) {
      popupClose(popupActive, false);
    } else {
      bodyLock();
    }
    currentPopup.classList.add('open');
    currentPopup.addEventListener("click", function (e) {
      if (!e.target.closest('.popup__content')) {
        popupClose(e.target.closest('.popup'));
      }
    });
  }
}

function popupClose(popupActive, doUnlock = true) {
  if (unlock) {
    popupActive.classList.remove('open');
    if (doUnlock) {
      bodyUnlock();
    }
  }
}

function bodyLock() {
  const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
  if (lockPadding.length > 0) {
    for (let index = 0; index < lockPadding.length; index++) {
      const el = lockPadding[index];
      el.style.paddingRight = lockPaddingValue;
    }
  }
  body.style.paddingRight = lockPaddingValue;
  body.classList.add('lock');

  unlock = false;
  setTimeout(function () {
    unlock = true;
  }, timeout);
}

function bodyUnlock () {
  setTimeout(function () {
    if(lockPadding.length > 0) {
      for (let index = 0; index < lockPadding.length; index++) {
        const el = lockPadding[index];
        el.style.paddingRight = '0px';
      }
  }
    body.style.paddingRight = '0px';
    body.classList.remove('lock');
  }, timeout);
  unlock = false;
  setTimeout(function () {
    unlock = true;
  }, timeout);
}

document.addEventListener('keydown', function (e) {
  if (e.which === 27) {
    const popupActive = document.querySelector('.popup.open');
    popupClose(popupActive);
  }
});

//------------------------------------------------------------------------popup

