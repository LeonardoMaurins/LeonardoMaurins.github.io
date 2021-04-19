"use strict"

var placeholder = $('#selection').attr('placeholder');
var handBoolean = false;

//  Used for nav bar
// Script for showing different divs based on selection
// Set here to hide it from the start
$(document).ready(function() {
    $('.group').hide();
    $('#category0').show();
    $('.defaultNavItem').addClass('current_nav_item');
    $('.playInterface').hide();
    placeholder = $('#selection').attr('placeholder');

    $('.nav-item').click(function() {
        $('.group').hide();
        $($('a', this).attr('href')).show();
        $('#translate').show();
        $('.rightPlay').show();
        $('.playInterface').show();
        $('#selection').attr('placeholder', placeholder);
        handBoolean = false;
        switch ($('a', this).attr('href')) {
            case "#category0":
                $('.playInterface').hide();
                console.log($('a', this).attr('href'))
                break;
            case "#category4":
                $('.rightPlay').hide();
                $('#selection').attr('placeholder', '');
                handBoolean = true;
                break;
        }
    })
});

// Changes colour of active navbar item to red
$('#navbarNav a').click(function(e) {
    $('#navbarNav a').removeClass('current_nav_item');
    $(this).addClass('current_nav_item');
});

// Regex to only allow a-z A-Z and white spaces
$(document).ready(function() {
    $('input').bind('keypress', function(evt) {
        var key = String.fromCharCode(evt.which || evt.charCode);
        if (/^[a-z\s]$/i.test(key) === false) evt.preventDefault();
    })
});

