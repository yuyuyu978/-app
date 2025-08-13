const chat = document.getElementById('chat');
const inputText = document.getElementById('inputText');
const sendBtn = document.getElementById('sendBtn');
const voiceBtn = document.getElementById('voiceBtn');

let conversation = [
    {role:'system', content:'あなたは親しみやすく短く答える日本語の秘書AIです。'}
];

sendBtn.onclick = async () => {
    const text = inputText.value.trim();
    if(!text) return;
    appendMessage('user', text);
    inputText.value = '';
    await sendToAI(text);
};

function appendMessage(role, text){
    const div = document.createElement('div');
    div.className = role;
    div.innerText = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

async function sendToAI(userText){
    conversation.push({role:'user', content:userText});
    try {
        const response = await fetch('https://secretary-api.vercel.app/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer <https://api.openai.com/v1/chat/completions>'
            },
            body: JSON.stringify({ model:'gpt-4o-mini', messages:conversation, temperature:0.7 })
        });
        const data = await response.json();
        const reply = data.choices[0].message.content;
        conversation.push({role:'assistant', content:reply});
        appendMessage('assistant', reply);
        speak(reply);
    } catch(e){
        appendMessage('assistant','エラー: '+e.message);
    }
}

// 音声入力
voiceBtn.onclick = () => {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.onresult = e => {
        inputText.value = e.results[0][0].transcript;
        sendBtn.click();
    };
    recognition.start();
};

// 音声読み上げ
function speak(text){
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    speechSynthesis.speak(utterance);
}