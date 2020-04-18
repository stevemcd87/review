import React, { useState, useEffect, useContext, useRef } from "react";

import { useParams } from "react-router-dom";
import "./Styles/QuestionForm.css";
import ApiContext from "../../../contexts/ApiContext";
import CategoryContext from "../../../contexts/CategoryContext";
import MultipleChoice from "./MultipleChoice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

export default function QuestionForm(props) {
  let { subjectName, categoryName } = useParams(),
    { questionObject, questionNotes } = props,
    [questionType, setQuestionType] = useState(),
    imageInput = useRef(null),
    [imageSrc, setImageSrc] = useState(),
    [imageFile, setImageFile] = useState(),
    [isSubmitting, setIsSubmitting] = useState(false),
    [imageUpdated, setImageUpdated] = useState(false),
    [question, setQuestion] = useState(
      questionObject ? questionObject.question : ""
    ),
    [newAO, setNewAO] = useState(
      questionObject ? questionObject.answerOptions : []
    ),
    [answer, setAnswer] = useState(
      questionObject ? questionObject.answer : null
    ),
    { getCategoryNotes } = useContext(CategoryContext),
    { API, Auth, Storage, user } = useContext(ApiContext);

  // get image for Question Updates
  useEffect(() => {
    if (questionObject && questionObject.image) getImage();
  }, []);

  // set question type to trueFalse(default)
  useEffect(() => {
    setQuestionType("trueFalse");
  }, []);

  useEffect(() => {
    switch (questionType) {
      case "trueFalse":
        setNewAO([
          {
            id: Date.now() + "-" + "0",
            inputValue: "True"
          },
          {
            id: Date.now() + "-" + "1",
            inputValue: "False"
          }
        ]);
        break;
      case "multipleChoice":
        setNewAO([
          {
            id: Date.now() + "-" + "0",
            inputValue: ""
          },
          {
            id: Date.now() + "-" + "1",
            inputValue: ""
          },
          {
            id: Date.now() + "-" + "2",
            inputValue: ""
          },
          {
            id: Date.now() + "-" + "3",
            inputValue: ""
          }
        ]);
        break;
    }
  }, [questionType]);

  // when user uploads file
  useEffect(() => {
    if (imageFile) {
      let imageUrl = URL.createObjectURL(imageFile);
      setImageSrc(imageUrl);
      setImageUpdated(true);
    }
  }, [imageFile]);

  function getImage() {
    Storage.get(questionObject.image.replace("public/", ""))
      .then(res => {
        setImageSrc(res);
      })
      .catch(err => {
        alert(err);
        console.log(err);
      });
  }

  return (
    <div className="question-form form-component">
      <form className="form-content">
        {!questionObject && (
          <div className="question-types">
            <label className="question-type">
              True/ False
              <input
                type="radio"
                name="questionType"
                value="trueFalse"
                onChange={e => setQuestionType(e.target.value)}
                checked={questionType === "trueFalse" ? true : false}
              />
            </label>
            <label className="question-type">
              Multiple Choice
              <input
                type="radio"
                name="questionType"
                value="multipleChoice"
                onChange={e => setQuestionType(e.target.value)}
                checked={questionType === "multipleChoice" ? true : false}
              />
            </label>
          </div>
        )}

        <div className="image-input">
          <input
            className=""
            type="file"
            onChange={e => setImageFile(e.target.files["0"])}
            ref={imageInput}
          />
          {imageSrc && <img src={imageSrc} />}
        </div>
        <div className="question-div">
          <textarea
            className="question-textarea"
            type="text"
            defaultValue={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Question"
          />
        </div>
        <div className="answer-options-inputs">
          <div className="answer-options-div">
            {newAO.map((ao, ind, arr) => {
              return (
                <AnswerOption
                  key={ao.id}
                  answerOption={ao}
                  {...{
                    setAnswer,
                    answer,
                    removeAnswerOption,
                    updateAnswerOption
                  }}
                />
              );
            })}
          </div>
          <button
            type="button"
            onClick={addAnswerOption}
            title="Add an answer option"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
        <strong className="bind-notes">
          * Click
          <span className="icon">
            <FontAwesomeIcon icon={faPlus} color="black" />
          </span>
          on all notes you'd like to bind.
        </strong>
        <button type="button" onClick={prepQuestion}>
          Submit
        </button>
      </form>
    </div>
  );

  function formValidation(qv) {
    if (
      qv.question.length < 1 ||
      qv.answer.length < 1 ||
      !answerOptionsValid()
    ) {
      return false;
    } else {
      return true;
    }
  }

  function answerOptionsValid() {
    return newAO.every(questionElement => {
      return questionElement.inputValue.trim().length > 0;
    });
  }

  function prepQuestion() {
    console.log("prepQuestion");
    let questionValues = {
      username: user.username,
      question: question && question.trim(),
      answerOptions: newAO.map(v => v.inputValue),
      image: imageFile ? true : false,
      answer: newAO.find(v => v.id === answer.id).inputValue,
      questionNotes: questionNotes
    };
    // adds pathName to questionValues if there is one
    if (questionObject) questionValues.pathName = questionObject.pathName;
    if (questionObject && questionObject.image && !imageUpdated)
      questionValues.image = questionObject.image;
    console.log("questionValues");
    console.log(questionValues);
    submitForm(questionValues);
  }

  async function submitForm(qv) {
    let apiMethod = !questionObject ? "post" : "put",
      // path for backend api
      resourcePath = `/users/${user.username}/subjects/${subjectName}/categories/${categoryName}/questions`;
    // Validates form inputs // TODO:
    // Confirms user is signed in
    if (!user || !user.username) return alert("Must Sign In");
    // Disables submit button
    setIsSubmitting(true);
    return await API[apiMethod]("StuddieBuddie", resourcePath, {
      body: JSON.stringify(qv),
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession())
          .getIdToken()
          .getJwtToken()}`
      },
      response: true
    })
      .then(response => {
        getCategoryNotes().then(() => setIsSubmitting(false));
      })
      .catch(error => {
        setIsSubmitting(false);
        alert(error.response);
        console.log(error.response);
      });
  }

  function postQuestion(n) {
    API.post(
      "StuddieBuddie",
      `/subjects/${subjectName}/${categoryName}/questions`,
      {
        body: JSON.stringify(n)
      }
    )
      .then(response => {
        console.log("update question response");
        console.log(response);

        if (imageFile) {
          Storage.put(
            `${subjectName}/${categoryName}/QuestionImage/${user.user.username}/${response.pathName}`,
            imageFile
          )
            .then(res => {
              console.log("storage PUT  complete RES");
              console.log(res);
              setTimeout(function() {
                // getCategoryQuestions();
              }, 1500);
            })
            .catch(err => {
              console.log("err");
              console.log(err);
            });
        }

        if (!imageFile) {
          // getCategoryQuestions();
        }
      })
      .catch(error => {
        console.log("ERROR");
        console.log(error);
      });
  }

  function updateQuestion(q) {
    console.log("updateQuestion");
    API.put(
      "StuddieBuddie",
      `/subjects/${subjectName}/${categoryName}/questions/`,
      {
        body: JSON.stringify(q)
      }
    )
      .then(response => {
        console.log("update note response");
        console.log(response);
        if (imageFile && imageUpdated) {
          console.log("image");
          Storage.put(
            `${subjectName}/${categoryName}/QuestionImage/${user.user.username}/${q.pathName}`,
            imageFile
          )
            .then(res => {
              console.log("storage PUT  complete RES");
              console.log(res);
              setTimeout(function() {
                // getCategoryQuestions();
              }, 1500);
            })
            .catch(err => {
              console.log("err");
              console.log(err);
            });
        }
        if (!imageFile) {
          // getCategoryQuestions();
        }
      })
      .catch(error => {
        console.log(error.response);
      });
  }

  function removeAnswerOption(id) {
    if (newAO.length <= 2)
      return alert("Question requires at least 2 answer options");
    let ao = newAO.slice(),
      indexToRemove = ao.findIndex(v => v.id === id);
    ao.splice(indexToRemove, 1);
    setNewAO(ao);
  }

  function addAnswerOption() {
    setNewAO([
      ...newAO,
      { id: `${Date.now()}-${newAO.length}`, inputValue: "" }
    ]);
  }
  function updateAnswerOption(id, val) {
    let ao = newAO.slice(),
      indexToUpdate = ao.findIndex(v => v.id === id);
    ao[indexToUpdate].inputValue = val.trim();
    setNewAO(ao);
  }
} // End of component

function AnswerOption(props) {
  let {
      answerOption,
      setAnswer,
      answer,
      removeAnswerOption,
      updateAnswerOption
    } = props,
    [isAnswer, setIsAnswer] = useState(false),
    [klassName, setKlassName] = useState("");

  useEffect(() => {
    answer === answerOption ? setIsAnswer(true) : setIsAnswer(false);
  }, [answerOption, answer]);

  useEffect(() => {
    setKlassName(isAnswer ? "correct-answer" : "");
  }, [isAnswer]);

  return (
    <div className={`answer-option-div ${klassName}`}>
      <div className="edit-buttons">
        <button
          type="button"
          className={`select-answer ${klassName}`}
          onClick={() => setAnswer(answerOption)}
          title="Mark as correct answer"
        >
          <FontAwesomeIcon icon={faCheck} color={isAnswer ? "green" : "grey"} />
        </button>
        <button
          type="button"
          title="Delete answer option"
          onClick={() => removeAnswerOption(answerOption.id)}
        >
          <FontAwesomeIcon icon={faTrash} color="grey" />
        </button>
      </div>
      <textarea
        className="answer-option"
        defaultValue={answerOption.inputValue}
        placeholder="Answer Option"
        onChange={e => updateAnswerOption(answerOption.id, e.target.value)}
      />
    </div>
  );
}
