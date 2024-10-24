К файлу xp.css уровнем выше отношениния не имеет.
Это антитренд.
Мне нужен файл стилей, в котором переопределены дефолтные стили 
div
span
input
fieldset

div
 label
 input
 
должен выглядеть примерно также на форме.

Если нужно в одну строку
span label input

fieldset
должен выглядеть как groupbox в winXP.

У всех блоков по умолчанию padding:10px
margin-bottom: 10px
(цифру изменю после тестов).

th должен иметь фон как в xls в виндовс икспи.

Если у таблицы класс xls
то первая в строке td должна иметь фон как в xls в виндовс икспи.


Запланировано использование 
<section>
	<div>
		Поле ввода 1
		<input>
	</div>
	<div>
		Поле ввода 1
		<input>
	</div>
</section>

Для расположения вертикальных пар в ряд (но пока не реализовано).

Example

Здесь xp отвечает только за цвета (фон, цвет GrpoupBox)

<div class="xp">
	<fieldset>
		<legend>Json to Response 200</legend>
		<div>
			<span>
				<label for="iMethod">Метод</label>
				<select id="iMethod">
					<option value="POST">POST</option>
					<option value="GET">GET</option>
				</select>
			</span>
			<span>
				<label for="iUrl">URL запроса</label>
				<input type="text" id="iUrl" class="long">
			</span>
		</div>
		<div>
			<label for="iJson">Вставьте JSON Response</label>
			<textarea id="iJson" rows="7"></textarea>
		</div>
		
		<div>
			<label for="iSample">Надпись над полем ввода</label>
			<input type="text" id="iSample">
		</div>
	</fieldset>
	<div class="buttons">
		<input type="button" id="bSave" value="Вычислить">
	</div>
</div>
