Для тех, кто любит записывать эфиры радио Маяк и не любит новости спорта на этой радиостанции.
Нужны установленные программы Audio-Recorder, mplayer в котором воспроизводится радио.


Кстати, возможно, если audio-recorder станет когда-то недоступен
audio/x-raw,rate=44100,channels=2 ! lamemp3enc name=enc target=0 quality=2
 - вот так в нем было написано в окне Команда.


# Скопируйте и вставьте следующую команду в окно терминала.
# Устройства подгружаются из основного окна графического интерфейса.

# Использовать средство pactl для перечисление доступных звуковых (на входе) устройств системы.
# pactl list short sources | cut -f2
# pactl list | grep -A3 'Source #'

# Эта команда произведет запись в файл test.mp3.
# Нажмите CTRL+C, чтобы прервать запись.

gst-launch-1.0  -e pulsesrc device=alsa_output.pci-0000_00_14.2.analog-stereo.monitor \
! queue \
! audioresample ! audioconvert \
! audio/x-raw,rate=44100,channels=2 ! lamemp3enc name=enc target=0 quality=2 \
! filesink location=test.mp3


LR 1130 Camelion
