/* =========================================================
       MOBILE MENU
    ========================================================= */

    const menuToggle =
      document.getElementById("menuToggle");

    const mobileMenu =
      document.getElementById("mobileMenu");


    menuToggle.addEventListener("click", function () {

      const isOpen =
        mobileMenu.classList.toggle("open");


      document.body.classList.toggle(
        "menu-open",
        isOpen
      );


      menuToggle.textContent =
        isOpen ? "✕" : "☰";


      menuToggle.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
      );


      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close menu" : "Open menu"
      );

    });


    /* Close mobile menu when a link is clicked */

    mobileMenu
      .querySelectorAll("a")
      .forEach(function (link) {

        link.addEventListener("click", function () {

          mobileMenu.classList.remove("open");

          document.body.classList.remove("menu-open");

          menuToggle.textContent = "☰";

          menuToggle.setAttribute(
            "aria-expanded",
            "false"
          );

          menuToggle.setAttribute(
            "aria-label",
            "Open menu"
          );

        });

      });


    /* =========================================================
       HERO IMAGE → VIDEO
    ========================================================= */

    const heroVisual =
      document.getElementById("heroVisual");

    const heroMedia =
      document.getElementById("heroMedia");

    const knowMoreBtn =
      document.getElementById("knowMoreBtn");

    const restaurantVideo =
      document.getElementById("restaurantVideo");


    /* =========================================================
       KNOW MORE BUTTON
    ========================================================= */

    knowMoreBtn.addEventListener("click", function () {

      /*
        Switch from image to video.
      */

      heroMedia.classList.add("video-active");


      /*
        Hide the floating QuickWrks card
        while the video is visible.
      */

      heroVisual.classList.add("video-playing");


      /*
        Always start the video from
        the beginning.
      */

      restaurantVideo.currentTime = 0;


      /*
        Start playback automatically.

        Because this play() call happens
        directly after the user's button
        click, modern browsers normally
        permit autoplay.
      */

      const playPromise =
        restaurantVideo.play();


      /*
        Prevent an unhandled Promise error
        if the browser refuses playback.
      */

      if (playPromise !== undefined) {

        playPromise.catch(function (error) {

          console.warn(
            "Video could not start automatically:",
            error
          );

        });

      }

    });


    /* =========================================================
       VIDEO ENDED
    ========================================================= */

    restaurantVideo.addEventListener(
      "ended",
      function () {

        /*
          Stop the video.
        */

        restaurantVideo.pause();


        /*
          Reset it to the beginning.
          This means the next time the user
          clicks Know More, it starts from
          the beginning again.
        */

        restaurantVideo.currentTime = 0;


        /*
          Switch back to the original image.
        */

        heroMedia.classList.remove(
          "video-active"
        );


        /*
          Bring the floating card back.
        */

        heroVisual.classList.remove(
          "video-playing"
        );

      }
    );


    /* =========================================================
       EXTRA SAFETY
       If the user leaves the page while
       the video is playing, pause it.
    ========================================================= */

    document.addEventListener(
      "visibilitychange",
      function () {

        if (
          document.hidden &&
          !restaurantVideo.paused
        ) {

          restaurantVideo.pause();

        }

      }
    );