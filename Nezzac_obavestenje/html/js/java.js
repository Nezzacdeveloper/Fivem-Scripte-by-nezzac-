var NotifID = 0
var phoneID = 0
var BigNotifTimeout = null
var TickTimeout = null
var CurrentProgress = null

function percentage(partialValue, totalValue) {
   return (100 * partialValue) / totalValue;
}


function colorTrans(string) {
  return string
    .replace(/\^([0-9])/g, (string, color) => `<span class="color-${color} obicno">`)
    .replace(/~([a-z])~/g, (string, color) => `<span class="gameColor-${color} obicno">`).replace(/\n/g,'');
}


$(function() {

  let string2 = "test ^1 aaa"
  string2.replace(/\^([0-20])/g, (string, color) => console.log(color))

  window.addEventListener('message', function(event) {
    let data = event.data

    if (data.action == "addNotif") {
      NotifID++
      let string = colorTrans(data.message)

      $("#notificationBox").prepend(`
        <div class="blue-info" id = notif_${data.id}>
            <div class="content">
                <div class="info-icon">
                    <i class="fas fa-info-circle"></i>
                </div>
                <div class="text">
                  <span>${data.title || "Notifikacija"}</span><br>
                  <p>${string}</p>
                </div>
            </div>
        </div>

      `)
      $(`#notif_${data.id}`).slideToggle("slow", function(){
        let thisNotId = data.id

        $(`#notif_${thisNotId}`).delay((data.duration * 1000) || 5000).slideToggle("slow", function(){
          $(`#notif_${thisNotId}`).remove();
        })
      })

    } else if (data.action == "tick") {
      $("#tickFrame").show()

      $("#tickNotif").html(data.message)

      if (TickTimeout) {
        clearTimeout(TickTimeout)
      }

      TickTimeout = setTimeout(function(){
        $("#tickFrame").hide()
        TickTimeout = null
      }, data.time)

    } else if (data.action == "servernotif") {
      $(".headline").html("OBAVESTENJE - " + data.name)
      $("#serverNotif").html(data.message)

      if (BigNotifTimeout) {
        clearTimeout(BigNotifTimeout)
        $("#info-big").fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);

        BigNotifTimeout = setTimeout(function(){
          $("#info-big").slideToggle("slow")
          BigNotifTimeout = null
        }, 10000)
      } else {
        $("#info-big").slideToggle("slow", function(){
          BigNotifTimeout = setTimeout(function(){
            $("#info-big").slideToggle("slow")
            BigNotifTimeout = null
          }, 10000)
        })
      }

    } else if (data.action == "progress") {
      $("#progressText").html(data.message)
      $("#progressFrame").slideToggle("slow")
      let CountDown = data.time

      CurrentProgress = setInterval(function() {
        CountDown--

        $(".progress-bar").css("width", percentage((data.time - CountDown), data.time) + "%")

        if (CountDown <= 0) {
          clearInterval(CurrentProgress)
          $("#progressFrame").slideToggle("slow")
        }
      }, 1000)

    } else if (data.action == "tweet") {
      phoneID++
      let jedanTweet

      if (data.tweet["image"] != "") {
        jedanTweet = $(`
          <div class="twitter">
              <div class="top-label">
                <div class="logo">
                    <img src="img/twitter-logo.svg">
                    <p>TWITTER</p>
                </div>
                <div class="user-name">${data.tweet["author"]}</div>
              </div>
              <div class="not-content">
                <div class="text-content">
                    <p>${data.tweet["message"]}</p>
                </div>
                <div class="image-content">
                    <img src="${data.tweet["image"]}">
                </div>
              </div>
          </div>
        `)
      } else {
        jedanTweet = $(`
          <div class="twitter noimg" id = tweeog_${phoneID}>
              <div class="top-label">
                <div class="logo">
                    <img src="img/twitter-logo.svg">
                    <p>TWITTER</p>
                </div>
                <div class="user-name">${data.tweet["author"]}</div>
              </div>
              <div class="not-content">
                <div class="text-content">
                    <p>${data.tweet["message"]}</p>
                </div>
              </div>
          </div>
        `)
      }

      $(".notifBox").prepend(jedanTweet)
      jedanTweet.delay(10000).hide("slide", { direction: "right" }, 1000);

    } else if (data.action == "advert") {
        phoneID++
        let jedanAd

        if (data.ad["image"] != "") {
          jedanAd = $(`

            <div class="add-not" id = "tweeog_${phoneID}">
                <div class="top-label">
                  <div class="logo">
                      <img src="img/ads-logo.svg">
                      <p>OGLASI</p>
                  </div>
                  <div class="user-name">${data.ad["author"]}</div>
                </div>
                <div class="not-content">
                  <div class="text-content">
                      <p>${data.ad["message"]}</p>
                  </div>
                  <div class="image-content">
                      <img src="${data.ad["image"]}">
                  </div>
                </div>
            </div>

          `)
        } else {

          jedanAd = $(`

            <div class="add-not noimg" id = "tweeog_${phoneID}">
                <div class="top-label">
                  <div class="logo">
                      <img src="img/ads-logo.svg">
                      <p>OGLASI</p>
                  </div>
                  <div class="user-name">${data.ad["author"]}</div>
                </div>
                <div class="not-content">
                  <div class="text-content">
                      <p>${data.ad["message"]}</p>
                  </div>
                </div>
            </div>

          `)

        }

        $(".notifBox").prepend(jedanAd)
        jedanAd.delay(10000).hide("slide", { direction: "right" }, 1000);

      }

  });
});
