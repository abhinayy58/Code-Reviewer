import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import "./App.css";

function App() {
  const [code, setCode] = useState(` function getUserName(user) {
        if (user.firstName && user.lastName) {
            return user.firstName + " " + user.lastName;
        } else if (user.name) {
            return user.name;
        }
        return "Guest";
    }`);

  const [review, setReview] = useState(``);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/ai/get-review", {
        prompt: code,
      });
      setReview(response.data);
    } catch (error) {
      setReview("Error fetching review.");
    } finally {
      setLoading(false);
    }
  }

  function codeClear() {
    setCode("");
    setReview("");
  }

  return (
    <>
      <header
        style={{
          textAlign: "center",
          padding: "1rem",
          fontSize: "2rem",
          fontWeight: "bold",
        }}
      >
        Code Reviewer
      </header>
      {loading && (
        <div className="backdrop-loader">
          <div className="loader-content">Reviewing code...</div>
        </div>
      )}

      <main>
        <div className="left">
          <div onClick={codeClear} className="clear">
            Clear
          </div>
          <div className="code">
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) =>
                prism.highlight(code, prism.languages.javascript, "javascript")
              }
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%",
              }}
            />
          </div>
          <div onClick={reviewCode} className="review">
            Review
          </div>
        </div>
        <div className="right">
          <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
        </div>
      </main>
    </>
  );
}

export default App;
