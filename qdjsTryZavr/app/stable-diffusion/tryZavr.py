import sys
sys.path.append("/opt/p-landlib/landdesk")
from IQdjs import *

from diffusers import (StableDiffusionPipeline)
from torch import (torch)

# translate
from pathlib import Path
from colorama import Fore, init
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
init()
tokenizer = AutoTokenizer.from_pretrained("Helsinki-NLP/opus-mt-ru-en", force_download=False, local_files_only= True)
model = AutoModelForSeq2SeqLM.from_pretrained("Helsinki-NLP/opus-mt-ru-en", force_download=False, local_files_only= True)
def translate_phrase(phrase: str) -> str:
    """
    Перевод фраз из файла, вывод перевода в терминал.
    Функция возвращает переведенную фразу.
    """
    inputs = tokenizer(phrase, return_tensors="pt")
    output = model.generate(**inputs, max_new_tokens=100)
    out_text = tokenizer.batch_decode(output, skip_special_tokens=True)
    #print(f'\r{Fore.YELLOW}   {out_text[0]}', end="")
    return out_text[0]
enText = translate_phrase(App.getArgs()[1])
# /translate

model_id = App.getArgs()[2]
#model_id = "dreamlike-art/dreamlike-diffusion-1.0" # Была про динозавров, но кажется вообще крутая
#model_id = "sd-legacy/stable-diffusion-v1-5" # использовалась по умолчанию в WebUI
#model_id = "prompthero/openjourney" # Как миджорни
#model_id = "darkstorm2150/Protogen_v2.2_Official_Release" #Если нужна модель, заточенная под портреты

# Не установленные
#model_id = "hakurei/waifu-diffusion" # "под вайфы" типа для японских комиксов. 
# Удалил, но возможно попытаюсь использовать для рисования в мультяшном стиле

NIS = int(App.getArgs()[3])
GS  = float(App.getArgs()[4])

#pipe = StableDiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.float16) # cuda
pipe = StableDiffusionPipeline.from_pretrained(model_id)

print("Супер — модель выбрали, загрузили в пайплайн. \n")


pipe = pipe.to("cpu")

print("Try USE CPU... \n")

#print("Arg: " + App.getArgs()[1]  + "\n")
print("Arg 1: " + enText  + "\n")
print("Arg 2: " + model_id  + "\n")
print("Arg 3: " + str(NIS)  + "\n")
print("Arg 4: " + str(GS)  + "\n")


images = pipe(
    #prompt = "photorealistic front view soft toy green dinosaur rex in a white T-shirt sat down behind a desk with computers and servers background is data centre",
    prompt = enText,
    negative_prompt = "cut off, bad, boring background, simple background, More_than_two_legs, more_than_two_arms, (3d render), (blender model), (((duplicate))), ((morbid)), ((mutilated)), [out of frame], extra fingers, mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), ((ugly)), blurry, ((bad anatomy)), (((bad proportions))), ((extra limbs)), cloned face, (((disfigured))), out of frame, ugly, extra limbs, (bad anatomy), gross proportions, (malformed limbs), ((missing arms)), ((missing legs)), ((extra arms)), ((extra legs)), mutated hands, (fused fingers), (too many fingers), ((long neck)), lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, artist's name",
    #negative_prompt = "deformed, disfigured, poorly drawn, bad anatomy, wrong anatomy, extra limb, missing limb, floating limb, disconnected limb, (mutated hands and fingers), blurry",
    height = 512,
    width = 512,
    num_inference_steps = NIS,
    guidance_scale = GS,
    num_images_per_prompt = 1
).images

#

#print("Array of Images done, try save \n ")

#print("type: \n")
#print(type(images[0]))
#print("\n\nend typeof\n\n")

#images[0].save("/home/lubuntu/0T1.png");

images[0].save("0T2.jpg");
#images[1].save("0T1.jpg");
#images[2].save("0T0.jpg");
#images[3].save("0T3.jpg");

print("Done! \n ")


