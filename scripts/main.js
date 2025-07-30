 // <!-- For Typewritter AI -->
  const messages = [
    "Welcome to my portfolio!",
    "I'm a Developer!",
    "Simple Developer",
    "Diego Burgos!",
  ];

  const typeEl = document.getElementById("type");
  let messageIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const current = messages[messageIndex];
    let displayText;

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    displayText = current.substring(0, charIndex);

    typeEl.innerHTML = displayText + `<span class="underscore">_</span>`;

    if (!isDeleting && charIndex === current.length) {
      setTimeout(() => {
        isDeleting = true;
        typeLoop();
      }, 1500);
      return;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      messageIndex = (messageIndex + 1) % messages.length;
    }

    const delay = isDeleting ? 40 : 80;
    setTimeout(typeLoop, delay);
  }

  typeLoop();

  //For Scrolling Point Paused AI
  const informations = document.querySelector(".informations");
  const infolists = document.querySelectorAll(".infolist");

  infolists.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      informations.style.animationPlayState = "paused";
    });
    item.addEventListener("mouseleave", () => {
      informations.style.animationPlayState = "running";
    });
  });

  //For Navigation AI
  let lastScrollY = window.scrollY;
  const navbar = document.querySelector(".navigation");
  const nav = document.querySelector(".nav");

  window.addEventListener("scroll", () => {
    if (window.scrollY > lastScrollY + 10) {
      nav.classList.add("hidden");
    } else if (window.scrollY < lastScrollY - 5) {
      nav.classList.remove("hidden");
    }
    lastScrollY = window.scrollY;
  });

  window.addEventListener("scroll", () => {
    if (window.scrollY > lastScrollY + 10) {
      navbar.classList.add("hidden");
    } else if (window.scrollY < lastScrollY - 5) {
      navbar.classList.remove("hidden");
    }
    lastScrollY = window.scrollY;
  });

  //For Smooth Scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });