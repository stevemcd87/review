import React, { useState, useEffect, useContext, useRef } from "react";

import { useParams } from "react-router-dom";
import "./Styles/QuestionForm.css";
import ApiContext from "../../../../contexts/ApiContext";
import CategoryContext from "../../../../contexts/CategoryContext";
import MultipleChoice from "./MultipleChoice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function QuestionForm(props) {
  let { subjectName, categoryName } = useParams(),
    { questionObject } = props,
    [questionType, setQuestionType] = useState(),
    imageInput = useRef(null),
    [imageSrc, setImageSrc] = useState(),
    [imageFile, setImageFile] = useState(),
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
    answerOptionsRef = useRef(null),
    { getCategoryQuestions } = useContext(CategoryContext),
    { API, Storage, user } = useContext(ApiContext);

  // get image for updates
  useEffect(() => {
    if (questionObject && questionObject.image) getImage();
  }, []);

  // set question type to trueFalse(default)
  useEffect(() => {
    setQuestionType('trueFalse')
  }, []);

  useEffect(() => {
    console.log(newAO);
  }, [newAO]);

  useEffect(() => {
    switch (questionType) {
      case "trueFalse":
        setNewAO(["True", "False"]);
        break;
      case "multipleChoice":
        setNewAO(["", "", "", ""]);
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
    console.log("get Image question");
    Storage.get(questionObject.image.replace("public/", ""))
      .then(res => {
        console.log("image res");
        console.log(res);
        setImageSrc(res);
      })
      .catch(err => {
        console.log(err);
      });
  }

  return (
    <div className="question-form">
      {!questionObject && (
        <div>
          <label>
            True/ False
            <input
              type="radio"
              name="questionType"
              value="trueFalse"
              onClick={e => setQuestionType(e.target.value)}
              checked={questionType === "trueFalse"? true:false}
            />
          </label>
          <label>
            Multiple Choice
            <input
              type="radio"
              name="questionType"
              value="multipleChoice"
              onClick={e => setQuestionType(e.target.value)}
              checked={questionType === "multipleChoice"? true:false}
            />
          </label>
        </div>
      )}

      <div className="image-div">
        <input
          className="image-input"
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
        <div className="answer-options-div" ref={answerOptionsRef}>
          {/*answerOptions.map(questionInputComponent => questionInputComponent)*/}
          {newAO.map((ao, ind,arr) => {
            return (
              <AnswerOptionsInput
                key={ao + ind}
                answerOption={ao}
                {...{ setAnswer, answer, removeAnswerOptionInput }}
                answerOptionsCount={arr.length}
              />
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setNewAO(...newAO, "")}
        >
          Add Answer Option
        </button>
      </div>

      <button type="button" onClick={prepQuestion}>
        {!questionObject ? "Post Question" : "Update Question"}
      </button>
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
    return [...answerOptionsRef.current.querySelectorAll(".question")].every(
      questionElement => {
        return questionElement.value.trim().length > 0;
      }
    );
  }

  function prepQuestion() {
    console.log("prepQuestion");
    let questionValues = {
      username: user.user.username,
      question: question && question.trim(),
      answerOptions: [],
      image: imageFile ? true : false,
      answer: answer && answer.trim()
    };
    // adds pathName to questionVAlues if there is one
    console.log("imageUpdated");
    console.log(imageUpdated);

    if (questionObject) questionValues.pathName = questionObject.pathName;
    if (questionObject && questionObject.image && !imageUpdated)
      questionValues.image = questionObject.image;
    console.log("questionValues");
    console.log(questionValues);
    // pushes all answerOptions into the questionValues.answerOptions
    [...answerOptionsRef.current.querySelectorAll(".answer-option")].forEach(
      questionElement => {
        questionValues.answerOptions.push(questionElement.value.trim());
      }
    );
    !questionObject
      ? postQuestion(questionValues)
      : updateQuestion(questionValues);
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
                getCategoryQuestions();
              }, 1500);
            })
            .catch(err => {
              console.log("err");
              console.log(err);
            });
        }
        if (!imageFile) {
          getCategoryQuestions();
        }
      })
      .catch(error => {
        console.log(error.response);
      });
  }

  function removeAnswerOptionInput(ind) {
    let ao = newAO.slice();
    ao.splice(ind, 1);
    setNewAO(ao);
  }
} // End of component

function AnswerOptionsInput(props) {
  let {
      answerOption,
      setAnswer,
      answer,
      removeAnswerOptionInput,
      ind,
      answerOptionsCount
    } = props,
    answerOptionDiv = useRef();

  useEffect(() => {
    console.log(ind);
    if (answer === answerOption)
      answerOptionDiv.current.classList.add("correct-answer");
    else answerOptionDiv.current.classList.remove("correct-answer");
  }, []);

  return (
    <div className="answer-option-div" ref={answerOptionDiv}>
      <button className="select-answer" onClick={() => setAnswer(answerOption)}>
        <FontAwesomeIcon icon={faCheck} />
      </button>
      <textarea className="answer-option" defaultValue={answerOption} />
      <button
        onClick={
          answerOptionsCount > 2
            ? () => removeAnswerOptionInput(ind)
            : () => alert("Must Have at least 2 answer options")
        }
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );
}
