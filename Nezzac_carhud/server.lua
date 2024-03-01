
RegisterServerEvent("monaco_carhud/updatujStateove/", function()
    UpdateujState(source)
end)

function UpdateujState(source)
  local xPlayer = ESX.GetPlayerFromId(source)
  Player(xPlayer.source).state.pare = xPlayer.getMoney()
  Player(xPlayer.source).state.bankaPare = xPlayer.getAccountMoney("bank").money
end
