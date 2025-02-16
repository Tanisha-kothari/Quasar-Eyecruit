"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"

export default function Home() {
  const [skills, setSkills] = useState<string>("")
  const [questions, setQuestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [difficulty, setDifficulty] = useState<string | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!skills || !difficulty) return

    setLoading(true)
    const skillsList = skills.split(',').map(skill => skill.trim())

    try {
      const response = await axios.post("http://localhost:3001/generate-questions", {
        skills: skillsList,
        difficulty,
      })
      setQuestions(response.data.questions)
      setCurrentQuestionIndex(0)
    } catch (error) {
      console.error("Error generating questions:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (questions.length > 0) {
      const timer = setInterval(() => {
        setCurrentQuestionIndex((prevIndex) => (prevIndex === questions.length - 1 ? 0 : prevIndex + 1))
      }, 20000)

      return () => clearInterval(timer)
    }
  }, [questions])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">EyeCruit</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
            Enter Skills (comma-separated)
          </label>
          <input
            type="text"
            id="skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="e.g., JavaScript, Python, React"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select Difficulty</label>
          <div className="mt-2">
            {["basic", "intermediate", "advanced"].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`mr-2 px-4 py-2 text-sm font-medium rounded-md ${
                  difficulty === level ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <button
          type="submit"
          disabled={!skills || !difficulty || loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? "Generating..." : "Generate Questions"}
        </button>
      </form>

      {/* Show Preloader GIF when loading
      {loading && (
        <div className="flex justify-center items-center h-40">
          <img src="/preloader.gif" alt="Loading..." className="w-16 h-16" />
        </div>
      )} */}

      {/* Show Questions when available */}
      {!loading && questions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Generated Question:</h2>
          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="text-lg font-bold" style={{ fontSize: "10px" }}>
              {questions[currentQuestionIndex]}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
