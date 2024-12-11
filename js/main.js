"use strict"



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

//------------------------------------------------------------------------Обработка формы
document.addEventListener('DOMContentLoaded', function () {
  const forms = document.querySelectorAll('form'); // Получаем все формы на странице

  forms.forEach((form) => {
    const phoneInput = form.querySelector('._number'); // Поле ввода телефона

    // Добавляем маску для номера телефона
    const inputElement = document.getElementById('formNumber');
    const maskOptions = {
      mask: '+{7} (000) 000-00-00', // пример маски для телефона
      lazy: false,   // Фиксированные символы видны сразу
    };
    const mask = IMask(inputElement, maskOptions);
    
    form.addEventListener('submit', formSend);

    async function formSend(e) {
      e.preventDefault();

      let error = formValidate(form);
      let formData = new FormData(form);

      const formImage = form.querySelector('#formImage');
      if (formImage && formImage.files[0]) {
        formData.append('image', formImage.files[0]);
      }

      if (error === 0) {
        form.classList.add('_sending');
        let response = await fetch('sendmail.php', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          let result = await response.json();
          form.style.display = 'none';

          const successMessage = document.createElement('div');
          successMessage.classList.add('success-message');
          successMessage.textContent = 'Форма успешно отправлена!';
          form.parentElement.appendChild(successMessage);

          setTimeout(() => {
            form.style.display = 'block';
            successMessage.style.display = 'none';
          }, 3000);

          const formPreview = form.querySelector('#formPreview');
          if (formPreview) {
            formPreview.innerHTML = '';
          }
          form.reset();
          form.classList.remove('_sending');
        } else {
          alert('Ошибка');
          form.classList.remove('_sending');
        }
      } else {
        alert('Заполните обязательные поля');
      }
    }

    function formValidate(form) {
      let error = 0;
      let formReq = form.querySelectorAll('._req');

      formReq.forEach((input) => {
        formRemoveError(input);

        if (input.classList.contains('_email')) {
          if (!emailTest(input)) { // проверка на корректность email
            formAddError(input);
            error++;
          }
        } else if (input.classList.contains('_number')) {
          if (!phoneTest(input)) { // проверка на корректность телефона
            formAddError(input);
            error++;
          }
        } else if (input.getAttribute('type') === "checkbox" && input.checked === false) {
          formAddError(input);
          error++;
        } else {
          if (input.value === '') {
            formAddError(input);
            error++;
          }
        }
      });
      return error;
    }

    function formAddError(input) {
      input.parentElement.classList.add('_error');
      input.classList.add('_error');
    }

    function formRemoveError(input) {
      input.parentElement.classList.remove('_error');
      input.classList.remove('_error');
    }

    // проверка email
    function emailTest(input) {
      return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(input.value);
    }

    // проверка телефона
    function phoneTest(input) {
      return /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/.test(input.value);
    }

    // Работа с изображением
    const formImage = form.querySelector('#formImage');
    const formPreview = form.querySelector('#formPreview');

    if (formImage) {
      formImage.addEventListener('change', () => {
        uploadFile(formImage.files[0]);
      });

      function uploadFile(file) {
        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
          alert('Только изображения');
          formImage.value = '';
          return;
        }
        if (file.size > 2 * 1024 * 1024) {
          alert('Файл должен быть менее 2 МБ');
          return;
        }
        let reader = new FileReader();
        reader.onload = function (e) {
          if (formPreview) {
            formPreview.innerHTML = `<img src="${e.target.result}" alt="Фото">`;
          }
        };
        reader.onerror = function (e) {
          alert('Ошибка');
        };
        reader.readAsDataURL(file);
      }
    }
  });
});

//------------------------------------------------------------------------Обработка формы

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


//------------------------------------------------------------------------animate
const animItems = document.querySelectorAll('._anim-items');
if (animItems.length > 0) {
  window.addEventListener('scroll', animOnScroll);
  function animOnScroll() {
    for (let index = 0; index < animItems.length; index++) {
        const animItem = animItems[index];
        const animItemHeight = animItem.offsetHeight;
        const animItemOffset = offset(animItem).top;
        const animStart = 5;

        let animItemPoint = window.innerHeight - animItemHeight / animStart;

        if (animItemHeight > window.innerHeight) {
          animItemPoint = window.innerHeight - window.innerHeight / animStart;
        }

        if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {
          animItem.classList.add('_action');
        } else {
          animItem.classList.remove('_action');
        }
    }
  }
  function offset(el) {
    const rect = el.getBoundingClientRect(),
    scrollLeft  = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return {top: rect.top + scrollTop, left: rect.left + screenLeft}
  }
  animOnScroll();
}
//------------------------------------------------------------------------animate