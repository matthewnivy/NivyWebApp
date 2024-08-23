import React, { Suspense } from "react";
import { allStrings } from "../../commons";
import ReactLoading from "react-loading";
import "./UpdateAccount.scss";

const FieldContainer = React.lazy(() =>
  import("../../components/field-container/fieldContainer")
);

const UpdateAccountForm = (props) => {
  const {
    handleSubmission,
    handleChange,
    primaryColor,
    addToRefs,
    errorMessage,
    inputRefs,
    fields,
  } = props;

  return (
    <Suspense
      fallback={
        <div className={"loader"}>
          <ReactLoading
            type={"spin"}
            height={"20%"}
            width={"20%"}
            className="load"
          />
        </div>
      }
    >
      <form
        className="modalForm"
        style={{ padding: "1rem" }}
        onSubmit={handleSubmission}
        onChange={handleChange}
      >
        {fields.map((field, index) => (
          <FieldContainer
            placeholder={field.placeholder}
            key={index}
            inputType={field.type}
            isEditable={field.isEditable}
            referalKey={field.key}
            color={primaryColor}
            id={field.id}
            addToRefs={addToRefs}
            error={errorMessage}
            errorKey={field.errorKey}
            inputRefs={inputRefs}
            val={field.value}
          />
        ))}
        <input
          type="submit"
          value={allStrings.saveChanges}
          className="submitBtn"
          style={{
            backgroundColor: `#${primaryColor}`,
            border: `#${primaryColor}`,
            padding: "0.55rem",
          }}
        />
      </form>
    </Suspense>
  );
};

export default UpdateAccountForm;
