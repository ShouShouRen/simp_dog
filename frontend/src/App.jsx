import { useState } from "react";
import axios from "axios";
import "./index.css";
import "./App.css";

function App() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState("");
  const [userInput, setUserInput] = useState("");
  // const [loading, setLoading] = useState(false);
  // const [displayText, setDisplayText] = useState("");

  // useEffect(() => {
  //   const message = "您好有什麼地方需要幫忙的嗎？";
  //   let index = 0;

  //   const typeWriter = () => {
  //     if (index < message.length) {
  //       setDisplayText((prev) => prev + message.charAt(index));
  //       index++;
  //       setTimeout(typeWriter, 100);
  //     }
  //   };

  //   setDisplayText(""); // Initialize displayText to an empty string
  //   typeWriter();
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);
    setUserInput(inputText);
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        text: inputText,
      });
      setResult(response.data.prediction);
      setInputText("");
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setResult("發生錯誤");
    } finally {
      setTimeout(() => {
        // setLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-center font-bold text-5xl text-[#ECECEC] p-8">
        舔狗分類器
      </h1>
      <div className="flex flex-col justify-between h-[70vh] border-8 border-[#ECECEC] rounded-lg p-4">
        <div className="flex-grow">
          <div className="mt-4">
            <p className="text-right">您: {userInput}</p>
            <p>結果: {result}</p>
          </div>
          <div className="mt-4">
            {/* <p>{displayText}</p> */}
          </div>
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
