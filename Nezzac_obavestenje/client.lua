

local notifID = 0
local lastTick
local tickCounter = 0

local TSE = TriggerServerEvent
local TE = TriggerEvent
local CT = CreateThread
local RNE = RegisterNetEvent
local EH = AddEventHandler

EH("notif:tick", function(message, time)
      SendNUIMessage({
        action = "tick",
        message = message,
        time = time or 200
      })
end)
function tick(message)
  if message == lastTick then
    tickCounter = tickCounter + 1
  else
    tickCounter = 0
  end

  if tickCounter >= 10 or tickCounter == 0 then
      SendNUIMessage({
        action = "tick",
        message = message,
      })

      lastTick = message
      tickCounter = 0
  end

end

exports("notif", function(title, message, time)
  notifID = notifID + 1
  SendNUIMessage({
    action = "addNotif",
    message = message,
    title =title,
    duration = time,
    id = notifID
  })
end)

local progressActive = false
exports("progress", function(poruka, time, sync)
  local endTime = GetCloudTimeAsInt() + time

  SendNUIMessage({
    action = "progress",
    message = poruka,
    time = time,
  })

  if not sync then
    while GetCloudTimeAsInt() < endTime do
      Wait(1000)
    end
  end

  return
end)

RNE("mornar_notif:notif", function(title, message, time)
  exports.mornar_notif:notif(title, message, time)
end)

RegisterNetEvent("monaco:serverobavjestenje", function(poruka, ime)
  SendNUIMessage({
    action = "servernotif",
    name = ime,
    message = poruka,
  })
	PlaySoundFrontend(-1, "DELETE","HUD_DEATHMATCH_SOUNDSET", 1)
end)

RegisterCommand("notif", function()
  exports.mornar_notif:notif("STAFF AKCIJA", "komanda ^3' test '^0 ti nije dozvoljena!", 5)
end)

RegisterCommand("progress", function()
  exports.mornar_notif:progress("Drkanje kurca...", 15)
end)

RNE("bHud:DoNotif", function(msg, time)
  exports.mornar_notif:notif("", msg, time)
end)


RNE("mornar_notif:tweet", function(tweet)
  SendNUIMessage({
    action = "tweet",
    tweet = tweet
  })
end)


RNE("mornar_notif:advert", function(ad)
  SendNUIMessage({
    action = "advert",
    ad = ad
  })
end)

RNE("mythic_notify:client:SendAlert", function(data)
  print(data.text)
  exports.mornar_notif:notif("", data.text, 5)
end)
