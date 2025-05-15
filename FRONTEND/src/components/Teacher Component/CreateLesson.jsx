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

    console.log("Created Lesson:", createdLesson);

    for (const topic of topics) {
      const createdTopic = await LessonService.addTopic(createdLesson.id, {
        title: topic.title,
      });

      console.log("Created Topic:", createdTopic);

      for (const subtopic of topic.subtopics) {
        const result = await LessonService.addSubtopic(createdLesson.id, createdTopic.id, {
          title: subtopic.title,
          content: subtopic.content,
        });
        console.log("Created Subtopic:", result);
      }
    }

    alert("Lesson created successfully!");
    setLessonTitle("");
    setLessonDescription("");
    setTopics([]);
  } catch (error) {
    console.error("Failed to create lesson:", error);
    alert("Failed to create lesson. " + error.message);
  }
};


  return (
    <div style={{ padding: 20 }}>
      <h2>Create Lesson</h2>
      <div>
        <input
          type="text"
          placeholder="Lesson Title"
          value={lessonTitle}
          onChange={(e) => setLessonTitle(e.target.value)}
        />
      </div>
      <div>
        <textarea
          placeholder="Lesson Description"
          value={lessonDescription}
          onChange={(e) => setLessonDescription(e.target.value)}
        />
      </div>
      <hr />
      {topics.map((topic, topicIndex) => (
        <div key={topicIndex} style={{ marginBottom: 20 }}>
          <input
            type="text"
            placeholder="Topic Title"
            value={topic.title}
            onChange={(e) => handleTopicChange(topicIndex, e.target.value)}
          />
          <button onClick={() => handleAddSubtopic(topicIndex)}>+ Add Subtopic</button>
          {topic.subtopics.map((sub, subIndex) => (
            <div key={subIndex} style={{ marginLeft: 20 }}>
              <input
                type="text"
                placeholder="Subtopic Title"
                value={sub.title}
                onChange={(e) => handleSubtopicChange(topicIndex, subIndex, "title", e.target.value)}
              />
              <textarea
                placeholder="Subtopic Content"
                value={sub.content}
                onChange={(e) => handleSubtopicChange(topicIndex, subIndex, "content", e.target.value)}
              />
            </div>
          ))}
        </div>
      ))}
      <button onClick={handleAddTopic}>+ Add Topic</button>
      <br />
      <button onClick={handleSubmit}>Create Lesson</button>
    </div>
  );
}
