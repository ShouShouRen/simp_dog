import { useState } from "react";
import { OpenAI } from "openai";
import axios from "axios";
import "./index.css";
import "./App.css";

function App() {
  const [inputText, setInputText] = useState("");
  const [history, setHistory] = useState([]);

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, // 開啟這個選項來允許在瀏覽器中使用
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentInput = inputText;

    try {
      const response = await axios.post("http://35.234.3.155:5000/predict", {
        text: currentInput,
      });
      const currentResult = response.data.prediction;

      if (currentResult === "你是純情男") {
        setHistory((prevHistory) => [
          ...prevHistory,
          { input: currentInput, result: currentResult },
        ]);
      } else {
        const gptResponse = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "請以討厭的語氣回應以下所有問題。" },
            { role: "user", content: currentInput },
          ],
          temperature: 0.7,
        });

        console.log(gptResponse.choices[0], "gptResponse");

        const gptResult = gptResponse.choices[0].message.content;

        setHistory((prevHistory) => [
          ...prevHistory,
          {
            input: currentInput,
            result: `${currentResult} (GPT 回應: ${gptResult})`,
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching prediction:", error);

      // 錯誤結果到歷史記錄
      setHistory((prevHistory) => [
        ...prevHistory,
        { input: currentInput, result: "發生錯誤" },
      ]);
    } finally {
      setInputText("");
    }
  };

  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-center font-bold text-5xl text-[#ECECEC] p-8">
        舔狗分類器
      </h1>
      <div className="flex flex-col justify-between h-[70vh] border-8 border-[#ECECEC] rounded-lg p-4">
        <div className="flex-grow overflow-auto h-[50vh]">
          {history.map((item, index) => (
            <div key={index} className="mt-4">
              <p className="ms-auto bg-[#444654] w-fit p-4 rounded-3xl my-4">
                您: {item.input}
              </p>
              <p className="me-auto bg-[#444654] w-fit p-4 rounded-3xl my-4">
                結果: {item.result}
              </p>
            </div>
          ))}
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex justify-between max-w-2xl w-full bg-[#2E2E2E] mx-auto rounded-lg overflow-hidden"
        >
          <input
            type="text"
            placeholder="請輸入你想要判斷的內容"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="input w-full outline-none bg-[#2E2E2E] text-white p-4"
          />
          <button
            type="submit"
            className="bg-[#ECECEC] text-[#2E2E2E] p-4"
            disabled={!inputText}
          >
            預測
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
