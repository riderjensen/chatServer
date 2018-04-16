// Add your javascript here
// Don't forget to add it into respective layouts where this js file is needed

// Add smooth scrolling on all links inside the navbar
$("#navbar a").on('click', function(event) {
  
    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
  
      // Prevent default anchor click behavior
      event.preventDefault();
  
      // Store hash
      var hash = this.hash;
  
      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){
  
      // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
  
    } // End if
  
  });

  var userName = "rider";
    function getName(){
        userName = prompt("Username?");
        document.getElementById("username").innerHTML = ("Username: "+userName);
    }
    getName();
    var socket = io('http://127.0.0.1:3000/');
        socket.on('news', function (data) {
        console.log(data);
        socket.emit('my other event', { my: 'data' });
    });
    var x = document.getElementById("submitButton");
    x.onclick = function(){
        var userMessage = document.getElementById("data").value;
        var userTotal = [userName, userMessage];
        socket.emit('message', userTotal);
    };
    socket.on("otherMessage", function(userData){
        var pTag = document.createElement("p");
        var textNode = document.createTextNode(userData[0] + ": "+ userData[1]);
        pTag.appendChild(textNode);
        document.getElementById("userMessages").appendChild(pTag);
    });