// register the application module
b4w.register("B00107064_Avatar_Project_main", function(exports, require) {

    // import modules used by the app
    var m_app = require("app");
    var m_cfg = require("config");
    var m_data = require("data");
    var m_preloader = require("preloader");
    var m_ver = require("version");

    var m_anim = require("animation");
    var m_cont = require("container");
    var m_mouse = require("mouse");
    var m_scenes = require("scenes");

    // detect application mode
    var DEBUG = (m_ver.type() == "DEBUG");

    // automatically detect assets path
    var APP_ASSETS_PATH = m_cfg.get_assets_path("B00107064_Avatar_Project");

    var FIRST_ANIM_SLOT = 0;
    var SECOND_ANIM_SLOT = 1;
    var THIRD_ANIM_SLOT = 2;
    var FOURTH_ANIM_SLOT = 3;
    var FIFTH_ANIM_SLOT = 4;
    var SIXTH_ANIM_SLOT = 5;
    var SEVENTH_ANIM_SLOT = 6;
    var EIGHT_ANIM_SLOT = 7;

    var mirror = false;
    var availablePhrase = false;

    /**
     * export the method to initialize the app (called at the bottom of this file)
     */
    exports.init = function() {
        m_app.init({
            assets_dds_available: false,
            canvas_container_id: "main_canvas_container",
            callback: init_cb,
            // show_fps: DEBUG,
            console_verbose: DEBUG,
            autoresize: true
        });
    }

    /**
     * callback executed when the app is initialized 
     */
    function init_cb(canvas_elem, success) {

        if (!success) {
            console.log("b4w init failure");
            return;
        }

        m_preloader.create_preloader();

        // ignore right-click on the canvas element
        canvas_elem.oncontextmenu = function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };

        load();
    }

    /**
     * load the scene data
     */
    function load() {
        m_data.load(APP_ASSETS_PATH + "B00107064_Avatar.json", load_cb, preloader_cb);
    }

    /**
     * update the app's preloader
     */
    function preloader_cb(percentage) {
        m_preloader.update_preloader(percentage);
    }

    /**
     * callback executed when the scene data is loaded
     */
    function load_cb(data_id, success) {

        if (!success) {
            console.log("b4w load failure");
            return;
        }

        // Enables you to navigate camera
        m_app.enable_camera_controls();

        // Start of code

        document.querySelector("#button_Right_Hand").style.background = 'rgb(217, 83, 79)';

        // Event Listener for alphabet buttons
        var alphabetLetters = document.getElementById('letters');

        alphabetLetters.addEventListener('click', function(event) {
            var isButton = event.target.nodeName === 'BUTTON';
            if (!isButton) {
                return;
            }
            // Sets the input field to the selected button
            document.getElementById("selection").value = "Letter " + (event.target.id).toUpperCase();
        });

        // Event Listener for input buttons
        var inputLetters = document.getElementById('letters2');

        inputLetters.addEventListener('click', function(event) {
            var isButton = event.target.nodeName === 'BUTTON';
            if (!isButton || document.getElementById("input").value.length >= 30) {
                return;
            }
            // Sets the input field to the selected button
            document.getElementById("input").value += event.target.id;
        });

        // Event listeners for buttons

        var buttons = [
            document.getElementById("button_Father"),
            document.getElementById("button_Mother"),
            document.getElementById("button_Hello"),
            document.getElementById("button_Please"),
            document.getElementById("button_Sorry"),
            document.getElementById("button_Thanks"),
            document.getElementById("button_Reset"),
            document.getElementById("button_Right_Hand"),
            document.getElementById("button_Left_Hand")
        ]

        buttons.forEach(function(e) { e.addEventListener("mousedown", button_click, false); });

        var button_Translate = document.getElementById("button_Translate");
        button_Translate.addEventListener("mousedown", translate, false);

        var button_Input = document.getElementById("button_Input");
        button_Input.addEventListener("mousedown", input, false);

        var button_Play = document.getElementById("button_Play");
        button_Play.addEventListener("mousedown", play, false);
    }

    function button_click(e) {
        switch (this.id) {
            case 'button_Father':
                document.getElementById("selection").value = "Father";
                break;
            case 'button_Mother':
                document.getElementById("selection").value = "Mother";
                break;
            case 'button_Hello':
                document.getElementById("selection").value = "Hello";
                break;
            case 'button_Please':
                document.getElementById("selection").value = "Please";
                break;
            case 'button_Sorry':
                document.getElementById("selection").value = "Sorry";
                break;
            case 'button_Thanks':
                document.getElementById("selection").value = "Thanks";
                break;
            case 'button_Right_Hand':
                document.querySelector("#button_Right_Hand").style.background = '#d9534f';
                document.querySelector("#button_Left_Hand").style.background = '#292b2c';
                mirror = false;
                reset();
                if (handBoolean)
                    input();
                break;
            case 'button_Left_Hand':
                document.querySelector("#button_Left_Hand").style.background = '#d9534f';
                document.querySelector("#button_Right_Hand").style.background = '#292b2c';
                mirror = true;
                reset();
                if (handBoolean)
                    input();
                break;
            case 'button_Reset':
                document.getElementById("input").value = "";
                document.getElementById("selection").value = "";
                document.getElementById("play").value = "";
                reset();
                break;
            default:
                return false;
        }
    }

    function translate() {

        var mirrorValue = "_Mirror";
        var validInput = true;

        // Declaring avatar model as a varaible
        var avatar = m_scenes.get_object_by_name("Avatar_model_2");

        m_anim.apply(avatar, "Idle", FIRST_ANIM_SLOT);

        var selectionTextField = document.getElementById("selection").value;
        var letter = selectionTextField.split(' ').join('_');

        var phraseArray = ["letter", "father", "mother", "hello", "please", "sorry", "thanks"]
        var letterArray = ['a', 'b', 'c', 'd', 'e', 'h', 'i']

        // Testing different ways for if else statement in a single line
        if (phraseArray.includes(selectionTextField.toLowerCase())) {
            (mirror) ? m_anim.apply(avatar, selectionTextField + mirrorValue, SECOND_ANIM_SLOT): m_anim.apply(avatar, selectionTextField, SECOND_ANIM_SLOT);
        } else if (selectionTextField.includes("Letter") && letterArray.indexOf(selectionTextField[7].toLowerCase()) > -1) {
            if (mirror) {
                m_anim.apply(avatar, letter + mirrorValue, SECOND_ANIM_SLOT);
            } else {
                m_anim.apply(avatar, letter, SECOND_ANIM_SLOT);
            }
        } else {
            validInput = false;
        }

        // Setting the behavior for the animations in their slots
        m_anim.set_behavior(avatar, m_anim.AB_LOOP, FIRST_ANIM_SLOT);
        m_anim.set_behavior(avatar, m_anim.AB_FINISH_STOP, SECOND_ANIM_SLOT);

        if (validInput) {
            m_anim.play(avatar, function() {
                m_anim.play(avatar, function() {
                    m_anim.set_frame(avatar, 0, SECOND_ANIM_SLOT);
                    m_anim.set_frame(avatar, 0, FIRST_ANIM_SLOT);
                }, FIRST_ANIM_SLOT);
            }, SECOND_ANIM_SLOT);
        } else {
            m_anim.play(avatar, function() {
                m_anim.set_frame(avatar, 0, FIRST_ANIM_SLOT);
            }, FIRST_ANIM_SLOT);
        }

    }

    var tokenArray = [];
    var phraseArray = [];

    function animationName(token) {
        var animationName = "";
        phraseArray.forEach(function(phraseObject) {
            if (phraseObject.phrase == token) {
                animationName = phraseObject.animation
            }
        })
        return animationName;
    }

    function input() {

        // Declaring avatar model as a varaible
        var avatar = m_scenes.get_object_by_name("Avatar_model_2");
        m_anim.apply(avatar, "Idle", FIRST_ANIM_SLOT);
        // Setting the behavior for the animations in their slots
        m_anim.set_behavior(avatar, m_anim.AB_LOOP, FIRST_ANIM_SLOT);
        m_anim.play(avatar, function() {
            m_anim.set_frame(avatar, 0, FIRST_ANIM_SLOT);
        }, FIRST_ANIM_SLOT);

        // Declaring variables
        availablePhrase = false;
        tokenArray = [];
        var inputTextField = document.getElementById("input").value;

        var inputArray = inputTextField.split(" ");

        // Object contains arrays
        phraseArray = [
            { phrase: "father", animation: "Father", synonyms: ["father", "dad", "papa"] },
            { phrase: "mother", animation: "Mother", synonyms: ["mother", "mom", "mama"] },
            { phrase: "hello", animation: "Hello", synonyms: ["hello", "hi", "hey", "greetings"] },
            { phrase: "please", animation: "Please", synonyms: ["please"] },
            { phrase: "sorry", animation: "Sorry", synonyms: ["sorry", "apologies"] },
            { phrase: "thanks", animation: "Thanks", synonyms: ["thanks"] },
            { phrase: "a", animation: "Letter_A", synonyms: ["a"] },
            { phrase: "b", animation: "Letter_B", synonyms: ["b"] },
            { phrase: "c", animation: "Letter_C", synonyms: ["c"] },
            { phrase: "d", animation: "Letter_D", synonyms: ["d"] },
            { phrase: "e", animation: "Letter_E", synonyms: ["e"] },
            { phrase: "h", animation: "Letter_H", synonyms: ["h"] },
            { phrase: "i", animation: "Letter_I", synonyms: ["i"] }
        ]

        var phraseAnimationID

        inputArray.forEach(function(currentSymbol) {
            phraseArray.forEach(function(synonymArray) {
                if (synonymArray.synonyms.includes(currentSymbol.toLowerCase())) {
                    phraseAnimationID = synonymArray.phrase
                    if (!tokenArray.includes(phraseAnimationID)) {
                        tokenArray.push(phraseAnimationID)
                    }
                }
            })
        });

        var counter = 0;
        var existsArray = [];

        tokenArray.forEach(function(token) {
            // If the character already exists in the array, then it has been applied as an animation to a slot already and wont be again
            if (!existsArray.includes(token)) {
                if (mirror) {
                    m_anim.apply(avatar, animationName(token) + "_Mirror", counter + 1);
                } else {
                    m_anim.apply(avatar, animationName(token), counter + 1);
                }
                existsArray.push(token);
                m_anim.set_behavior(avatar, m_anim.AB_FINISH_STOP, counter + 1);
                counter++;
            }
        });
        document.getElementById("play").value = existsArray.join(' ').toString();
    }

    function play() {

        var avatar = m_scenes.get_object_by_name("Avatar_model_2");
        m_anim.apply(avatar, "Idle", FIRST_ANIM_SLOT);
        m_anim.set_behavior(avatar, m_anim.AB_LOOP, FIRST_ANIM_SLOT);

        var playTextField = document.getElementById("play").value;

        // Length of token array determines the switch case used depending on how many frames are needed to be set
        var tokenArrayLength = tokenArray.length;

        // Checks if the input field contains a valid word and plays the animation, otherwise does characters only
        if (availablePhrase) {
            document.getElementById("selection").value = playTextField[0].toUpperCase() + playTextField.slice(1).toLowerCase();
            m_anim.play(avatar, function() {
                m_anim.play(avatar, function() {
                    m_anim.set_frame(avatar, 0, 1);
                    m_anim.set_frame(avatar, 0, 0);
                }, 0);
            }, 1);
        } else {
            switch (tokenArrayLength) {
                case 1:
                    changeSelection(tokenArrayLength - 1);
                    m_anim.play(avatar, function() {
                        m_anim.play(avatar, function() {
                            m_anim.set_frame(avatar, 0, SECOND_ANIM_SLOT);
                            m_anim.set_frame(avatar, 0, FIRST_ANIM_SLOT);
                        }, FIRST_ANIM_SLOT);
                    }, SECOND_ANIM_SLOT);
                    break;
                case 2:
                    changeSelection(tokenArrayLength - 2);
                    m_anim.play(avatar, function() {
                        changeSelection(tokenArrayLength - 1);
                        m_anim.play(avatar, function() {
                            m_anim.play(avatar, function() {
                                m_anim.set_frame(avatar, 0, SECOND_ANIM_SLOT);
                                m_anim.set_frame(avatar, 0, THIRD_ANIM_SLOT);
                                m_anim.set_frame(avatar, 0, FIRST_ANIM_SLOT);
                            }, FIRST_ANIM_SLOT);
                        }, THIRD_ANIM_SLOT);
                    }, SECOND_ANIM_SLOT);
                    break;
                case 3:
                    changeSelection(tokenArrayLength - 3);
                    m_anim.play(avatar, function() {
                        changeSelection(tokenArrayLength - 2);
                        m_anim.play(avatar, function() {
                            changeSelection(tokenArrayLength - 1);
                            m_anim.play(avatar, function() {
                                m_anim.play(avatar, function() {
                                    m_anim.set_frame(avatar, 0, SECOND_ANIM_SLOT);
                                    m_anim.set_frame(avatar, 0, THIRD_ANIM_SLOT);
                                    m_anim.set_frame(avatar, 0, FOURTH_ANIM_SLOT);
                                    m_anim.set_frame(avatar, 0, FIRST_ANIM_SLOT);
                                }, FIRST_ANIM_SLOT);
                            }, FOURTH_ANIM_SLOT);
                        }, THIRD_ANIM_SLOT);
                    }, SECOND_ANIM_SLOT);
                    break;
                case 4:
                    changeSelection(tokenArrayLength - 4);
                    m_anim.play(avatar, function() {
                        changeSelection(tokenArrayLength - 3);
                        m_anim.play(avatar, function() {
                            changeSelection(tokenArrayLength - 2);
                            m_anim.play(avatar, function() {
                                changeSelection(tokenArrayLength - 1);
                                m_anim.play(avatar, function() {
                                    m_anim.play(avatar, function() {
                                        m_anim.set_frame(avatar, 0, SECOND_ANIM_SLOT);
                                        m_anim.set_frame(avatar, 0, THIRD_ANIM_SLOT);
                                        m_anim.set_frame(avatar, 0, FOURTH_ANIM_SLOT);
                                        m_anim.set_frame(avatar, 0, FIFTH_ANIM_SLOT);
                                        m_anim.set_frame(avatar, 0, FIRST_ANIM_SLOT);
                                    }, FIRST_ANIM_SLOT);
                                }, FIFTH_ANIM_SLOT);
                            }, FOURTH_ANIM_SLOT);
                        }, THIRD_ANIM_SLOT);
                    }, SECOND_ANIM_SLOT);
                    break;
                case 5:
                    changeSelection(tokenArrayLength - 5);
                    m_anim.play(avatar, function() {
                        changeSelection(tokenArrayLength - 4);
                        m_anim.play(avatar, function() {
                            changeSelection(tokenArrayLength - 3);
                            m_anim.play(avatar, function() {
                                changeSelection(tokenArrayLength - 2);
                                m_anim.play(avatar, function() {
                                    changeSelection(tokenArrayLength - 1);
                                    m_anim.play(avatar, function() {
                                        m_anim.play(avatar, function() {
                                            m_anim.set_frame(avatar, 0, SECOND_ANIM_SLOT);
                                            m_anim.set_frame(avatar, 0, THIRD_ANIM_SLOT);
                                            m_anim.set_frame(avatar, 0, FOURTH_ANIM_SLOT);
                                            m_anim.set_frame(avatar, 0, FIFTH_ANIM_SLOT);
                                            m_anim.set_frame(avatar, 0, SIXTH_ANIM_SLOT);
                                            m_anim.set_frame(avatar, 0, FIRST_ANIM_SLOT);
                                        }, FIRST_ANIM_SLOT);
                                    }, SIXTH_ANIM_SLOT);
                                }, FIFTH_ANIM_SLOT);
                            }, FOURTH_ANIM_SLOT);
                        }, THIRD_ANIM_SLOT);
                    }, SECOND_ANIM_SLOT);
                    break;
                case 6:
                    changeSelection(tokenArrayLength - 6);
                    m_anim.play(avatar, function() {
                        changeSelection(tokenArrayLength - 5);
                        m_anim.play(avatar, function() {
                            changeSelection(tokenArrayLength - 4);
                            m_anim.play(avatar, function() {
                                changeSelection(tokenArrayLength - 3);
                                m_anim.play(avatar, function() {
                                    changeSelection(tokenArrayLength - 2);
                                    m_anim.play(avatar, function() {
                                        changeSelection(tokenArrayLength - 1);
                                        m_anim.play(avatar, function() {
                                            m_anim.play(avatar, function() {
                                                m_anim.set_frame(avatar, 0, SECOND_ANIM_SLOT);
                                                m_anim.set_frame(avatar, 0, THIRD_ANIM_SLOT);
                                                m_anim.set_frame(avatar, 0, FOURTH_ANIM_SLOT);
                                                m_anim.set_frame(avatar, 0, FIFTH_ANIM_SLOT);
                                                m_anim.set_frame(avatar, 0, SIXTH_ANIM_SLOT);
                                                m_anim.set_frame(avatar, 0, SEVENTH_ANIM_SLOT);
                                                m_anim.set_frame(avatar, 0, FIRST_ANIM_SLOT);
                                            }, FIRST_ANIM_SLOT);
                                        }, SEVENTH_ANIM_SLOT);
                                    }, SIXTH_ANIM_SLOT);
                                }, FIFTH_ANIM_SLOT);
                            }, FOURTH_ANIM_SLOT);
                        }, THIRD_ANIM_SLOT);
                    }, SECOND_ANIM_SLOT);
                    break;
                case 7:
                    changeSelection(tokenArrayLength - 7);
                    m_anim.play(avatar, function() {
                        changeSelection(tokenArrayLength - 6);
                        m_anim.play(avatar, function() {
                            changeSelection(tokenArrayLength - 5);
                            m_anim.play(avatar, function() {
                                changeSelection(tokenArrayLength - 4);
                                m_anim.play(avatar, function() {
                                    changeSelection(tokenArrayLength - 3);
                                    m_anim.play(avatar, function() {
                                        changeSelection(tokenArrayLength - 2);
                                        m_anim.play(avatar, function() {
                                            changeSelection(tokenArrayLength - 1);
                                            m_anim.play(avatar, function() {
                                                m_anim.play(avatar, function() {
                                                    m_anim.set_frame(avatar, 0, SECOND_ANIM_SLOT);
                                                    m_anim.set_frame(avatar, 0, THIRD_ANIM_SLOT);
                                                    m_anim.set_frame(avatar, 0, FOURTH_ANIM_SLOT);
                                                    m_anim.set_frame(avatar, 0, FIFTH_ANIM_SLOT);
                                                    m_anim.set_frame(avatar, 0, SIXTH_ANIM_SLOT);
                                                    m_anim.set_frame(avatar, 0, SEVENTH_ANIM_SLOT);
                                                    m_anim.set_frame(avatar, 0, EIGHT_ANIM_SLOT);
                                                    m_anim.set_frame(avatar, 0, FIRST_ANIM_SLOT);
                                                }, FIRST_ANIM_SLOT);
                                            }, EIGHT_ANIM_SLOT);
                                        }, SEVENTH_ANIM_SLOT);
                                    }, SIXTH_ANIM_SLOT);
                                }, FIFTH_ANIM_SLOT);
                            }, FOURTH_ANIM_SLOT);
                        }, THIRD_ANIM_SLOT);
                    }, SECOND_ANIM_SLOT);
                    break;
                default:
                    m_anim.play(avatar, function() {
                        m_anim.set_frame(avatar, 0, FIRST_ANIM_SLOT);
                    }, FIRST_ANIM_SLOT);
            }
        }
    }

    function changeSelection(number) {
        document.getElementById("selection").value = animationName(tokenArray[number]).replace("_", " ");
    }

    // This function is used to reset the animation slots which cannot be re-assigned until the previous animations are removed
    function reset() {

        // Declaring avatar model as a varaible
        var avatar = m_scenes.get_object_by_name("Avatar_model_2");

        m_anim.apply(avatar, "Idle", FIRST_ANIM_SLOT);
        m_anim.set_behavior(avatar, m_anim.AB_LOOP, FIRST_ANIM_SLOT);

        var backgroundRed = document.querySelector("#button_Right_Hand").style.background == 'rgb(217, 83, 79)';

        if (backgroundRed) {
            m_anim.apply(avatar, "Letter_A_Mirror", 1);
            m_anim.apply(avatar, "Letter_B_Mirror", 2);
            m_anim.apply(avatar, "Letter_C_Mirror", 3);
            m_anim.apply(avatar, "Letter_D_Mirror", 4);
            m_anim.apply(avatar, "Letter_E_Mirror", 5);
            m_anim.apply(avatar, "Letter_H_Mirror", 6);
            m_anim.apply(avatar, "Letter_I_Mirror", 7);
        } else {
            m_anim.apply(avatar, "Letter_A", 1);
            m_anim.apply(avatar, "Letter_B", 2);
            m_anim.apply(avatar, "Letter_C", 3);
            m_anim.apply(avatar, "Letter_D", 4);
            m_anim.apply(avatar, "Letter_E", 5);
            m_anim.apply(avatar, "Letter_H", 6);
            m_anim.apply(avatar, "Letter_I", 7);
        }

        m_anim.play(avatar, function() {
            m_anim.set_frame(avatar, 0, FIRST_ANIM_SLOT);
        }, FIRST_ANIM_SLOT);
    }

});

// import the app module and start the app by calling the init method
b4w.require("B00107064_Avatar_Project_main").init();