# web_terminal

## how to run web terminal
run node index.js

### after launch web terminal, go to llama.cpp directory
cd llama.cpp

### make sure you have model(https://huggingface.co/eachadea/ggml-vicuna-13b-4bit/resolve/main/ggml-vicuna-13b-4bit.bin) inside of llama.cpp/model 

### then call the below code

make && ./main -i --interactive-first -r "### Human:" -t 8 --temp 0 -c 2048 -n -1 --ignore-eos --repeat_penalty 1.2 --instruct -m ./models/ggml-vicuna-13b-4bit.bin

### if you want to copy and paste, do it. this will automatically add "\" in end of the line. 
### if you want to change the line, shift+enter


<img width="1149" alt="Screenshot 2023-04-06 at 9 07 03 PM" src="https://user-images.githubusercontent.com/5060944/230387633-30a46b66-a905-4e99-885c-d2e52a1dae1a.png">
