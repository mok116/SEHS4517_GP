(function($) {

    

    // index.html function
    var home = {

        init: function() {

            // index page promotion slider - owl carousel slider
            home.slider();

            // index page movie slider - owl carousel slider
            home.getMovieList();
        },

        getMovieList: function() {

            var data = {
                action: "movie_list"
            };

            // user ajax to connect php and get the movie list
            $.ajax({
                type: "POST",
                dataType: "json",
                url: 'action/get_movie_list.php',
                data: data,
                success: function (responses) {

                    if(responses.success)
                    {
                        $(".movie-wrapper").html("");

                        var dbData = responses.message;

                        var movieHtml = "";

                        // strucutre the html code
                        $.each(dbData, function(index, item) {
                            
                            movieHtml += '<div class="movie-item row justify-content-center">';
                            movieHtml += '<div class="col-md-3 movie-cover-image">';
                            movieHtml += '<img src="'+item.cover_image_url+'" />';
                            movieHtml += '</div>';
                            movieHtml += '<div class="col-md-3 movie-description">';
                            movieHtml += '<h3>Introduction</h3>';
                            movieHtml += '<p>'+item.description+'</p>';
                            movieHtml += '</div>';
                            movieHtml += '<div class="col-md-6 movie-intro">';

                            movieHtml += '<div class="row justify-content-left">';
                            movieHtml += '<div class="col-md-4">';
                            movieHtml += '<p>Name</p>';
                            movieHtml += '</div>';
                            movieHtml += '<div class="col-md-4">'+item.name+'</div>';
                            movieHtml += '</div>';

                            movieHtml += '<div class="row justify-content-left">';
                            movieHtml += '<div class="col-md-4">';
                            movieHtml += '<p>Category</p>';
                            movieHtml += '</div>';
                            movieHtml += '<div class="col-md-4">'+item.category+'</div>';
                            movieHtml += '</div>';

                            movieHtml += '<div class="row justify-content-left">';
                            movieHtml += '<div class="col-md-4">';
                            movieHtml += '<p>Language</p>';
                            movieHtml += '</div>';
                            movieHtml += '<div class="col-md-4">'+item.language+'</div>';
                            movieHtml += '</div>';

                            movieHtml += '<div class="row justify-content-left">';
                            movieHtml += '<div class="col-md-4">';
                            movieHtml += '<p>Publish Date</p>';
                            movieHtml += '</div>';
                            movieHtml += '<div class="col-md-4">'+item.publish_date+'</div>';
                            movieHtml += '</div>';

                            movieHtml += '<div class="row justify-content-left">';
                            movieHtml += '<div class="col-md-4">';
                            movieHtml += '<p>Run Time</p>';
                            movieHtml += '</div>';
                            movieHtml += '<div class="col-md-4">'+item.run_time+'</div>';
                            movieHtml += '</div>';

                            movieHtml += '<div class="row justify-content-left">';
                            movieHtml += '<div class="col-md-4">';
                            movieHtml += '<p>Price</p>';
                            movieHtml += '</div>';
                            movieHtml += '<div class="col-md-4">$'+item.price+'</div>';
                            movieHtml += '</div>';
                            
                            movieHtml += '</div>';
                            movieHtml += '</div>';

                        });
                        
                        // paste html code to web page
                        $(".movie-wrapper").html(movieHtml);

                        // start the slider, support responsive
                        $(".movie-wrapper").owlCarousel({

                            loop: true,
                            margin: 0,
                            nav: false,
                            dots: true,
                            autoplay: true,
                            autoplayTimeout: 5000,
                            autoplayHoverPause: true,
                            responsive:{
                                0:{
                                    items: 1
                                },
                                600:{
                                    items: 1
                                },
                                1000:{
                                    items: 1
                                }
                            }
                        })
                    }
                },
            });
        },

        slider: function() {

            // start the slider, support responsive
            $(".index-slider").owlCarousel({

                loop: true,
                margin: 0,
                nav: false,
                dots: true,
                autoplay: true,
                autoplayTimeout: 5000,
                autoplayHoverPause: true,
                responsive:{
                    0:{
                        items: 1
                    },
                    600:{
                        items: 1
                    },
                    1000:{
                        items: 1
                    }
                }
            })
        },
    };

    if($(".index-page").length > 0) {

        home.init();
    }

    // register.html + login.tml function 
    var member = {

        // register form selector
        _registerForm: $("#register-form"),

        // login form selector
        _loginForm: $("#login-form"),

        init: function() {

            // the validation step of forms
            member.validation();
        },

        validation: function() {

            const forms = document.querySelectorAll('.needs-validation');

            // add event listener on form to validate the form
            Array.from(forms).forEach(form => {
                form.addEventListener('submit', event => {
                    if (!form.checkValidity()) 
                    {
                        event.preventDefault()
                        event.stopPropagation()
                    }
                    else
                    {
                        // register form handler
                        if(member._registerForm.length > 0) {
                            member.register();
                        }

                        // login form handler
                        if(member._loginForm.length > 0) {
                            member.login();
                        }
                    }

                form.classList.add('was-validated')
                    }, false)
                }
            )
        },

        register: function() {

            // ready to submit register form
            const formMsg = document.getElementById('form-msg');
            var formAlert = new bootstrap.Toast(formMsg);

            var data = {
                first_name : member._registerForm.find("#first_name").val(),
                last_name : member._registerForm.find("#last_name").val(),
                mailing_address : member._registerForm.find("#mailing_address").val(),
                phone_number : member._registerForm.find("#phone_number").val(),
                email_address : member._registerForm.find("#email_address").val(),
                password : member._registerForm.find("#password").val(),
            };

            // use ajax http request
            $.ajax({

                url: member._registerForm.attr("action"),
                type: "POST",
                data: data,
                dataType: 'json',
                beforeSend: function() {

                    // display spinner before form submit complete
                    common.spinnerLoader(true, member._registerForm);
                },
                success: function(responses) {

                    // display toast message aftet form submit success
                    member._registerForm.find("#form-msg").find(".toast-body").text(responses.message);
                    formAlert.show();

                    // disable the submit button
                    $('button[type=submit]').prop('disabled', true);

                },
                error: function() {

                    // error handling
                    member._registerForm.find("#form-msg").find(".toast-body").text("Register Fail: Something wrong.");
                    formAlert.show();
                },
                complete: function() {

                    // hide spinner after form submit complete
                    common.spinnerLoader(false, member._registerForm);
                }
            });
        },

        login: function() {

            // ready to submit login form
            const formMsg = document.getElementById('form-msg');
            var formAlert = new bootstrap.Toast(formMsg);

            var data = {
                email_address : member._loginForm.find("#email_address").val(),
                password : member._loginForm.find("#password").val(),
            };
            
            // use ajax http request
            $.ajax({

                url: member._loginForm.attr("action"),
                type: "POST",
                data: data,
                dataType: 'json',
                beforeSend: function() {

                    // display spinner before form submit complete
                    common.spinnerLoader(true, member._loginForm);
                    
                    // hide the home page hyper link before form submit complete
                    member._loginForm.find("#form-msg").find(".index-btn").hide();
                },
                success: function(responses) {

                    if(responses.success)
                    {
                        // display toast message aftet form submit success
                        member._loginForm.find("#form-msg").find(".toast-body").text(responses.message);
                        formAlert.show();

                        // count down to refresh
                        setTimeout(function(){
                            location.reload(); 
                        }, 3000); 
                    }
                    else
                    {
                        // display 1st page hyperlink aftet form submit fail, "created by you with a button for the user to press and go back to the first web page."
                        member._loginForm.find("#form-msg").find(".toast-msg").text(responses.message);
                        member._loginForm.find("#form-msg").find(".index-btn").show();
                        formAlert.show();
                    }
                },
                error: function() {

                    // error handling
                    member._loginForm.find("#form-msg").find(".toast-body").text("Login Fail: Something wrong.");
                    formAlert.show();
                },
                complete: function() {

                    // hide spinner after form submit complete
                    common.spinnerLoader(false, member._loginForm);
                }
            });
        },

        logout: function() {

            // ready to submit login form
            var data = {
                action: "logout"
            };

            // use ajax http request
            $.ajax({
                type: "POST",
                dataType: "json",
                url: 'action/logout.php',
                data: data,
                success: function (responses) {

                    if(responses.success)
                    {
                        // display toast message aftet form submit success
                        const formMsg = document.getElementById('logout-msg');
                        var formAlert = new bootstrap.Toast(formMsg);

                        $("#logout-msg").find(".toast-body").text(responses.message);
                        formAlert.show();

                        // count down to refresh
                        setTimeout(function(){
                            location.reload(); 
                        }, 3000); 
                    }
                },
            });
        },
    }

    if($(".register-page").length > 0 || $(".login-page").length > 0) {
        member.init();
    }

    // reservation.html funciton
    var reservation = {

        // reservation form selector
        _reservationForm: $("#reservation-form"),

        init: function() {

            // use index page movie list slider to display on reservation.html
            home.getMovieList();

            // get movie list and insert the options of movie into <select>
            reservation.getMovieList();

            // the validation step of forms
            reservation.validation();
        },
        
        validation: function() {

            const forms = document.querySelectorAll('.needs-validation');

            // add event listener on form to validate the form
            Array.from(forms).forEach(form => {
                form.addEventListener('submit', event => {
                    if (!form.checkValidity()) 
                    {
                        event.preventDefault()
                        event.stopPropagation()
                    }
                    else
                    {
                        // reservation form handler
                        if(reservation._reservationForm.length > 0) {
                            reservation.reserve();
                        }
                    }

                form.classList.add('was-validated')
                    }, false)
                }
            )
        },

        getMovieList: function() {

            var data = {
                action: "theatre_list"
            };

            // use ajax http request
            $.ajax({
                type: "POST",
                dataType: "json",
                url: 'action/get_theatre_list.php',
                data: data,
                success: function (responses) {

                    if(responses.success)
                    {
                        var dbData = responses.message;

                        $.each(dbData, function(index, item) {
                            
                            // paste the options of movie into <select> for reservation form
                            $("#movie-option").append($('<option>', { 
                                value: item.id,
                                text : item.name,
                                data_price : item.price,
                            }));
                        });

                        $("#movie-option").on("change", function() {

                            // after customers selected the movie, will reload the timeslots of movie for customers to choose
                            reservation.reloadTimeSlot(this.value, dbData);

                            // apply price of ticket to hidden value
                            $("input[name=price]").val($(this).find(':selected').attr('data_price'));
                        });
                    }
                },
            });
        },

        reloadTimeSlot: function(value, data) {
            
            // loop the timeslots data
            $.each(data, function(index, item) {

                if(value == item.id)
                {
                    // reset <select> of timeslot
                    $("#movie-timeslot").html("");
                    $("#movie-timeslot").append('<option selected disabled value="">Please Choose Time Slot</option>');

                    // reset <select> of seating plan
                    $(".seating-plan-cinema").html("");
                    $("#movie-seat").html("");
                    $("#movie-seat").append('<option selected disabled value="">Please Choose Seat</option>');

                    $.each(item.timeslot, function(index, time) {

                        const date = new Date(time.start_time);
                        
                        // paste the options of timeslots into <select> for reservation form
                        $("#movie-timeslot").append($('<option>', { 
                            value: time.movie_theatre_id,
                            text : date.toDateString()+" "+date.toLocaleTimeString().replace(/(.*)\D\d+/, '$1')+" ("+time.theatre_name+")" 
                        }));
                    });
                    
                    // after the options of timeslots ready, enable this <select>
                    $("#movie-timeslot").prop('disabled', false);

                    $("#movie-timeslot").on("change", function() {

                        // after customers selected the timeslot, will reload the seating plan of movie for customers to choose
                        reservation.reloadSeatPlan(this.value);
                    });
                }
            });
        },

        reloadSeatPlan: function(value) {

            // reset <select> of seating plan
            $("#movie-seat").html("");
            $("#movie-seat").append('<option selected disabled value="">Please Choose Seat</option>');
            
            var data = {
                action: "seat_list",
                movie_theatre_id: value,
            };

            // use ajax http request
            $.ajax({
                type: "POST",
                dataType: "json",
                url: 'action/get_seat_list.php',
                data: data,
                success: function (responses) {

                    if(responses.success)
                    {
                        var dbData = responses.message;

                        // define array for seating plan for display in frontend
                        var seats = [];

                        // loop the seating plan data for select options
                        $.each(dbData, function(index, item) {

                            // Initialize the array for the line if it doesn't exist
                            if (!seats[item.line]) 
                            {
                                seats[item.line] = [];
                            }

                            var disabled = false;
                            if(item.reservation_id)
                            {
                                // if the seat is ordered by other customers, will disable this option
                                disabled = true;

                                seats[item.line].push([item.column, "reserved"]);
                            }
                            else
                            {
                                seats[item.line].push([item.column, "available"]);
                            }

                            // paste the options of seating plan into <select> for reservation form
                            $("#movie-seat").append($('<option>', { 
                                value: item.seat_id,
                                text : item.line+item.column,
                                disabled : disabled,
                            }));
                        });

                        var seatingPlan = '<div class="seating-plan-screen">Screen</div>';

                        // loop the seating plan data for displaying frontend
                        const lines = Object.keys(seats); // Get the lines (keys of the object)
                        for (let i = 0; i < lines.length; i++) 
                        {
                            seatingPlan += '<div class="seating-plan-row">';

                            const line = lines[i];
                            const columns = seats[line];
                            for (let j = 0; j < columns.length; j++) 
                            {
                                const column = columns[j];
                                var seatNum = column[0];
                                var status = column[1];
                                seatingPlan += '<div class="seating-plan-seat '+status+'" data-seat="'+line+seatNum+'">'+line+seatNum+'</div>';
                            }

                            seatingPlan += '</div>';
                        }

                        $(".seating-plan-cinema").html(seatingPlan);

                        // after the options of seating plan ready, enable this <select>, reservation form is ready for submit now
                        $("#movie-seat").prop('disabled', false);
                    }
                },
            });
        },

        reserve: function() {

            // ready to submit reserve form
            const formMsg = document.getElementById('form-msg');
            var formAlert = new bootstrap.Toast(formMsg);

            var data = {
                movie_theatre_id : reservation._reservationForm.find("#movie-timeslot").find(":selected").val(),
                seat_id : reservation._reservationForm.find("#movie-seat").val(),
                customer_id : reservation._reservationForm.find("input[name=customer_id]").val(),
                price : reservation._reservationForm.find("input[name=price]").val(),
            };

            // use ajax http request
            $.ajax({

                url: reservation._reservationForm.attr("action"),
                type: "POST",
                data: data,
                dataType: 'json',
                beforeSend: function() {

                    // display spinner before form submit complete
                    common.spinnerLoader(true, reservation._reservationForm);
                },
                success: function(responses) {

                    if(responses.success)
                    {
                        // ready the data for Node.js 5th page
                        var reservationItem = responses.order.reservation_item.join(", ");

                        // create a hidden form for Node.js 5th page
                        var url = 'http://localhost:8080/success';
                        var form = $('<form action="' + url + '" method="post">' +
                            '<input type="hidden" name="customer_email_address" value="' + responses.order.customer_email_address + '" />' +
                            '<input type="hidden" name="customer_name" value="' + responses.order.customer_name + '" />' +
                            '<input type="hidden" name="order_number" value="' + responses.order.order_number + '" />' +
                            '<input type="hidden" name="start_time" value="' + responses.order.start_time + '" />' +
                            '<input type="hidden" name="total_amount" value="' + responses.order.total_amount + '" />' +
                            '<input type="hidden" name="reservation_item" value="' + reservationItem + '" />' +
                            '</form>');
                        
                        // use POST submit the reservation data to Node.js 5th page
                        $('body').append(form);
                        form.submit();
                    }
                },
                error: function() {

                    // error handling
                    reservation._reservationForm.find("#form-msg").find(".toast-body").text("Reserve Fail: Something wrong.");
                    formAlert.show();
                },
                complete: function() {

                    // hide spinner after form submit complete
                    common.spinnerLoader(false, reservation._reservationForm);
                }
            });
        }
    }

    if($(".reservation-page").length > 0) {

        reservation.init();
    }

    // Common Function
    var common = {

        checkCustomerSession: function() {

            // use ajax to check customer has logined or not
            var data = {
                action: "session"
            };

            $.ajax({
                type: "POST",
                dataType: "json",
                url: 'action/check_customer_session.php',
                data: data,
                success: function (responses) {

                    if(responses.id !== "")
                    {
                        // have login
                        var loginHtml = '<a class="nav-link" id="logout-btn" href="#">Logout</a>';
                        $("#login-nav").html(loginHtml);

                        $("#logout-btn").bind("click", function() {
                            member.logout();
                        });

                        // change the hyperlink on nav bar
                        var registerHtml = '<a class="nav-link" href="reservation.html">Reservation</a>';
                        $("#register-nav").html(registerHtml);

                        var customerHtml = '<a class="nav-link disabled" aria-disabled="true">Welcome, '+responses.first_name+" "+responses.last_name+'&nbsp;<i class="bi bi-person-fill"></i></a>';
                        $("#customer-nav").html(customerHtml);
                        $("#customer-nav").show();

                        if($("input[name=customer_id]").length > 0) {

                            // insert the customer data into web page
                            $("input[name=customer_id]").val(responses.id);
                            $("input[name=customer_email_address]").val(responses.email_address);
                        }

                        // if customer has logined, redirect customer to reservation page if he/she access login page
                        if(location.pathname.indexOf("login.html") != -1)
                        {
                            location.href="reservation.html";
                        }

                        // if customer stay on index page, show the reserve history
                        if($(".index-page").length > 0) {

                            var data = {
                                action: "customer_reservation",
                            };
                            
                            // use ajax http request
                            $.ajax({
                                type: "POST",
                                dataType: "json",
                                url: 'action/check_customer_reservation.php',
                                data: data,
                                success: function (responses) {

                                    if(responses.success)
                                    {
                                        var dbData = responses.message;

                                        // if have record
                                        if(Object.keys(dbData).length > 0)
                                        {
                                            var historyHtml = '<div class="container">';
                                            historyHtml += '<h1 class="text-center">';
                                            historyHtml += '<strong>Reservation History</strong>';
                                            historyHtml += '</h1>';

                                            // loop the record to build html
                                            $.each(dbData, function(index, item) {

                                                historyHtml += '<p class="reservation-row">';
                                                historyHtml += '<a class="btn btn-light reservation-head text-start" data-bs-toggle="collapse" href="#'+item.order_number+'" role="button" aria-expanded="false" aria-controls="'+item.order_number+'">';
                                                historyHtml += item.order_number;
                                                historyHtml += '</a>';
                                                historyHtml += '<div class="collapse" id="'+item.order_number+'">';
                                                historyHtml += '<div class="card card-body">';
                                                historyHtml += '<ul class="list-group list-group-flush">';
                                                historyHtml += '<li class="list-group-item"><strong>Order Number:</strong> '+item.order_number+'</li>';
                                                historyHtml += '<li class="list-group-item"><strong>Movie Time:</strong> '+item.start_time+'</li>';
                                                historyHtml += '<li class="list-group-item"><strong>Movie Name:</strong> '+item.movie_name+'</li>';
                                                historyHtml += '<li class="list-group-item"><strong>Theatre Name:</strong> '+item.theatre_name+'</li>';

                                                var seats = [];
                                                $.each(item.seats, function(index, seat) {
                                                    
                                                    seats.push(seat);
                                                });

                                                historyHtml += '<li class="list-group-item"><strong>Seats:</strong> '+seats.join(", ")+'</li>';

                                                historyHtml += '</ul>';
                                                historyHtml += '</div>';
                                            });

                                            historyHtml += '</div>';

                                            $(".reservation-history-section").html(historyHtml);
                                            
                                            $(".reservation-history-section").show();
                                        }
                                    }
                                },
                            });
                        }
                    }
                    else
                    {
                        // haven't login
                        $("#customer-nav").html("");
                        $("#customer-nav").hide();

                        // if customer has not logined, redirect customer to login page if he/she access reservation page
                        if(location.pathname.indexOf("reservation.html") != -1)
                        {
                            const formMsg = document.getElementById('logout-msg');
                            var formAlert = new bootstrap.Toast(formMsg);

                            // display toast message to ask customer login first
                            $("#logout-msg").find(".toast-body").text("Please Login First. After 3 second will redirect to Login page.");
                            formAlert.show();

                            // count down to refresh
                            setTimeout(function(){
                                location.href="login.html";
                            }, 3000); 
                        }
                    }
                },
            });
        },

        scrollToTop: function() {

            // scroll to top button function
            $(".btn-scroll-to-top").click(function() {

                $("html, body").animate({ scrollTop: 0 }, "slow");
                return false;
            });
        },

        spinnerLoader: function(showLoader, element) {

            // spinner loader function
            if(showLoader) {

                element.find(".spinner-border").show();
                element.find(".btn").hide();
            }
            else {

                element.find(".spinner-border").hide();
                element.find(".btn").show();
            }
        },
    }

    if($(".btn-scroll-to-top").length > 0) {

        common.scrollToTop();

        common.checkCustomerSession();
    }

})(jQuery);