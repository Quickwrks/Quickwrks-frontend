/* =========================================================
           MOBILE MENU
        ========================================================= */

        const menuToggle =
            document.getElementById("menuToggle");

        const mobileMenu =
            document.getElementById("mobileMenu");


        menuToggle.addEventListener(
            "click",
            function () {

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
                    isOpen
                        ? "Close menu"
                        : "Open menu"
                );

            }
        );


        /* CLOSE MOBILE MENU */

        mobileMenu
            .querySelectorAll("a")
            .forEach(
                function (link) {

                    link.addEventListener(
                        "click",
                        function () {

                            mobileMenu.classList.remove(
                                "open"
                            );

                            document.body.classList.remove(
                                "menu-open"
                            );

                            menuToggle.textContent = "☰";

                            menuToggle.setAttribute(
                                "aria-expanded",
                                "false"
                            );

                            menuToggle.setAttribute(
                                "aria-label",
                                "Open menu"
                            );

                        }
                    );

                }
            );


        /* =========================================================
           IMAGE → VIDEO
        ========================================================= */

        const heroVisual =
            document.getElementById("heroVisual");

        const heroMedia =
            document.getElementById("heroMedia");

        const knowMoreBtn =
            document.getElementById("knowMoreBtn");

        const libraryVideo =
            document.getElementById("libraryVideo");


        knowMoreBtn.addEventListener(
            "click",
            function () {


                /*
                  Change image into video.
                */

                heroMedia.classList.add(
                    "video-active"
                );


                /*
                  Hide the floating card while
                  the video is playing.
                */

                heroVisual.classList.add(
                    "video-playing"
                );


                /*
                  Always start from the beginning.
                */

                libraryVideo.currentTime = 0;


                /*
                  Automatically play the video.
                */

                const playPromise =
                    libraryVideo.play();


                /*
                  Prevent an unhandled error if
                  the browser blocks playback.
                */

                if (
                    playPromise !== undefined
                ) {

                    playPromise.catch(
                        function (error) {

                            console.warn(
                                "Video could not start automatically:",
                                error
                            );

                        }
                    );

                }

            }
        );


        /* =========================================================
           VIDEO FINISHED
        ========================================================= */

        libraryVideo.addEventListener(
            "ended",
            function () {


                /*
                  Stop playback.
                */

                libraryVideo.pause();


                /*
                  Reset video position.
                */

                libraryVideo.currentTime = 0;


                /*
                  Return to original image.
                */

                heroMedia.classList.remove(
                    "video-active"
                );


                /*
                  Show floating card again.
                */

                heroVisual.classList.remove(
                    "video-playing"
                );

            }
        );


        /* =========================================================
           PAGE VISIBILITY
        ========================================================= */

        document.addEventListener(
            "visibilitychange",
            function () {

                if (
                    document.hidden &&
                    !libraryVideo.paused
                ) {

                    libraryVideo.pause();

                }

            }
        );