получить можно просто, 
xwininfo  -root -children -tree|grep geany
ориентируемся либо про отступам, либо по длинному имени

xwininfo  -root -children -tree|grep geany

Пример

0x4e3de79 "geany": ("geany" "Geany")  209x91+149+717  +149+717
     0x4e39d31 "geany": ("geany" "Geany")  200x200+0+0  +0+0
     0x4e39d2d "geany": ("geany" "Geany")  200x200+0+0  +0+0
     0x4e39d29 "geany": ("geany" "Geany")  200x200+0+0  +0+0
     0x4e001a2 "geany": ("geany" "Geany")  315x210+554+128  +554+128
     0x4e00141 "geany": ("geany" "Geany")  274x140+282+86  +282+86
     0x4e07acb "Найти": ("geany" "Geany")  574x229+353+415  +353+415
     0x4e2b82d "geany": ("geany" "Geany")  344x364+762+657  +762+657
     0x4e21174 "geany": ("geany" "Geany")  335x189+228+702  +228+702
     0x4e03f71 "Заменить": ("geany" "Geany")  670x267+204+512  +204+512
     0x4e00221 "geany": ()  10x10+-100+-100  +-100+-100
     0x4e00001 "geany": ("geany" "Geany")  10x10+10+10  +10+10
        0x4e00003 "index.tpl.php - /opt/lampp/htdocs/mh.loc/www - [busypeople] - Geany": ("geany" "Geany")  910x747+6+29  +-47+74
        
xwininfo  -id 0x4e00003 -chidren
то есть взяли перый, это текстовый редактор.
Путем нехитрых вычислений понимаем геометрию нашего окна - диспетчера.
4 children:
0x4e39d2c (has no name): ()  488x470+420+93  +469+180
0x4e39d34 (has no name): ()  488x470+420+93  +469+180
0x4e39d30 (has no name): ()  488x470+420+93  +469+180
0x4e00004 (has no name): ()  1x1+-1+-1  +48+86

