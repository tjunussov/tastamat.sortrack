TODO 
+ bug:utest
+ ui:demoPrintModal
+ ui:techindex setup 
+ ui:aboutModal
+ ui:helpModal
+ ui:badgeModal
+ ui:wallpaper
+ ui:second scan logout
+ ui:weight by keyboard
+ ui:autofocus weight by default
+ ui:mock weight
+ autoprint toggle
+ ui:polish print templates

+ ui:multiled setup
+ bug:calibrate 0 wrong
+ ui:calibrate with bind index also
+ settings base url



TODO Kenmat
+ bug:user.login putToBag
+ Keyboard keyCode for "."
+ Keyboard keyCode for "."
+ modal sortplan button bottom
+ fetchRPO error simulate
+ bug:close modal dialog not working

+ wrong login error shake
+ thor tab different color ( цвет активного таба тора должен быть примечательным )
+ bug: sortplan length
+ closeBag button grey
+ Design yarlik print template for Label Printer
+ last closeBag respone save, and show button
? weight format, without .
+ bug:calibrate blink timeout too quick
+ sortplan подгружает старый индекс если без refresh
+ led connect error show
+ manuaL:calbrate screen 
+ manuaL:spd link, GenericText
+ manual: be carefull cors
+ manual: link for firmware
+ bug:afterscantimeout close modal null error
+ close modal fix height if multiple also


+ Ограничение веса 15 кг - Тима
+ Обязательное поле пломба - Тима
+ Не корректно указывается вес - Тима
+ в ярлыке отображать вид заделки и техиндекс, ПУС эти поля передает
+ LedOn on error network only ( not 404 )
+ Аварийная ячейка с кол-вом РПОшек в нем
- settings multiled configure 48, or splitted, add thor button
-- multithor websocket support 8080
- calibrate ui issue: при калибровке вводит заблуждение красная рамка на ячейках которая перемещается, иногда она показывает не в тему. Предлагаю убрать. А откалиброванные ячейки отмечать зеленным.

- test all templates
- test whole process

--- yarlik native print try and silent print test
- calibrate without login
- bug:reinint clears led settings
+ led:search blink not working
- ui: polish ui design of closeModal tabs or list
- ui: animate weight and make sound
+ last bag led if 2-3modules
- toogle DEMO refresh issue


POKAZ AYGERIM
+ closebag:barcode bellow value
+ closebag:sendMethod,taraType,comment
- taraId
- bekmurat:признак умных полок
- мини статистика по мультиюзерам
- Мультиюзер light
- B-накладная много, G-накладная (одна) тест
- barcode bug: 800218
+ 96 leds    
- 

TODO 4.0
- overcome https issue for LEDs
- overcome https CORS for PUS Server
- ui:sortplan editable
+ refactor:localStorage to idb
- ui:logo swipe
- ui:fullscreen icon
- led lenght and multitor ranges
- apply mock without refresh
- move all to settings

TODO 5.0
+ пункт - перекладка рпо запретить если в другом уже лежит,
+ когда ШПИкает, индекс отделения потянуть наименование из сортплана
- Каиржан все на https 
+ ДЕМО - убрать
+ Кнопка Установка СОРТПЛАНА убрать , только распечатать
+ Если в range невходит то в отстойник
- multiled filter
- print bag
+ weight, plomba, type, sendmeth show
- led thor availability
- multiled emulate

TODO 6.0
+ closebag:disable double click close bag button
+ calibrate:error bag, disable barcode set 
+ search:allow only wpi masked barcode, disallow other variations
+ search:upper case all chars
+ closebag: weight only numeric
+ console:more than 100 smaller font
+ closebag: selection between closebag/closepacket
+ closebag: form blist
+ отстойник незакрашивается
+ демо отключить по умолчанию
+ Б с весами
? search:disable parallel search wpi
? ручной ввод ШПИ внутри принудительного внесения в мешок
+ bug:formPackList error not handled
+ bug:formPackList weight not processed
+ удаление B накладной
- calibrate: free style at any state
- показывать на экране что есть Бшки
? bug:иногда ранее созданный мешок не исчезает
+ Выводить общий вес 
+ При ошибке формирования Bшке выводить ошибку
+ При ошибке ручного ввода ШПИ, выводить ошибку
+ Передавать вес автоматический при Bшке
+ Numeric issue totalWeight":"2029.9999999999998"
+ выводить результат B накладной
- При закрытии мешка если ПУС вернул пусто то выводить на экран ввиде ошибки
+ удалять пробелы из ШПИ
- при ручном вводе ШПИ, все равно делать поиск ШПИ в ПУС, просто ложить в данный ячейку
- закрашивать header или badge если выбран тестовый API ПУС
- закрашивать header или badge если зашли на ТЕСТОВЫЙ сервер


TODO 7.0 Multiuser
+ Keyboard handle color selector
+ AppDropdown barcodeManual color Selector
+ App NavBar show parallel color sessions
+ Console: color bag respect color
+ Console: findBag split to colored parallel sessions
+ Console: REFACTOR vuex code to multiple session
+ Issues with CloseBag, ManualWPI
+ findBag Led respect color
- statuses sync with audio and leds ( login, select etc )
- Leds: handle LED ON separately from colors
- Leds: handle LED OFF separately from colors
- Leds: handle LED ERROR separatly
- Leds And Sounds special Actions
+ Fill Main Color if multiple colors at same time
+ Login: user set color by login menu
! Paralel findBag only, No Parallel closeBag!


TODO 8.0 Polish
- ui:calibrate bug: after sortplan loaded, remapbag not refreshing index
- ui bug: editBox when typing name, index reset to original index
- ui: edit bag indexes like Excel Modal
+ ui: bug with Dropdown, on enter shows Dropdown
- keyboard: colored prefixes, b and g also use for calibrate
- keyboard: u for user prefix not working
- подксказки сделать
- калибровка индексов
- калибровка лампочек отделить
- калибровка лампочек подсвечивать только след лампочку, мигание не работает!

HARDWARE TODO
1) установка IP адреса статичного через WIFI Manager
2) автоподключение к сорттак вафай сети
3) добавить логику 2 выходов
4) повозможности сделать прошивку обновляемую через OTA
5) добавить Websocket сервер или MQTT Broker
6) использовать второе ядро
7) прокси печать