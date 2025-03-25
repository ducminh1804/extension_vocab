export const vocab = async (word) => {
  try {
    const response = await fetch("http://localhost:3000/extension", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word: word }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const addWord = async (word) => {
  try {
    const response = await fetch("http://localhost:3000/api/words", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(word),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
