"use client"

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [companyName, setCompanyName] = useState("");
  const [category, setCategory] = useState("");
  const [citations, setCitations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const response = await fetch("/api/getCompanyInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ companyName }),
    });
    const data = await response.json();
    //console.log(data);

    const resultCitations = data.result.citations || [];
    //console.log(resultCitations);
    setCitations(resultCitations);

    //const resultContent = data.result.choices.map((choice: { message: { content: any; }; }) => choice.message.content).join("\n");
    const resultContent = data.result.choices.map((choice: { message: { content: string; }; }) => choice.message.content).join("\n");

    //console.log(resultContent);
    
    const extractedWords = resultContent.match(/\*\*([^*]+)\*\*/g)?.map((word: string) => word.replace(/\*\*/g, '')) || [];
    const formattedCategory = extractedWords.join(", ");
    //console.log(formattedCategory);
    setCategory(formattedCategory);
    setLoading(false);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          src="/researcher.png"
          alt="Next.js logo"
          width={980}
          height={250}
          priority
        />
<form onSubmit={handleSubmit} className="flex flex-col gap-4">
  <div className="flex items-center gap-2">
  <input
      type="text"
      value={companyName}
      onChange={(e) => setCompanyName(e.target.value)}
      placeholder="例: 株式会社XXX"
      className="border p-2 rounded w-96 dark:text-black"
    />
    <button
      type="submit"
      className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
    >
      調査する
    </button>
  <p className="text-md text-gray-500 mt-2">
    企業名は正式名称の方が精度が良くなります
  </p>
  </div>
</form>
  <p className="text-md text-gray-500 mt-2">
    （ver0.1 はカテゴリー調査の結果のみ表示します）
  </p>
{loading &&(
  <div className="flex justify-center" aria-label="読み込み中">
  <div className="animate-ping h-3 w-3 bg-blue-600 rounded-full"></div>
  <div className="animate-ping h-3 w-3 bg-blue-600 rounded-full mx-4"></div>
  <div className="animate-ping h-3 w-3 bg-blue-600 rounded-full"></div>
</div>
)
}
        {category && (
          <div className="mt-4 p-4 border rounded bg-white dark:bg-gray-800">
            <h2 className="text-lg font-bold">カテゴリー</h2>
            <p>{category}</p>
          </div>
        )}
        {citations.length > 0 && (
          <div className="mt-4 p-4 border rounded bg-white dark:bg-gray-800">
            <h2 className="text-lg font-bold">引用元URL</h2>
            <ul>
              {citations.map((url: string, index: number) => (
                <li key={index}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500">{url}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}