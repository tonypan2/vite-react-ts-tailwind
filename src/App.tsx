import "./App.css";

import { useEffect, useMemo, useState } from "react";

const MAX_SUGGESTIONS = 10;

function segmentMany(haystack: string, needles: string[]) {
  const validNeedles = needles.filter((needle) => needle !== "");

  if (validNeedles.length === 0) {
    return undefined;
  }

  const allPresent = validNeedles.every((needle) =>
    haystack.toLowerCase().includes(needle.toLowerCase())
  );

  if (!allPresent) {
    return undefined;
  }

  const result = [];
  let lastIndex = 0;

  const positions = [];
  for (const needle of validNeedles) {
    let position = haystack.toLowerCase().indexOf(needle.toLowerCase());
    while (position !== -1) {
      positions.push({
        position: position,
        needle: needle,
        endPosition: position + needle.length,
      });
      position = haystack
        .toLowerCase()
        .indexOf(needle.toLowerCase(), position + 1);
    }
  }

  positions.sort((a, b) => a.position - b.position);

  const filteredPositions = [];
  for (let i = 0; i < positions.length; i++) {
    const current = positions[i];
    if (
      i === 0 ||
      current.position >=
        filteredPositions[filteredPositions.length - 1].endPosition
    ) {
      filteredPositions.push(current);
    }
  }

  for (const { position, _, endPosition } of filteredPositions) {
    if (position > lastIndex) {
      result.push({ str: haystack.substring(lastIndex, position) });
    }

    result.push({
      str: haystack.substring(position, endPosition),
      match: true,
    });
    lastIndex = endPosition;
  }

  if (lastIndex < haystack.length) {
    result.push({ str: haystack.substring(lastIndex) });
  }

  return result;
}

function App() {
  const [dictionary, setDictionary] = useState<string[]>([]);
  const [inputText, setInputText] = useState<string>("");

  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        const response = await fetch(
          "https://autocomplete-wordlist.vercel.app"
        );

        // TODO cache this in localstorage?
        // TODO dedupe
        const parsedWords = (await response.text())
          .split("\n")
          .map((word) => word.trim())
          .filter((word) => word.length > 0);

        setDictionary(parsedWords);
      } catch (error) {
        console.error("Error fetching dictionary:", error);
      }
    };

    void fetchDictionary();
  }, []);

  const matches = useMemo(() => {
    const needle = inputText.trim();

    if (needle.length === 0) {
      return [];
    }

    const timngStart = performance.now();

    const matchedWords: {
      word: string;
      positions: {
        str: string;
        match?: boolean;
      }[];
    }[] = [];

    for (const word of dictionary) {
      const haystack = word.toLowerCase();
      if (haystack.includes(needle.split(" ")[0].toLowerCase())) {
        const positions = segmentMany(word, needle.split(" "));
        if (positions !== undefined) {
          matchedWords.push({
            word,
            positions,
          });
        }
      }

      if (matchedWords.length >= MAX_SUGGESTIONS) {
        break;
      }
    }

    const timerStop = performance.now();

    console.log(timerStop - timngStart);
    return matchedWords.slice(0, MAX_SUGGESTIONS);
  }, [inputText, dictionary]);

  return (
    <div
      className={`
        flex h-screen flex-col items-center justify-center gap-10 p-10
      `}
    >
      <h1 className="text-3xl font-bold underline">What's on your mind?</h1>
      <div className="flex w-full flex-col">
        <input
          type="search"
          placeholder="Type something..."
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
          }}
          className="rounded-md border-2 border-gray-300 p-2"
        />

        <div>
          {matches.map((match) => {
            const { positions } = match;

            const elements = positions.map((pos) => {
              const { str, match } = pos;
              if (match) {
                return <span key={`match-${str}`}>{str}</span>;
              } else {
                return (
                  <span key={`match-${str}`}>
                    <b>{str}</b>
                  </span>
                );
              }
            });

            return (
              <div
                className={`
                  cursor-pointer
                  hover:bg-gray-200
                `}
                key={match.word}
                onClick={(e) => {
                  alert(`You clicked on ${match.word} with input ${inputText}`);
                }}
              >
                {elements}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
