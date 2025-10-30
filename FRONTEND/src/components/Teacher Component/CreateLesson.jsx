import React, { useState } from "react";
import LessonService from "../../services/LessonService.jsx";

export default function CreateLesson() {
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [topics, setTopics] = useState([]);

  const handleAddTopic = () => {
    setTopics([...topics, { title: "", subtopics: [] }]);
  };

  const handleTopicChange = (index, value) => {
    const newTopics = [...topics];
    newTopics[index].title = value;
    setTopics(newTopics);
  };

  const handleAddSubtopic = (topicIndex) => {
    const newTopics = [...topics];
    newTopics[topicIndex].subtopics.push({ title: "", content: "" });
    setTopics(newTopics);
  };

  const handleSubtopicChange = (topicIndex, subtopicIndex, field, value) => {
    const newTopics = [...topics];
    newTopics[topicIndex].subtopics[subtopicIndex][field] = value;
    setTopics(newTopics);
  };

  const handleSubmit = async () => {
    try {
      const createdLesson = await LessonService.createLesson({
        title: lessonTitle,
        description: lessonDescription,
      });

      for (const topic of topics) {
        const updatedLesson = await LessonService.addTopic(createdLesson.id, {
          title: topic.title,
        });

        const createdTopic = updatedLesson.topics[updatedLesson.topics.length - 1];

        for (const subtopic of topic.subtopics) {
          await LessonService.addSubtopic(createdLesson.id, createdTopic.id, {
            title: subtopic.title,
            content: subtopic.content,
          });
        }
      }

      alert("🎉 Lesson created successfully!");
      setLessonTitle("");
      setLessonDescription("");
      setTopics([]);
    } catch (error) {
      console.error("Failed to create lesson:", error);
      alert("❌ Failed to create lesson. " + error.message);
    }
  };

  const styles = {
    container: {
      fontFamily: "Orbitron, sans-serif",
      backgroundColor: "#0f0f0f",
      color: "#00ffcc",
      padding: 30,
      borderRadius: 10,
      maxWidth: "90vw",
      margin: "auto",
      boxShadow: "0 0 20px #00ffcc",
      margin: "5px"
    },
    input: {
      width: "100%",
      padding: 10,
      marginBottom: 10,
      backgroundColor: "#1a1a1a",
      border: "1px solid #00ffcc",
      borderRadius: 5,
      color: "#fff",
    },
    textarea: {
      width: "100%",
      padding: 10,
      marginBottom: 10,
      backgroundColor: "#1a1a1a",
      border: "1px solid #00ffcc",
      borderRadius: 5,
      color: "#fff",
      resize: "vertical",
    },
    button: {
      backgroundColor: "#00ffcc",
      color: "#000",
      border: "none",
      padding: "10px 20px",
      margin: "10px 5px 20px 0",
      borderRadius: 5,
      cursor: "pointer",
      fontWeight: "bold",
      transition: "0.3s",
    },
    subtopicContainer: {
      marginLeft: 30,
      marginTop: 10,
      paddingLeft: 15,
      borderLeft: "2px solid #00ffcc",
    },
    topicBlock: {
      marginBottom: 30,
      paddingBottom: 10,
      borderBottom: "1px solid #00ffcc",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: "center", textShadow: "0 0 5px #00ffcc" }}>
        🎮 Create Lesson
      </h2>

      <input
        type="text"
        style={styles.input}
        placeholder="🎯 Lesson Title"
        value={lessonTitle}
        onChange={(e) => setLessonTitle(e.target.value)}
      />

      <textarea
        placeholder="📝 Lesson Description"
        style={styles.textarea}
        value={lessonDescription}
        onChange={(e) => setLessonDescription(e.target.value)}
      />

      <hr style={{ borderColor: "#00ffcc" }} />

      {topics.map((topic, topicIndex) => (
        <div key={topicIndex} style={styles.topicBlock}>
          <input
            type="text"
            style={styles.input}
            placeholder={`🧠 Topic #${topicIndex + 1} Title`}
            value={topic.title}
            onChange={(e) => handleTopicChange(topicIndex, e.target.value)}
          />
          <button
            style={styles.button}
            onClick={() => handleAddSubtopic(topicIndex)}
          >
            ➕ Add Subtopic
          </button>

          {topic.subtopics.map((sub, subIndex) => (
            <div key={subIndex} style={styles.subtopicContainer}>
              <input
                type="text"
                style={styles.input}
                placeholder={`📌 Subtopic #${subIndex + 1} Title`}
                value={sub.title}
                onChange={(e) =>
                  handleSubtopicChange(topicIndex, subIndex, "title", e.target.value)
                }
              />
              <textarea
                placeholder="🧾 Subtopic Content"
                style={styles.textarea}
                value={sub.content}
                onChange={(e) =>
                  handleSubtopicChange(topicIndex, subIndex, "content", e.target.value)
                }
              />
            </div>
          ))}
        </div>
      ))}

      <button style={styles.button} onClick={handleAddTopic}>
        ➕ Add Topic
      </button>

      <button
        style={{
          ...styles.button,
          backgroundColor: "#ff00ff",
          color: "#fff",
        }}
        onClick={handleSubmit}
      >
        🚀 Create Lesson
      </button>
    </div>
  );
}
