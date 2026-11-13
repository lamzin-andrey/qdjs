#!/usr/bin/env python3
"""
landautostopd — читает 4 байта из time.sock раз в 5 секунд
и управляет shutdown -P / shutdown -c.
Запускается от root через systemctl.
"""

import os
import sys
import stat
import time
import logging
import subprocess

SOCK_PATH = "/opt/qt-desktop-js/apps/qdjsRubilnik/app/d/time.sock"
RESET_STR = b"r000"
POLL_INTERVAL = 5.0
SHUTDOWN_BIN = "/sbin/shutdown"  # фиксированный путь, без поиска в PATH

# Разрешённые байты
DIGITS = set(b"0123456789")
FIRST_EXTRA = set(b"rc")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    handlers=[logging.StreamHandler(sys.stderr)],
)
log = logging.getLogger("landautostopd")


def safe_open_for_read_write(path: str) -> int:
    """
    Открывает файл для чтения/записи с защитой от симлинков и не-regular файлов.
    O_NOFOLLOW запрещает следование по симлинку.
    O_NONBLOCK — чтобы не зависнуть на FIFO (если подменят на FIFO).
    """
    flags = os.O_RDWR | os.O_NOFOLLOW | os.O_NONBLOCK | os.O_CLOEXEC
    fd = os.open(path, flags)
    st = os.fstat(fd)
    if not stat.S_ISREG(st.st_mode):
        os.close(fd)
        raise OSError(f"{path} is not a regular file")
    return fd


def read_first4(fd: int) -> bytes:
    """Позиционно читает первые 4 байта, не меняя позицию для записи."""
    try:
        data = os.pread(fd, 4, 0)
    except (BlockingIOError, OSError):
        return b""
    return data


def write_reset(fd: int) -> None:
    """Атомарно перезаписывает содержимое 'r000' (без доп. данных)."""
    os.ftruncate(fd, 0)
    os.pwrite(fd, RESET_STR, 0)


def run_shutdown(args: list[str]) -> None:
    """Вызов shutdown без shell, с фиксированным бинарником."""
    try:
        # Запись (перезапишет файл)
        with open('/opt/qt-desktop-js/apps/qdjsRubilnik/app/d/log.txt', 'a', encoding='utf-8') as f:
            f.write(str(args) + '\n')
            f.close()
        subprocess.run([SHUTDOWN_BIN, *args], check=False)
    except FileNotFoundError:
        log.error("shutdown binary not found at %s", SHUTDOWN_BIN)
    except Exception as e:
        log.exception("shutdown call failed: %s", e)


def process(fd: int) -> None:
    data = read_first4(fd)
    if len(data) < 4:
        # Неполные данные — сбрасываем
        write_reset(fd)
        return

    b0, b1, b2, b3 = data[0], data[1], data[2], data[3]

    # Валидация допустимых значений
    if b0 not in DIGITS and b0 not in FIRST_EXTRA:
        write_reset(fd)
        return
    if b1 not in DIGITS or b2 not in DIGITS or b3 not in DIGITS:
        write_reset(fd)
        return

    # 'r' — просто сброс
    if b0 == ord('r'):
        write_reset(fd)
        return

    # 'c' — отмена
    if b0 == ord('c'):
        log.info("cancel requested")
        run_shutdown(["-c"])
        write_reset(fd)
        return

    # b0..b3 — цифры
    A = (b0 - ord('0')) * 10 + (b1 - ord('0'))
    B = (b2 - ord('0')) * 10 + (b3 - ord('0'))

    if A > 23 or B > 59:
        write_reset(fd)   # согласно ТЗ — continue (оставляем как есть? см. ниже)
        return
    if A < 0 or B < 0:
        write_reset(fd)
        return

    log.info("scheduling shutdown at %02d:%02d", A, B)
    run_shutdown(["-P", f"{A:02d}:{B:02d}"])
    write_reset(fd)


def main() -> None:
    log.info("landautostopd started, watching %s", SOCK_PATH)
    while True:
        fd = None
        try:
            fd = safe_open_for_read_write(SOCK_PATH)
            process(fd)
        except FileNotFoundError:
            log.warning("socket file not found: %s", SOCK_PATH)
        except OSError as e:
            log.warning("cannot open %s: %s", SOCK_PATH, e)
        except Exception:
            log.exception("unexpected error in loop")
        finally:
            if fd is not None:
                try:
                    os.close(fd)
                except OSError:
                    pass
        time.sleep(POLL_INTERVAL)


if __name__ == "__main__":
    main()
