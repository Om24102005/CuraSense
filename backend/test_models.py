import os
import requests
from dotenv import load_dotenv

load_dotenv('backend/.env')
HF_TOKEN = os.getenv("HF_TOKEN")
HEADERS = {"Authorization": f"Bearer {HF_TOKEN}"}

models = [
    "HuggingFaceH4/zephyr-7b-beta",
    "google/flan-t5-large",
    "meta-llama/Meta-Llama-3-8B-Instruct",
    "mistralai/Mistral-7B-Instruct-v0.3",
    "tiiuae/falcon-7b-instruct",
    "microsoft/Phi-3-mini-4k-instruct"
]

for m in models:
    url = f"https://api-inference.huggingface.co/models/{m}"
    res = requests.post(url, headers=HEADERS, json={"inputs": "hi"})
    print(f"{m}: {res.status_code}")
