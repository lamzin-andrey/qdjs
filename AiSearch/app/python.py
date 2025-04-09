import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk, Gdk, GLib
import os
import subprocess

# Утилита DevNull (пустое тело)
def DevNull(*args):
    pass

class MyWindow(Gtk.Window):

    def __init__(self):
        Gtk.Window.__init__(self, title="Поиск по каталогам")
        self.set_default_size(800, 600)  # Пример размера
        self.connect("delete-event", Gtk.main_quit)

        # Основной вертикальный контейнер
        main_box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=5)
        self.add(main_box)

        # ---  Таблица  ---
        self.store = Gtk.ListStore(str, str)  # Колонка 1: Имя файла, Колонка 2: Полный путь каталога
        self.tree = Gtk.TreeView(model=self.store)

        # Колонка "Имя файла"
        renderer_file = Gtk.CellRendererText()
        column_file = Gtk.TreeViewColumn("Имя файла", renderer_file, text=0)
        self.tree.append_column(column_file)

        # Колонка "Каталог" с горизонтальным скроллом и hint-ами
        renderer_path = Gtk.CellRendererText()
        column_path = Gtk.TreeViewColumn("Каталог", renderer_path, text=1)

        # Настройка ширины колонки и обрезки текста
        column_path.set_sizing(Gtk.TreeViewColumnSizing.AUTOSIZE) #TRY_FIXED) # AUTOSIZE - сжимается, FIXED - фиксированный
        column_path.set_min_width(200)  # Минимальная ширина (важно)
        renderer_path.props.ellipsize = Gtk.EllipsizeMode.END # Обрезает текст с конца многоточием

        # Подключение tooltip (hint)
        column_path.set_cell_data_func(renderer_path, self.path_tooltip)
        self.tree.append_column(column_path)

        # Обработка клика по каталогу
        self.tree.connect("row-activated", self.on_row_activated)

        # ScrolledWindow для вертикального скролла
        self.scrollable_treelist = Gtk.ScrolledWindow()
        self.scrollable_treelist.set_vexpand(True) # Занимает доступное вертикальное пространство
        self.scrollable_treelist.add(self.tree)  # Вкладываем TreeView в ScrolledWindow
        main_box.pack_start(self.scrollable_treelist, True, True, 0)

        # --- Кнопки ---
        button_box = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=10)
        main_box.pack_start(button_box, False, False, 0) # Не растягивать кнопки

        close_button = Gtk.Button(label="Закрыть")
        close_button.connect("clicked", Gtk.main_quit)
        button_box.pack_start(close_button, True, False, 0)

        search_button = Gtk.Button(label="Найти")  #TODO: Добавить обработку для поиска
        button_box.pack_start(search_button, True, False, 0)

        # Заполнение данными (пример)
        self.add_row("Document.txt", "/home/user/documents")
        self.add_row("Image.png", "/home/user/images/screenshots/really/long/path")
        self.add_row("Another.pdf", "/opt/some_application/data")

    def add_row(self, filename, path):
         self.store.append([filename, path])


    def path_tooltip(self, column, cell, model, iter, data):
        """Установка hint (tooltip) для ячейки с путем."""
        path = model.get_value(iter, 1)  # 1 - индекс колонки с путем
        cell.set_property("tooltip-text", path) # Альтернативно: cell.tooltip_text = path

    def on_row_activated(self, tree, path, column):
        """Обработка двойного клика/активации строки."""
        model = tree.get_model()
        file_path = model[path][1] # Получаем значение из колонки "Каталог"
        print(f"Открываем: {file_path}")
        #Env.exec("#!/bin/bash\nthunar путь-к-каталогу", DevNull, DevNull, DevNull)
        try:
            subprocess.run(["thunar", file_path])
        except FileNotFoundError:
             print("Thunar не найден в системе")
        except Exception as e:
            print(f"Ошибка при открытии: {e}")

win = MyWindow()
win.show_all()
Gtk.main()
