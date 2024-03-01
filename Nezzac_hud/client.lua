-- discord.gg/fiveleaks

local isDriving = false;
local isUnderwater = false;

ESX = exports["es_extended"]:getSharedObject()


Citizen.CreateThread(function()
    while true do
        Wait(100)
        sleep = 800
        if isDriving and IsPedInAnyVehicle(PlayerPedId(), true) then
            sleep = 50
            local veh = GetVehiclePedIsUsing(PlayerPedId(), false)
            local speed = math.floor(GetEntitySpeed(veh) * 3.6)
            local vehhash = GetEntityModel(veh)
            local maxspeed = GetVehicleModelMaxSpeed(vehhash) * 3.6
            local rpm = GetVehicleCurrentRpm(veh)
            local hp = GetVehicleEngineHealth(veh)
            SendNUIMessage({})
            SendNUIMessage({action = 'veh_update', speed = speed, rpm = rpm, hp = hp})
        end
        Citizen.Wait(sleep)
    end
end)

Citizen.CreateThread(function()
    while true do
        Wait(1000)
        if five.ShowSpeedo then
            if IsPedInAnyVehicle(PlayerPedId(), false) and
                not IsPedInFlyingVehicle(PlayerPedId()) and
                not IsPedInAnySub(PlayerPedId()) then
                isDriving = true
                SendNUIMessage({action = 'inVeh', value = true})
            elseif not IsPedInAnyVehicle(PlayerPedId(), false) then
                isDriving = false
                SendNUIMessage({action='inVeh', value = false})
            end
        end
    end
end)

Citizen.CreateThread(function()
    while true do
        Wait(500)
        --local isTalking = NetworkIsPlayerTalking(PlayerId())
        --SendNUIMessage({action = 'update-talk', value = isTalking})

        TriggerEvent('esx_status:getStatus', 'hunger',
                     function(status) hunger = status.val / 10000 end)
        TriggerEvent('esx_status:getStatus', 'thirst',
                     function(status) thirst = status.val / 10000 end)

        SendNUIMessage({
            action = 'update-bars', 
            oxygen = GetPlayerUnderwaterTimeRemaining(PlayerId()) * 10,
            health = GetEntityHealth(PlayerPedId()) - 100, 
            armour = GetPedArmour(PlayerPedId()), 
            hunger = hunger, 
            thirst = thirst
        })

        if five.UseRadio then
            local radioStatus = exports["rp-radio"]:IsRadioOn()
            SendNUIMessage({action = 'update-bars', is_radion = radioStatus})
        end
        if IsPauseMenuActive() then
            SendNUIMessage({action = 'Hide_Hud', value = true})
        elseif not IsPauseMenuActive() then
            SendNUIMessage({action = 'Hide_Hud', value = false})
        end
    end
end)

RegisterNetEvent('esx:setJob')
AddEventHandler('esx:setJob', function(job)
	PlayerData.job = job
end)

CreateThread(function()
    while true do 
        Citizen.Wait(5000)
        PlayerData = ESX.GetPlayerData()
        if five.Job then
            SendNUIMessage({action = 'job', value = true})
            SendNUIMessage({action = 'update_job_info', job_label = PlayerData.job.label, job_grade_label = PlayerData.job.grade_label})
        end
    end
end)

-- hud komanda / discord.gg/fiveleaks

local status = true
RegisterCommand('hud', function()
if status then
    SendNUIMessage({
        action = 'Hide_Hud', 
        value = true
    })
    status = false
else
    SendNUIMessage({
        action = 'Hide_Hud', 
        value = false
    })
    status = true
end
end)

-- Map stuff below
local x = -0.025
local y = -0.015
local w = 0.16
local h = 0.25

Citizen.CreateThread(function()

    local minimap = RequestScaleformMovie("minimap")
    RequestStreamedTextureDict("circlemap", true)
    while not HasStreamedTextureDictLoaded("circlemap") do Wait(100) end
    AddReplaceTexture("platform:/textures/graphics", "radarmasksm", "circlemap",
                      "radarmasksm")

    SetMinimapClipType(1)
    SetMinimapComponentPosition('minimap', 'L', 'B', x, y, w, h)
    SetMinimapComponentPosition('minimap_mask', 'L', 'B', x + 0.17, y + 0.09,
                                0.072, 0.162)
    SetMinimapComponentPosition('minimap_blur', 'L', 'B', -0.035, -0.03, 0.18,
                                0.22)
    Wait(5000)
    SetRadarBigmapEnabled(true, false)
    Wait(0)
    SetRadarBigmapEnabled(false, false)

    while true do
        Wait(1000)
        BeginScaleformMovieMethod(minimap, "SETUP_HEALTH_ARMOUR")
        ScaleformMovieMethodAddParamInt(3)
        EndScaleformMovieMethod()
        BeginScaleformMovieMethod(minimap, 'HIDE_SATNAV')
        EndScaleformMovieMethod()
    end
end)

CreateThread(function()
    while true do
        Wait(2000)
        SetRadarZoom(1150)
        if five.AlwaysShowRadar == false then
            if IsPedInAnyVehicle(PlayerPedId(-1), false) then
                DisplayRadar(true)
            else
                DisplayRadar(false)
            end
        elseif five.AlwaysShowRadar == true then
            DisplayRadar(true)
        end
        if isDriving and IsPedInAnyVehicle(PlayerPedId(), true) then
            local veh = GetVehiclePedIsUsing(PlayerPedId(), false)
            local fuellevel = GetVehicleFuelLevel(veh)
            
            SendNUIMessage({
                action = "veh_update",
                fuel = fuellevel,
            })
        end
    end
end)


Citizen.CreateThread(function()
    while true do
        Citizen.Wait(300)
           SetBigmapActive(false, false) -- gasi veliku minimapu
           if five.enableAmmoBox then
               local playerPed = PlayerPedId()
               local weapon, hash = GetCurrentPedWeapon(playerPed, 1)
               sleep = 800
                if(weapon) then
                   sleep = 50 
                   isAmmoboxShown = true
                   local _,ammoInClip = GetAmmoInClip(playerPed, hash)
                   local MaxAmmo = GetMaxAmmoInClip(playerPed, hash, 1)
                   SendNUIMessage({
                           action = 'update-ammo',
                           max_ammo = MaxAmmo,
                           ammo = ammoInClip,
                           isArmed = true
                   })
                else
                   if isAmmoboxShown then
                       isAmmoboxShown = false
                       SendNUIMessage({
                           action = 'update-ammo',
                           isArmed = false
                       })
                   end
                end
                Wait(sleep)
                --print(sleep)
           else
               SendNUIMessage({
                   action = 'update-ammo',
                   isArmed = false
               })
               Wait(1000)
           end
    end
end) 




