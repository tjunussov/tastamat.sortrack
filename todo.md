http
mock
barcodes
ui replies
test
calibrate
login

///// azamat
+ сценарий тестирования от азамата
- ошибка если ненайден в сортплане писать что бы положил в Резервную ячейку ( без лампочки )


+ редактируемые пармертры LED и INDEX
+ табы по мультиторам, авто выбор
+ авиа закоменчу.? Азамат уточнит
+ сделать штрихкод в модалке юзера, войти кнопка
+ тест кнопка на led настройку
- sortplan confirm replace dialog
/////
- выемка по повтороному сканированию
- lazy sortplan enable/disable
- selectBag по порядковому номеру ( через # )
- калибровка по Номеру ячейки и Сортплану
- printer without proxy, direct print




/-------- #### -------/
- auth:autofocus При выводе модалки с авторизацией  курсор устанавливать на инпуте
+ auth:error, mock При вводе AD непонятно удачный логин или нет. Судя по всему там вообще нет проверки и процесс не связан с ПУСом
- auth:badge Непонятно зачем там отображать Штрих-код. Хорошо было бы если там отображался Бейджик с именем, наименование подразделения, штрих-код. Там же была бы кнопочка «распечатать».
- auth:logout Нет кнопки Логаута. Понятно что при удалениии AD из поля или его смене происходит логаут. А как быть если ты просто хочешь закрыть свою сессию?
- auth: lock screen Предлагаю закрывать весь функционал Home Скрином (часы + Большой логотип  адрес  лендинга + кнопку «проиграть видео-инструкцию»), Незалогиненым можно закрыть мешок - почему?


- bind: Сделать «Непрогерскую нумерацию ячеек»
 ◦ При загрузке сортплана ячейкам присваиваются номера ледов начиная с 25 числа - приходится вручную перебивать


- settings: Функционал загрузки сортплана разместить во вкладке «настройки»
- settings: сли сортплан больше числа имеющихся ячеек - продолжить работу, но дать алерт с сообщением «Количество опорных индексов сортплана превышает количество ячеек стеллажей! Рекомендуется увеличить число ячеек, либо уменьшить сортплан.»


+ При открытии консоли - курсор на инпуте с ШПИ, не нужно так как и так то на body
- track error: При прогонке тестовых ШПИ видимо попался один с пустым json - выдал «{}». Надо выдать какой-то внятный текст ошибки, например «По данной корреспонденции информации в системе не обнаружено». И поскольку скорее всего на конверте все таки информация о направлении есть, то надо попросить юзера отсканить соответствующую ячейку чтобы он мог сам назначить направление.
 ◦ При ручном вводе ШПИ в поле + Enter = страница почему-то релоудится
 ◦ Нет возможности проверить Edge-кейсы.
 ⁃ Что если опорного индекса нет в сортплане
 ⁃ Что если нет опорного индекса в информации по ШПИ



5. Выемка письма
Нужен тумблер для включения режима выемки. Включаешь его - запускается обратный процесс, сканируешь ШПИ и он удаляет этот ШПИ среди уже отсортированной корреспонденции.


- mock: random 6. Заделка мешка
 ◦ Как ни сортируй - во всех ячейках в графе «Куда» стоит «050010 Алматы-10», ярлык  тоже статичный


7. Косметические вещи

7.1. Консоль
 ◦ Нумерация ячеек человеческая и сквозная по табам
 ◦ Табы «1 [0-24]» и «2 [24-48]» надо как-то визуально по разному обозначить, а то при сортировке не сразу понятно на какой табе ты находишься.
 ◦ Вместо опорников писать направления (human-friendly подход)
 ◦ В нижней панели фунционал «Сортплан» перенести во вкладку «настройки», Debug и Bind Start скрыть


7.2. Настройки
 ◦ Скрыть пункты «Статистика», Debug, Пользователи и Поиск посылок - Достаточно иметь там настройки сортплана и общие настройки


7.3. Header
 ◦ Сделать нормальный логотип +рядом мелким шрифтом версия софта
 ◦ Скрыть инпут «Мешок»