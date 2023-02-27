# Linebot-Openai
這是一個串接 OpenAI GPT-3 API 與 Line 的聊天機器人。可用 "Setting:" 關鍵字設定角色個性或功能，不論是想獲得一隻機器貓貓或體驗一下被渣的感覺，AI 都能實現你的願望！

![image](/public/images/linebot-openai.png)

## Preparation
- 建立 OpenAI 帳戶，取得 API KEY
- 建立 Line Bot Channel，取得 Secret 與 Token
- 下載 Ngrok，以便在本地實現 https 連線進行測試

## Getting Start

1. Clone the project

```
git clone https://github.com/flowerhahaha/linebot-openai.git
```

2. Install the required dependencies

```
npm install
```

3. Install nodemon 

```
npm i nodemon
```

4. Set environment variables in .env file according to .env.example

```
PORT=3000
channelAccessToken=YOUR_CHANNEL_ACCESS_TOKEN
channelSecret=YOUR_CHANNEL_SECRET
OPENAI_API_KEY=YOUR_SECRET_KEY
```

5. Start ngrok in the directory where ngrok is located. 

```
ngrok http 3000
```

6. Append /webhook to the URL provided by ngrok, and paste to the webhook link in the Line console.
```
https://abcd.fefw.23gr.ngrok.io/webhook 
```

7. Start the server

```
npm run dev
```

8. Execute successfully if seeing following message

```
App is running on http://localhost:3000
```

## Built With
-  Runtime: node @ 16.14.2
-  Framework: express @ 4.18.2
-  Check package.json for other dependencies
