/* =====================================================
           MOBILE MENU
           ===================================================== */

        const menuToggle =
            document.getElementById("menuToggle");

        const mobileMenu =
            document.getElementById("mobileMenu");


        menuToggle.addEventListener("click", () => {

            const isOpen =
                mobileMenu.classList.toggle("open");

            menuToggle.textContent =
                isOpen ? "✕" : "☰";

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

        });


        mobileMenu
            .querySelectorAll("a")
            .forEach((link) => {

                link.addEventListener("click", () => {

                    mobileMenu.classList.remove("open");

                    menuToggle.textContent = "☰";

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                });

            });


        /* =====================================================
           KNOW MORE → VIDEO
           VIDEO END → IMAGE
           ===================================================== */

        const knowMoreBtn =
            document.getElementById("knowMoreBtn");

        const heroImage =
            document.getElementById("heroImage");

        const heroVideo =
            document.getElementById("heroVideo");


        knowMoreBtn.addEventListener("click", () => {

            /*
              Hide the original image.
            */

            heroImage.style.display = "none";


            /*
              Show the video.
            */

            heroVideo.style.display = "block";


            /*
              Reset the video to the beginning.
            */

            heroVideo.currentTime = 0;


            /*
              Play automatically.
            */

            const playPromise =
                heroVideo.play();


            /*
              Some browsers may block autoplay.
              The video still has visible controls,
              so the user can press Play manually.
            */

            if (playPromise !== undefined) {

                playPromise.catch(() => {

                    console.log(
                        "Autoplay was blocked by the browser."
                    );

                });

            }


            /*
              Hide Know More button while video
              is playing.
            */

            knowMoreBtn.style.display = "none";

        });


        /* =====================================================
           WHEN VIDEO FINISHES
           ===================================================== */

        heroVideo.addEventListener("ended", () => {

            /*
              Stop and reset video.
            */

            heroVideo.pause();

            heroVideo.currentTime = 0;


            /*
              Hide video.
            */

            heroVideo.style.display = "none";


            /*
              Bring original image back.
            */

            heroImage.style.display = "block";


            /*
              Bring Know More button back.
            */

            knowMoreBtn.style.display = "block";

        });


        /*
          If the user reloads the video or otherwise
          changes playback state, this keeps the button
          hidden while the video is being used.
        */

        heroVideo.addEventListener("play", () => {

            knowMoreBtn.style.display = "none";

        });