import torch
from transformers import T5Tokenizer, T5ForConditionalGeneration, T5Config

model = T5ForConditionalGeneration.from_pretrained("t5-small")
tokenizer = T5Tokenizer.from_pretrained("t5-small")


device = torch.device("cpu")

text = "input text"


# preprocess input text
preprocessed_text = text.strip().replace("\n", '')
input_text = "summarize:" + preprocessed_text

tokenized_text = tokenizer.encode(input_text, return_tensors='pt').to(device)

summary_ids = model.generate(tokenized_text, min_length =50, max_length = 200)
summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

print(summary)
